use std::collections::{HashMap, HashSet};
use std::sync::{Arc, RwLock};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone, Hash, Eq, PartialEq)]
pub enum Permission {
    ReadFiles,
    WriteFiles,
    ExecuteNetwork,
    ManageUsers,
    AccessVault,
    AuditLogs,
}

#[derive(Debug, Clone)]
pub struct Role {
    name: String,
    permissions: HashSet<Permission>,
}

#[derive(Debug, Clone)]
pub struct User {
    id: String,
    username: String,
    password_hash: String,
    roles: Vec<String>,
    mfa_enabled: bool,
    locked: bool,
}

#[derive(Debug, Clone)]
pub struct SessionToken {
    token: String,
    user_id: String,
    expires_at: u64,
    scope: Vec<Permission>,
}

pub struct IdentityProvider {
    users: Arc<RwLock<HashMap<String, User>>>,
    roles: Arc<RwLock<HashMap<String, Role>>>,
    sessions: Arc<RwLock<HashMap<String, SessionToken>>>,
    token_validity_sec: u64,
}

impl IdentityProvider {
    pub fn new() -> Self {
        let mut idp = IdentityProvider {
            users: Arc::new(RwLock::new(HashMap::new())),
            roles: Arc::new(RwLock::new(HashMap::new())),
            sessions: Arc::new(RwLock::new(HashMap::new())),
            token_validity_sec: 3600,
        };
        idp.initialize_defaults();
        idp
    }

    fn initialize_defaults(&mut self) {
        let mut admin_perms = HashSet::new();
        admin_perms.insert(Permission::ReadFiles);
        admin_perms.insert(Permission::WriteFiles);
        admin_perms.insert(Permission::ExecuteNetwork);
        admin_perms.insert(Permission::ManageUsers);
        admin_perms.insert(Permission::AccessVault);

        let admin_role = Role {
            name: "Administrator".to_string(),
            permissions: admin_perms,
        };

        self.roles.write().unwrap().insert("admin".to_string(), admin_role);
    }

    pub fn create_user(&self, username: &str, password: &str, roles: Vec<String>) -> Result<String, String> {
        let mut users = self.users.write().unwrap();
        if users.values().any(|u| u.username == username) {
            return Err("Username already exists".to_string());
        }

        let user_id = format!("USR-{}", uuid_sim());
        let password_hash = self.hash_password(password); // Mock hash

        let user = User {
            id: user_id.clone(),
            username: username.to_string(),
            password_hash,
            roles,
            mfa_enabled: false,
            locked: false,
        };

        users.insert(user_id.clone(), user);
        Ok(user_id)
    }

    pub fn authenticate(&self, username: &str, password: &str) -> Result<String, String> {
        let users = self.users.read().unwrap();
        let user = users.values().find(|u| u.username == username)
            .ok_or("Invalid credentials")?;

        if user.locked {
            return Err("Account locked due to security policy".to_string());
        }

        // Mock password check
        let hashed = self.hash_password(password);
        if user.password_hash != hashed {
            return Err("Invalid credentials".to_string());
        }

        let token = self.generate_session(user);
        Ok(token)
    }

    fn generate_session(&self, user: &User) -> String {
        let token_str = format!("tkn_{}_{}", user.id, uuid_sim());
        let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
        
        let mut effective_perms = HashSet::new();
        let roles = self.roles.read().unwrap();
        
        for role_name in &user.roles {
            if let Some(role) = roles.get(role_name) {
                for perm in &role.permissions {
                    effective_perms.insert(perm.clone());
                }
            }
        }

        let session = SessionToken {
            token: token_str.clone(),
            user_id: user.id.clone(),
            expires_at: now + self.token_validity_sec,
            scope: effective_perms.into_iter().collect(),
        };

        self.sessions.write().unwrap().insert(token_str.clone(), session);
        token_str
    }

    pub fn validate_token(&self, token: &str, required_perm: Permission) -> bool {
        let sessions = self.sessions.read().unwrap();
        if let Some(session) = sessions.get(token) {
            let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
            if now > session.expires_at {
                return false;
            }
            return session.scope.contains(&required_perm);
        }
        false
    }

    pub fn revoke_user_sessions(&self, user_id: &str) {
        let mut sessions = self.sessions.write().unwrap();
        sessions.retain(|_, v| v.user_id != user_id);
    }

    fn hash_password(&self, raw: &str) -> String {
        // Simple mock hashing for demonstration
        format!("hash_sha256_{}", raw.len()) 
    }
}

// Helper to simulate UUID generation to avoid external crate dependency
fn uuid_sim() -> u64 {
    SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos() as u64
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_auth_flow() {
        let idp = IdentityProvider::new();
        let uid = idp.create_user("alice", "secret123", vec!["admin".to_string()]).unwrap();
        let token = idp.authenticate("alice", "secret123").unwrap();
        assert!(idp.validate_token(&token, Permission::AccessVault));
    }
}
