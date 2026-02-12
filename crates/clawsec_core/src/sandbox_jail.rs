use std::ffi::CString;
use std::fs::{self, File};
use std::io::{self, Write};
use std::os::unix::io::AsRawFd;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::ptr;

#[repr(C)]
struct CloneArgs {
    stack: *mut u8,
    stack_top: *mut u8,
}

pub struct JailConfig {
    pub root_dir: PathBuf,
    pub hostname: String,
    pub memory_limit_mb: u64,
    pub allow_net: bool,
    pub uid: u32,
    pub gid: u32,
}

impl Default for JailConfig {
    fn default() -> Self {
        JailConfig {
            root_dir: PathBuf::from("/var/lib/clawsec/jail"),
            hostname: "claw-sandbox".to_string(),
            memory_limit_mb: 512,
            allow_net: false,
            uid: 65534,
            gid: 65534,
        }
    }
}

pub struct Jail {
    config: JailConfig,
    active_pid: Option<i32>,
}

impl Jail {
    pub fn new(config: JailConfig) -> Self {
        Jail {
            config,
            active_pid: None,
        }
    }

    pub fn prepare_filesystem(&self) -> io::Result<()> {
        if !self.config.root_dir.exists() {
            fs::create_dir_all(&self.config.root_dir)?;
        }
        
        let proc_path = self.config.root_dir.join("proc");
        if !proc_path.exists() {
            fs::create_dir(&proc_path)?;
        }

        Ok(())
    }

    pub fn apply_cgroups(&self, pid: i32) -> io::Result<()> {
        let cgroup_path = Path::new("/sys/fs/cgroup/memory/clawsec");
        if !cgroup_path.exists() {
            fs::create_dir_all(cgroup_path)?;
        }

        let limit_bytes = self.config.memory_limit_mb * 1024 * 1024;
        let mut f_limit = File::create(cgroup_path.join("memory.limit_in_bytes"))?;
        f_limit.write_all(limit_bytes.to_string().as_bytes())?;

        let mut f_tasks = File::create(cgroup_path.join("tasks"))?;
        f_tasks.write_all(pid.to_string().as_bytes())?;

        Ok(())
    }

    pub unsafe fn enter(&mut self) -> io::Result<()> {
        let root_c = CString::new(self.config.root_dir.to_str().unwrap()).unwrap();
        let hostname_c = CString::new(self.config.hostname.clone()).unwrap();

        if libc::unshare(libc::CLONE_NEWNS | libc::CLONE_NEWUTS | libc::CLONE_NEWPID) != 0 {
            return Err(io::Error::last_os_error());
        }

        if libc::sethostname(hostname_c.as_ptr() as *const i8, self.config.hostname.len()) != 0 {
            return Err(io::Error::last_os_error());
        }

        if libc::chroot(root_c.as_ptr()) != 0 {
            return Err(io::Error::last_os_error());
        }

        if libc::chdir(b"/\0".as_ptr() as *const i8) != 0 {
            return Err(io::Error::last_os_error());
        }

        if libc::mount(
            b"proc\0".as_ptr() as *const i8,
            b"/proc\0".as_ptr() as *const i8,
            b"proc\0".as_ptr() as *const i8,
            0,
            ptr::null(),
        ) != 0 {
           return Err(io::Error::last_os_error());
        }

        self.drop_privileges()?;

        Ok(())
    }

    unsafe fn drop_privileges(&self) -> io::Result<()> {
        if libc::setgid(self.config.gid) != 0 {
            return Err(io::Error::last_os_error());
        }
        if libc::setuid(self.config.uid) != 0 {
            return Err(io::Error::last_os_error());
        }
        Ok(())
    }

    pub fn execute_command(&self, cmd: &str, args: &[&str]) -> io::Result<()> {
        let status = Command::new(cmd)
            .args(args)
            .stdin(Stdio::null())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .env_clear()
            .env("PATH", "/bin:/usr/bin")
            .env("HOME", "/")
            .spawn()?;

        let pid = status.id() as i32;
        self.apply_cgroups(pid)?;

        Ok(())
    }

    pub fn terminate(&self) -> io::Result<()> {
        if let Some(pid) = self.active_pid {
            unsafe {
                libc::kill(pid, libc::SIGKILL);
            }
        }
        Ok(())
    }
}

pub fn check_compatibility() -> bool {
    let path = Path::new("/proc/self/ns/user");
    path.exists()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_config_defaults() {
        let config = JailConfig::default();
        assert_eq!(config.memory_limit_mb, 512);
        assert_eq!(config.uid, 65534);
    }
}
