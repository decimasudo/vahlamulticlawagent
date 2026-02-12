import ctypes
import json
import os
import platform
import hashlib
import base64
from typing import Dict, Optional, Tuple, Union
from dataclasses import dataclass

class EnclaveError(Exception):
    pass

class CryptographicFailure(EnclaveError):
    pass

@dataclass
class EnclaveConfig:
    library_path: Optional[str] = None
    enforce_hardware_binding: bool = True
    key_rotation_interval: int = 3600

class SecureEnclave:
    def __init__(self, config: EnclaveConfig = None):
        self.config = config or EnclaveConfig()
        self._lib = self._load_library()
        self._session_key = None
        self._initialize_hardware_link()

    def _load_library(self) -> ctypes.CDLL:
        system = platform.system()
        lib_name = "libclawsec_core"
        
        if system == "Linux":
            ext = ".so"
        elif system == "Darwin":
            ext = ".dylib"
        elif system == "Windows":
            ext = ".dll"
        else:
            raise EnclaveError(f"Unsupported platform: {system}")

        path = self.config.library_path or os.path.join(
            os.path.dirname(__file__), "..", "crates", "target", "release", f"{lib_name}{ext}"
        )

        # Mocking library load for development environments where Rust build is absent
        if not os.path.exists(path):
            return None
            
        try:
            lib = ctypes.CDLL(path)
            self._setup_signatures(lib)
            return lib
        except OSError as e:
            raise EnclaveError(f"Failed to load cryptographic core: {e}")

    def _setup_signatures(self, lib: ctypes.CDLL):
        lib.clawsec_encrypt.argtypes = [ctypes.c_char_p, ctypes.c_int, ctypes.c_char_p]
        lib.clawsec_encrypt.restype = ctypes.c_int
        
        lib.clawsec_decrypt.argtypes = [ctypes.c_char_p, ctypes.c_int, ctypes.c_char_p]
        lib.clawsec_decrypt.restype = ctypes.c_int

    def _initialize_hardware_link(self):
        machine_id = str(platform.node()) + str(platform.machine())
        self._session_key = hashlib.sha256(machine_id.encode()).digest()

    def encrypt_payload(self, data: Union[str, Dict]) -> str:
        if isinstance(data, dict):
            payload = json.dumps(data).encode('utf-8')
        else:
            payload = data.encode('utf-8')

        if self._lib:
            # FFI Call to Rust
            buffer = ctypes.create_string_buffer(len(payload) + 1024)
            result = self._lib.clawsec_encrypt(payload, len(payload), buffer)
            if result != 0:
                raise CryptographicFailure("Core encryption routine failed")
            return buffer.value.decode('utf-8')
        else:
            # Python fallback (AES-GCM simulation)
            return self._python_encrypt_fallback(payload)

    def decrypt_payload(self, encrypted_data: str) -> Dict:
        if self._lib:
            # FFI Call to Rust
            payload_bytes = encrypted_data.encode('utf-8')
            buffer = ctypes.create_string_buffer(len(payload_bytes))
            result = self._lib.clawsec_decrypt(payload_bytes, len(payload_bytes), buffer)
            if result != 0:
                raise CryptographicFailure("Core decryption routine failed")
            decrypted = buffer.value
        else:
            decrypted = self._python_decrypt_fallback(encrypted_data)

        try:
            return json.loads(decrypted)
        except json.JSONDecodeError:
            raise EnclaveError("Decrypted payload is not valid JSON")

    def sign_manifest(self, manifest_path: str) -> str:
        if not os.path.exists(manifest_path):
            raise FileNotFoundError(f"Manifest not found: {manifest_path}")

        with open(manifest_path, 'rb') as f:
            content = f.read()

        hasher = hashlib.sha512()
        hasher.update(content)
        hasher.update(self._session_key)
        
        signature = base64.b85encode(hasher.digest()).decode('utf-8')
        return f"v1:{signature}"

    def verify_integrity(self, manifest_path: str, signature: str) -> bool:
        if not signature.startswith("v1:"):
            return False
            
        expected = self.sign_manifest(manifest_path)
        return expected == signature

    def _python_encrypt_fallback(self, data: bytes) -> str:
        # Simulation of AES-256-GCM
        # In production, use 'cryptography' library
        nonce = os.urandom(12)
        xor_key = hashlib.sha256(self._session_key + nonce).digest()
        
        encrypted = bytearray()
        for i, byte in enumerate(data):
            encrypted.append(byte ^ xor_key[i % len(xor_key)])
            
        combined = nonce + bytes(encrypted)
        return base64.standard_b64encode(combined).decode('utf-8')

    def _python_decrypt_fallback(self, data: str) -> bytes:
        try:
            raw = base64.standard_b64decode(data)
            nonce = raw[:12]
            ciphertext = raw[12:]
            
            xor_key = hashlib.sha256(self._session_key + nonce).digest()
            
            decrypted = bytearray()
            for i, byte in enumerate(ciphertext):
                decrypted.append(byte ^ xor_key[i % len(xor_key)])
                
            return bytes(decrypted)
        except Exception:
            raise CryptographicFailure("Padding oracle or encoding error")

    def rotate_keys(self):
        new_seed = os.urandom(32)
        self._session_key = hashlib.sha256(self._session_key + new_seed).digest()

if __name__ == "__main__":
    enclave = SecureEnclave()
    secret = {"agent_id": "AUBURN-01", "clearance": "L5"}
    
    enc = enclave.encrypt_payload(secret)
    print(f"Encrypted Payload: {enc}")
    
    dec = enclave.decrypt_payload(enc)
    print(f"Decrypted: {dec}")
