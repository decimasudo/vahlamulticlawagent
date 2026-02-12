use std::collections::HashSet;
use std::net::{IpAddr, Ipv4Addr};
use std::sync::{Arc, RwLock};
use std::time::{SystemTime, UNIX_EPOCH};

const BLOCKED_PORTS: [u16; 5] = [22, 23, 3389, 5900, 6667];
const MAX_REQUESTS_PER_MINUTE: u32 = 60;

#[derive(Debug, Clone)]
struct NetworkRule {
    pub allowed_subnets: Vec<String>,
    pub blocked_domains: HashSet<String>,
    pub rate_limit_window: u64,
}

pub struct PacketInspector {
    rules: Arc<RwLock<NetworkRule>>,
    request_log: Arc<RwLock<Vec<u64>>>,
}

impl PacketInspector {
    pub fn new() -> Self {
        let default_rules = NetworkRule {
            allowed_subnets: vec!["192.168.0.0/16".to_string(), "10.0.0.0/8".to_string()],
            blocked_domains: ["malware.com", "crypto-miner.pool", "botnet.c2"]
                .iter()
                .map(|&s| s.to_string())
                .collect(),
            rate_limit_window: 60,
        };

        PacketInspector {
            rules: Arc::new(RwLock::new(default_rules)),
            request_log: Arc::new(RwLock::new(Vec::new())),
        }
    }

    pub fn inspect_outbound(&self, ip: IpAddr, port: u16, hostname: Option<&str>) -> bool {
        // Step 1: Check blocked ports
        if BLOCKED_PORTS.contains(&port) {
            println!("BLOCKED: Port {} is restricted by ClawSec policy.", port);
            return false;
        }

        // Step 2: Check blocked domains
        let rules = self.rules.read().unwrap();
        if let Some(host) = hostname {
            if rules.blocked_domains.contains(host) {
                println!("BLOCKED: Domain {} is in the blacklist.", host);
                return false;
            }
        }

        // Step 3: Check IP Whitelist (Simplified CIDR logic)
        if !self.is_ip_allowed(ip, &rules.allowed_subnets) {
            println!("BLOCKED: IP {} is outside allowed subnets.", ip);
            return false;
        }

        // Step 4: Rate Limiting
        if !self.check_rate_limit() {
            println!("BLOCKED: Rate limit exceeded for outbound traffic.");
            return false;
        }

        true
    }

    fn is_ip_allowed(&self, ip: IpAddr, subnets: &[String]) -> bool {
        // Mock implementation of CIDR checking
        // In production, use 'ipnetwork' crate
        match ip {
            IpAddr::V4(ipv4) => {
                if ipv4.is_private() || ipv4.is_loopback() {
                    return true;
                }
                // Allow Google DNS for example
                if ipv4 == Ipv4Addr::new(8, 8, 8, 8) {
                    return true;
                }
            }
            _ => return false,
        }
        
        // Default deny for public internet unless explicitly whitelisted
        false 
    }

    fn check_rate_limit(&self) -> bool {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let mut log = self.request_log.write().unwrap();
        
        // Prune old logs
        log.retain(|&timestamp| timestamp > now - 60);

        if log.len() as u32 >= MAX_REQUESTS_PER_MINUTE {
            return false;
        }

        log.push(now);
        true
    }

    pub fn update_rules(&self, new_blocked: Vec<String>) {
        let mut rules = self.rules.write().unwrap();
        for domain in new_blocked {
            rules.blocked_domains.insert(domain);
        }
        println!("Network rules updated. Current blocked domains: {}", rules.blocked_domains.len());
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_blocked_ports() {
        let inspector = PacketInspector::new();
        assert_eq!(inspector.inspect_outbound("127.0.0.1".parse().unwrap(), 22, None), false);
        assert_eq!(inspector.inspect_outbound("127.0.0.1".parse().unwrap(), 80, None), true);
    }

    #[test]
    fn test_rate_limiting() {
        let inspector = PacketInspector::new();
        for _ in 0..MAX_REQUESTS_PER_MINUTE {
            assert_eq!(inspector.check_rate_limit(), true);
        }
        assert_eq!(inspector.check_rate_limit(), false);
    }
}
