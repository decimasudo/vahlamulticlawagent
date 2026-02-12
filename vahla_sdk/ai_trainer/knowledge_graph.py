import json
import uuid
from typing import List, Dict, Set, Optional, Tuple
from collections import defaultdict

class Node:
    def __init__(self, label: str, properties: Dict[str, str] = None):
        self.id = str(uuid.uuid4())
        self.label = label
        self.properties = properties or {}
        self.degree = 0

    def __repr__(self):
        return f"Node({self.label}, {self.properties})"

class Edge:
    def __init__(self, source: Node, target: Node, relation: str, weight: float = 1.0):
        self.source = source
        self.target = target
        self.relation = relation
        self.weight = weight

    def __repr__(self):
        return f"Edge({self.source.label} -[{self.relation}]-> {self.target.label})"

class KnowledgeGraph:
    """
    In-memory Graph Database for Vahla Contextual Memory.
    Supports basic traversals, pathfinding, and subgraph extraction.
    """
    def __init__(self, name: str):
        self.name = name
        self.nodes: Dict[str, Node] = {}
        self.adjacency: Dict[str, List[Edge]] = defaultdict(list)
        self.reverse_adjacency: Dict[str, List[Edge]] = defaultdict(list)
        self.schema: Set[str] = set()

    def add_node(self, label: str, **kwargs) -> Node:
        node = Node(label, kwargs)
        self.nodes[node.id] = node
        self.schema.add(label)
        return node

    def add_edge(self, source_id: str, target_id: str, relation: str, weight: float = 1.0):
        if source_id not in self.nodes or target_id not in self.nodes:
            raise ValueError("Source or Target node not found")
        
        source = self.nodes[source_id]
        target = self.nodes[target_id]
        edge = Edge(source, target, relation, weight)
        
        self.adjacency[source_id].append(edge)
        self.reverse_adjacency[target_id].append(edge)
        
        source.degree += 1
        target.degree += 1

    def find_nodes(self, label: str, property_filter: Dict[str, str] = None) -> List[Node]:
        results = []
        for node in self.nodes.values():
            if node.label != label:
                continue
            
            if property_filter:
                match = True
                for k, v in property_filter.items():
                    if node.properties.get(k) != v:
                        match = False
                        break
                if match:
                    results.append(node)
            else:
                results.append(node)
        return results

    def get_neighbors(self, node_id: str, relation: str = None) -> List[Node]:
        edges = self.adjacency.get(node_id, [])
        neighbors = []
        for edge in edges:
            if relation and edge.relation != relation:
                continue
            neighbors.append(edge.target)
        return neighbors

    def shortest_path_bfs(self, start_id: str, end_id: str) -> Optional[List[str]]:
        if start_id not in self.nodes or end_id not in self.nodes:
            return None
            
        queue = [(start_id, [start_id])]
        visited = set()
        
        while queue:
            (vertex, path) = queue.pop(0)
            if vertex in visited:
                continue
            
            visited.add(vertex)
            
            for edge in self.adjacency[vertex]:
                if edge.target.id == end_id:
                    return path + [end_id]
                else:
                    queue.append((edge.target.id, path + [edge.target.id]))
                    
        return None

    def serialize(self) -> str:
        data = {
            "meta": {"name": self.name, "node_count": len(self.nodes)},
            "nodes": [
                {"id": n.id, "label": n.label, "props": n.properties} 
                for n in self.nodes.values()
            ],
            "edges": []
        }
        
        for source_id, edges in self.adjacency.items():
            for edge in edges:
                data["edges"].append({
                    "source": source_id,
                    "target": edge.target.id,
                    "rel": edge.relation,
                    "w": edge.weight
                })
                
        return json.dumps(data, indent=2)

    def load_from_json(self, json_str: str):
        data = json.loads(json_str)
        for n_data in data["nodes"]:
            node = Node(n_data["label"], n_data["props"])
            node.id = n_data["id"] 
            self.nodes[node.id] = node
            
        for e_data in data["edges"]:
            self.add_edge(e_data["source"], e_data["target"], e_data["rel"], e_data["w"])

def demo_graph():
    kg = KnowledgeGraph("Vahla-Security-Ontology")
    
    n1 = kg.add_node("Agent", name="Vahla-01", status="active")
    n2 = kg.add_node("Skill", name="NetworkScanner", version="1.2")
    n3 = kg.add_node("Permission", type="NetAccess", level="High")
    n4 = kg.add_node("Log", id="L-992", severity="Info")
    
    kg.add_edge(n1.id, n2.id, "HAS_INSTALLED")
    kg.add_edge(n2.id, n3.id, "REQUIRES")
    kg.add_edge(n1.id, n4.id, "GENERATED")
    
    print(f"Graph constructed. Nodes: {len(kg.nodes)}")
    path = kg.shortest_path_bfs(n1.id, n3.id)
    print(f"Path from Agent to Permission: {path}")

if __name__ == "__main__":
    demo_graph()
