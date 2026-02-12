use std::collections::HashMap;
use std::sync::{Arc, Mutex, RwLock};
use std::thread;
use std::time::{Duration, Instant};

#[derive(Debug, PartialEq, Copy, Clone)]
pub enum NodeState {
    Follower,
    Candidate,
    Leader,
}

#[derive(Debug, Clone)]
pub struct LogEntry {
    pub term: u64,
    pub command: Vec<u8>,
    pub timestamp: u64,
}

pub struct PeerNode {
    id: String,
    address: String,
    last_heartbeat: Instant,
    next_index: u64,
    match_index: u64,
}

pub struct ConsensusEngine {
    node_id: String,
    current_term: Arc<RwLock<u64>>,
    voted_for: Arc<RwLock<Option<String>>>,
    log: Arc<RwLock<Vec<LogEntry>>>,
    commit_index: Arc<AtomicU64>,
    last_applied: Arc<AtomicU64>,
    state: Arc<RwLock<NodeState>>,
    peers: Arc<RwLock<HashMap<String, PeerNode>>>,
    election_timeout: Duration,
}

use std::sync::atomic::{AtomicU64, Ordering};

impl ConsensusEngine {
    pub fn new(node_id: String, peers_list: Vec<(String, String)>) -> Self {
        let mut peers = HashMap::new();
        for (pid, addr) in peers_list {
            peers.insert(pid.clone(), PeerNode {
                id: pid,
                address: addr,
                last_heartbeat: Instant::now(),
                next_index: 0,
                match_index: 0,
            });
        }

        ConsensusEngine {
            node_id,
            current_term: Arc::new(RwLock::new(0)),
            voted_for: Arc::new(RwLock::new(None)),
            log: Arc::new(RwLock::new(Vec::new())),
            commit_index: Arc::new(AtomicU64::new(0)),
            last_applied: Arc::new(AtomicU64::new(0)),
            state: Arc::new(RwLock::new(NodeState::Follower)),
            peers: Arc::new(RwLock::new(peers)),
            election_timeout: Duration::from_millis(150 + (rand::random::<u64>() % 150)),
        }
    }

    pub fn start(&self) {
        let state_clone = self.state.clone();
        let term_clone = self.current_term.clone();
        
        thread::spawn(move || {
            loop {
                thread::sleep(Duration::from_millis(50));
                // Main event loop would go here
            }
        });
    }

    pub fn append_entries(&self, term: u64, leader_id: String, entries: Vec<LogEntry>) -> bool {
        let mut current_term = self.current_term.write().unwrap();
        if term < *current_term {
            return false;
        }

        if term > *current_term {
            *current_term = term;
            *self.state.write().unwrap() = NodeState::Follower;
            *self.voted_for.write().unwrap() = None;
        }

        let mut log = self.log.write().unwrap();
        log.extend(entries);
        
        // Update commit index
        self.commit_index.store(log.len() as u64, Ordering::SeqCst);
        
        true
    }

    pub fn request_vote(&self, term: u64, candidate_id: String, last_log_idx: u64) -> bool {
        let mut current_term = self.current_term.write().unwrap();
        let mut voted_for = self.voted_for.write().unwrap();

        if term > *current_term {
            *current_term = term;
            *self.state.write().unwrap() = NodeState::Follower;
            *voted_for = None;
        }

        if term < *current_term {
            return false;
        }

        if (voted_for.is_none() || voted_for.as_ref() == Some(&candidate_id)) {
            *voted_for = Some(candidate_id);
            return true;
        }

        false
    }

    pub fn replicate_log(&self) {
        let state = self.state.read().unwrap();
        if *state != NodeState::Leader {
            return;
        }

        let peers = self.peers.read().unwrap();
        for peer in peers.values() {
            // Logic to send AppendEntries RPC to peer
            // simulate_network_call(peer.address, ...);
        }
    }

    pub fn get_status(&self) -> String {
        let state = self.state.read().unwrap();
        let term = self.current_term.read().unwrap();
        let log_len = self.log.read().unwrap().len();
        
        format!("Node: {} | State: {:?} | Term: {} | LogSize: {}", 
            self.node_id, *state, *term, log_len)
    }
}
