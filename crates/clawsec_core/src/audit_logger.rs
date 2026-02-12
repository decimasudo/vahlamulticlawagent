use std::fs::{File, OpenOptions};
use std::io::{self, Write, BufWriter};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};

const LOG_MAGIC_HEADER: &[u8] = b"CLAWSEC_AUDIT_V1";
const MAX_LOG_SIZE_BYTES: u64 = 10 * 1024 * 1024; // 10MB

#[derive(Debug, Clone)]
pub enum AuditSeverity {
    Info,
    AccessGranted,
    AccessDenied,
    SystemChange,
    IntegrityViolation,
}

#[derive(Debug)]
pub struct AuditEntry {
    timestamp: u64,
    severity: AuditSeverity,
    actor_id: String,
    action: String,
    resource: String,
    checksum: String,
}

impl AuditEntry {
    pub fn new(severity: AuditSeverity, actor: &str, action: &str, resource: &str) -> Self {
        AuditEntry {
            timestamp: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
            severity,
            actor_id: actor.to_string(),
            action: action.to_string(),
            resource: resource.to_string(),
            checksum: String::new(), // Calculated later
        }
    }

    pub fn serialize(&self) -> Vec<u8> {
        let mut buffer = Vec::new();
        buffer.extend_from_slice(&self.timestamp.to_be_bytes());
        buffer.extend_from_slice(self.actor_id.as_bytes());
        buffer.push(0); // Null terminator
        buffer.extend_from_slice(self.action.as_bytes());
        buffer.push(0);
        buffer
    }
}

pub struct AuditLogger {
    base_path: PathBuf,
    current_file: Arc<Mutex<BufWriter<File>>>,
    current_size: Arc<Mutex<u64>>,
    retention_days: u32,
}

impl AuditLogger {
    pub fn new(path: &Path, retention: u32) -> io::Result<Self> {
        if !path.exists() {
            std::fs::create_dir_all(path)?;
        }

        let log_file_path = path.join("current.audit");
        let file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&log_file_path)?;

        let size = file.metadata()?.len();

        Ok(AuditLogger {
            base_path: path.to_path_buf(),
            current_file: Arc::new(Mutex::new(BufWriter::new(file))),
            current_size: Arc::new(Mutex::new(size)),
            retention_days: retention,
        })
    }

    pub fn log(&self, mut entry: AuditEntry) -> io::Result<()> {
        let mut writer = self.current_file.lock().unwrap();
        let mut size = self.current_size.lock().unwrap();

        if *size >= MAX_LOG_SIZE_BYTES {
            // Need to implement rotation logic here, but for now we just flush
            writer.flush()?;
        }

        // Simulate cryptographic checksumming of the log entry for immutability
        entry.checksum = format!("{:x}", md5::compute(entry.serialize())); // Mock MD5

        let data = entry.serialize();
        writer.write_all(&data)?;
        writer.write_all(b"\n")?;
        
        *size += data.len() as u64 + 1;

        Ok(())
    }

    pub fn rotate_log(&self) -> io::Result<()> {
        let mut writer = self.current_file.lock().unwrap();
        writer.flush()?;
        
        let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
        let new_name = self.base_path.join(format!("audit_{}.archive", timestamp));
        let current_path = self.base_path.join("current.audit");

        std::fs::rename(&current_path, &new_name)?;
        
        let new_file = OpenOptions::new()
            .create(true)
            .write(true)
            .open(&current_path)?;
            
        *writer = BufWriter::new(new_file);
        let mut size = self.current_size.lock().unwrap();
        *size = 0;

        Ok(())
    }

    pub fn verify_chain(&self, file_path: &Path) -> bool {
        // This would read the file and verify the hash chain of entries
        true
    }
}

// Mock MD5 module since we don't want external deps for this snippet
mod md5 {
    pub fn compute(data: Vec<u8>) -> u64 {
        let mut hash = 0u64;
        for byte in data {
            hash = hash.wrapping_add(byte as u64);
        }
        hash
    }
}
