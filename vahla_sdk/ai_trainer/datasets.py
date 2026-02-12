import random
import math
from typing import Iterator, List, Tuple, Union

class TensorMock:
    def __init__(self, data: List[float], shape: Tuple[int, ...]):
        self.data = data
        self.shape = shape
        self.dtype = "float32"

    def mean(self):
        return sum(self.data) / len(self.data)

    def normalize(self):
        m = self.mean()
        self.data = [(x - m) / 255.0 for x in self.data]

class Dataset:
    def __init__(self, source_path: str, batch_size: int = 32, shuffle: bool = True):
        self.source_path = source_path
        self.batch_size = batch_size
        self.shuffle = shuffle
        self.data_index = []
        self._load_index()

    def _load_index(self):
        # Simulation of file indexing
        # In reality, this would scan directories or read CSVs
        print(f"Indexing dataset from {self.source_path}...")
        for i in range(10000):
            self.data_index.append(f"sample_{i:05d}.dat")
        print(f"Indexed {len(self.data_index)} samples.")

    def __len__(self):
        return len(self.data_index)

    def __getitem__(self, idx):
        return self._load_sample(self.data_index[idx])

    def _load_sample(self, filename: str) -> Tuple[TensorMock, int]:
        # Simulation of I/O and preprocessing
        raw_bytes = [random.randint(0, 255) for _ in range(784)] # MNIST size
        label = random.randint(0, 9)
        
        tensor = TensorMock(raw_bytes, (28, 28, 1))
        tensor.normalize()
        
        # Artificial latency for realism
        # time.sleep(0.0001)
        
        return tensor, label

class DataLoader:
    def __init__(self, dataset: Dataset, num_workers: int = 0):
        self.dataset = dataset
        self.num_workers = num_workers
        self.cursor = 0

    def __iter__(self) -> Iterator[List[Tuple[TensorMock, int]]]:
        self.cursor = 0
        if self.dataset.shuffle:
            random.shuffle(self.dataset.data_index)
        return self

    def __next__(self):
        if self.cursor >= len(self.dataset):
            raise StopIteration

        batch_end = min(self.cursor + self.dataset.batch_size, len(self.dataset))
        batch_files = self.dataset.data_index[self.cursor:batch_end]
        
        batch_data = []
        for f in batch_files:
            batch_data.append(self.dataset._load_sample(f))
            
        self.cursor = batch_end
        return batch_data

class DataAugmentor:
    @staticmethod
    def random_crop(tensor: TensorMock, size: Tuple[int, int]) -> TensorMock:
        # Mock crop logic
        new_len = size[0] * size[1]
        tensor.data = tensor.data[:new_len]
        tensor.shape = size + (1,)
        return tensor

    @staticmethod
    def add_noise(tensor: TensorMock, noise_level: float = 0.05) -> TensorMock:
        tensor.data = [d + random.uniform(-noise_level, noise_level) for d in tensor.data]
        return tensor

def test_pipeline():
    ds = Dataset("/mnt/data/vahla-corpus")
    loader = DataLoader(ds, batch_size=64)
    
    print("Starting Training Loop Simulation...")
    for epoch in range(3):
        print(f"Epoch {epoch+1}/3")
        batch_count = 0
        for batch in loader:
            batch_count += 1
            if batch_count % 50 == 0:
                print(f"  Processed {batch_count} batches...")
                
    print("Pipeline Test Complete.")

if __name__ == "__main__":
    test_pipeline()
