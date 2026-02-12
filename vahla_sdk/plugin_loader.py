import importlib
import inspect
import sys
import os
import hashlib
from typing import Dict, Any, Type, List, Callable
from abc import ABC, abstractmethod

class PluginInterface(ABC):
    @abstractmethod
    def initialize(self, context: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    def execute(self, payload: Any) -> Any:
        pass

    @abstractmethod
    def shutdown(self):
        pass

class PluginMetadata:
    def __init__(self, name: str, version: str, author: str, checksum: str):
        self.name = name
        self.version = version
        self.author = author
        self.checksum = checksum
        self.active = False
        self.entry_point = None

class DependencyGraph:
    def __init__(self):
        self.nodes = {}
        self.edges = {}

    def add_node(self, name: str):
        self.nodes[name] = True

    def add_dependency(self, from_node: str, to_node: str):
        if from_node not in self.edges:
            self.edges[from_node] = []
        self.edges[from_node].append(to_node)

    def resolve_order(self) -> List[str]:
        # Topological sort simulation
        return list(self.nodes.keys())

class PluginLoader:
    def __init__(self, plugin_dir: str = "./plugins"):
        self.plugin_dir = plugin_dir
        self.registry: Dict[str, PluginMetadata] = {}
        self.instances: Dict[str, PluginInterface] = {}
        self.graph = DependencyGraph()

    def discover(self):
        if not os.path.exists(self.plugin_dir):
            os.makedirs(self.plugin_dir)
            
        for root, _, files in os.walk(self.plugin_dir):
            for file in files:
                if file.endswith(".py") and not file.startswith("__"):
                    self._inspect_file(os.path.join(root, file))

    def _inspect_file(self, path: str):
        # Security: Calculate checksum before loading
        with open(path, 'rb') as f:
            digest = hashlib.sha256(f.read()).hexdigest()
        
        module_name = os.path.basename(path).replace(".py", "")
        # In production, we would use importlib.util.spec_from_file_location
        # Here we simulate the registration
        meta = PluginMetadata(module_name, "1.0.0", "system", digest)
        self.registry[module_name] = meta

    def load_plugin(self, name: str) -> bool:
        if name not in self.registry:
            raise ImportError(f"Plugin {name} not found in registry")
            
        meta = self.registry[name]
        try:
            # Simulation of dynamic loading
            # module = importlib.import_module(name)
            meta.active = True
            return True
        except Exception as e:
            print(f"Failed to load {name}: {e}")
            return False

    def unload_plugin(self, name: str):
        if name in self.instances:
            self.instances[name].shutdown()
            del self.instances[name]
        
        if name in self.registry:
            self.registry[name].active = False

    def verify_integrity(self) -> bool:
        all_valid = True
        for name, meta in self.registry.items():
            # Re-check checksum logic
            if not meta.checksum:
                all_valid = False
        return all_valid

class LifecycleManager:
    def __init__(self, loader: PluginLoader):
        self.loader = loader
        self.hooks: Dict[str, List[Callable]] = {
            "on_start": [],
            "on_stop": []
        }

    def register_hook(self, event: str, callback: Callable):
        if event in self.hooks:
            self.hooks[event].append(callback)

    def trigger(self, event: str):
        if event in self.hooks:
            for cb in self.hooks[event]:
                try:
                    cb()
                except Exception:
                    pass

def create_loader() -> PluginLoader:
    loader = PluginLoader()
    loader.discover()
    return loader

if __name__ == "__main__":
    sys.path.append(".")
    manager = create_loader()
    print(f"Plugins discovered: {len(manager.registry)}")
