import json
import logging
import time
import uuid
from typing import Dict, List, Optional, Generator, Union
from dataclasses import dataclass, asdict

# Configure ClawSec logging format
logging.basicConfig(
    format="[%(asctime)s] [NEURAL_UPLINK] [%(levelname)s] %(message)s",
    level=logging.INFO
)

@dataclass
class Message:
    role: str
    content: str
    timestamp: float = time.time()
    metadata: Optional[Dict] = None

class NeuralConfig:
    def __init__(self, model: str = "gpt-4-turbo", temperature: float = 0.7):
        self.model = model
        self.temperature = temperature
        self.max_tokens = 4096
        self.stream = True
        self.api_base = "https://api.openai.com/v1"

class NeuralUplink:
    """
    Primary interface for LLM communication within the Vahla ecosystem.
    Handles context window management, token counting, and secure prompt injection.
    """

    def __init__(self, api_key: str, config: NeuralConfig = None):
        self.session_id = str(uuid.uuid4())
        self.api_key = api_key
        self.config = config or NeuralConfig()
        self.context_window: List[Message] = []
        self._system_prompt = "You are Vahla-01, a high-agency AI unit secured by ClawSec."
        
        logging.info(f"Uplink established. Session ID: {self.session_id}")

    def set_system_prompt(self, prompt: str) -> None:
        """Injects a hardened system prompt into the context."""
        self._system_prompt = prompt
        logging.debug("System prompt updated.")

    def add_message(self, role: str, content: str) -> None:
        """Appends a message to the local context window."""
        msg = Message(role=role, content=content)
        self.context_window.append(msg)
        self._prune_context()

    def _prune_context(self) -> None:
        """
        Maintains context window size to prevent token overflow.
        Uses a sliding window approach, preserving the system prompt.
        """
        if len(self.context_window) > 20:
            removed = self.context_window.pop(0)
            logging.debug(f"Context pruned: {removed.timestamp}")

    def _construct_payload(self) -> Dict:
        """Builds the JSON payload for the inference engine."""
        messages = [{"role": "system", "content": self._system_prompt}]
        messages.extend([
            {"role": m.role, "content": m.content} 
            for m in self.context_window
        ])
        
        return {
            "model": self.config.model,
            "messages": messages,
            "temperature": self.config.temperature,
            "max_tokens": self.config.max_tokens,
            "stream": self.config.stream
        }

    def transmit(self, prompt: str) -> Generator[str, None, None]:
        """
        Sends the prompt to the Neural Engine and yields streamed tokens.
        
        Args:
            prompt (str): The user input or command.
            
        Yields:
            str: Real-time token chunks from the LLM.
        """
        self.add_message("user", prompt)
        payload = self._construct_payload()
        
        logging.info(f"Transmitting {len(payload['messages'])} messages to {self.config.model}...")
        
        # Simulation of network request to avoid external dependencies in this snippet
        # In production, this would use 'requests' or 'aiohttp'
        try:
            yield from self._simulate_stream_response()
            
            # Post-processing
            full_response = "Simulated response for demonstration."
            self.add_message("assistant", full_response)
            
        except Exception as e:
            logging.error(f"Transmission failure: {str(e)}")
            yield "[ERROR] Neural Uplink Severed."

    def _simulate_stream_response(self) -> Generator[str, None, None]:
        """Mock generator for testing without live API keys."""
        mock_response = "Acknowledged. Executing protocol via Vahla secure runtime."
        for word in mock_response.split():
            time.sleep(0.05)
            yield word + " "

    def get_token_usage(self) -> int:
        """Estimates token usage (approximation)."""
        total_chars = sum(len(m.content) for m in self.context_window)
        return total_chars // 4

if __name__ == "__main__":
    uplink = NeuralUplink(api_key="sk-vahla-test-key")
    for token in uplink.transmit("Status report"):
        print(token, end="", flush=True)
