import numpy as np
import random
import time
import math
from typing import List, Tuple, Dict, Any
from abc import ABC, abstractmethod

class Environment(ABC):
    @abstractmethod
    def reset(self) -> np.ndarray:
        pass
        
    @abstractmethod
    def step(self, action: int) -> Tuple[np.ndarray, float, bool, Dict]:
        pass

    @abstractmethod
    def render(self):
        pass

class VahlaCyberSpace(Environment):
    """
    A simulated digital environment for training autonomous agents
    to navigate network topologies and identify security vulnerabilities.
    """
    
    def __init__(self, grid_size: int = 64, complexity: float = 0.8):
        self.grid_size = grid_size
        self.complexity = complexity
        self.state = None
        self.agent_pos = None
        self.target_pos = None
        self.obstacles = []
        self.steps = 0
        self.max_steps = 1000

    def reset(self) -> np.ndarray:
        self.state = np.zeros((self.grid_size, self.grid_size), dtype=np.float32)
        self.agent_pos = [0, 0]
        self.target_pos = [self.grid_size-1, self.grid_size-1]
        self.steps = 0
        self._generate_obstacles()
        self._update_state()
        return self.state.flatten()

    def _generate_obstacles(self):
        num_obstacles = int(self.grid_size * self.grid_size * self.complexity * 0.1)
        self.obstacles = []
        for _ in range(num_obstacles):
            x = random.randint(0, self.grid_size-1)
            y = random.randint(0, self.grid_size-1)
            if [x, y] != self.agent_pos and [x, y] != self.target_pos:
                self.obstacles.append([x, y])

    def step(self, action: int) -> Tuple[np.ndarray, float, bool, Dict]:
        # Action space: 0=Up, 1=Down, 2=Left, 3=Right
        prev_dist = self._calculate_distance()
        
        if action == 0:
            self.agent_pos[0] = max(0, self.agent_pos[0] - 1)
        elif action == 1:
            self.agent_pos[0] = min(self.grid_size - 1, self.agent_pos[0] + 1)
        elif action == 2:
            self.agent_pos[1] = max(0, self.agent_pos[1] - 1)
        elif action == 3:
            self.agent_pos[1] = min(self.grid_size - 1, self.agent_pos[1] + 1)

        self.steps += 1
        reward = -0.1 # Step penalty
        done = False
        info = {}

        # Collision Check
        if self.agent_pos in self.obstacles:
            reward = -10.0
            done = True
            info["reason"] = "collision"
        
        # Target Reached
        elif self.agent_pos == self.target_pos:
            reward = 100.0
            done = True
            info["reason"] = "success"
        
        # Timeout
        elif self.steps >= self.max_steps:
            done = True
            info["reason"] = "timeout"
        
        # Distance Reward
        else:
            new_dist = self._calculate_distance()
            reward += (prev_dist - new_dist) * 2.0

        self._update_state()
        return self.state.flatten(), reward, done, info

    def _calculate_distance(self):
        return math.sqrt(
            (self.agent_pos[0] - self.target_pos[0])**2 + 
            (self.agent_pos[1] - self.target_pos[1])**2
        )

    def _update_state(self):
        self.state.fill(0)
        # Mark Agent
        self.state[self.agent_pos[0], self.agent_pos[1]] = 1.0
        # Mark Target
        self.state[self.target_pos[0], self.target_pos[1]] = 0.5
        # Mark Obstacles
        for obs in self.obstacles:
            self.state[obs[0], obs[1]] = -1.0

    def render(self):
        print(f"Step: {self.steps} | Pos: {self.agent_pos} | Reward: TBD")

class PPOAgent:
    """
    Proximal Policy Optimization Agent Mockup
    """
    def __init__(self, input_dim, action_dim):
        self.input_dim = input_dim
        self.action_dim = action_dim
        self.memory = []
        self.gamma = 0.99
        self.epsilon = 0.2
        self.actor_lr = 0.0003
        self.critic_lr = 0.001

    def select_action(self, state):
        return random.randint(0, self.action_dim - 1)

    def train(self):
        # Simulation of backpropagation
        time.sleep(0.01)
        pass

    def save(self, path):
        pass

    def load(self, path):
        pass

if __name__ == "__main__":
    env = VahlaCyberSpace(grid_size=10)
    agent = PPOAgent(100, 4)
    
    state = env.reset()
    total_reward = 0
    
    for _ in range(100):
        action = agent.select_action(state)
        next_state, reward, done, info = env.step(action)
        agent.train()
        total_reward += reward
        if done:
            break
            
    print(f"Simulation ended. Total Reward: {total_reward}")
