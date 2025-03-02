import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class FaissIndex:
    def __init__(self, embedding_dim=384):
        self.index = faiss.IndexFlatL2(embedding_dim)
        self.embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        self.metadata = {}
    
    def get_embedding(self, text):
        """Generate embeddings using Hugging Face model."""
        return self.embedding_model.encode(text, convert_to_numpy=True).astype("float32")

    def add_documents(self, documents):
        """Add documents to the FAISS index."""
        all_text_chunks = []
        all_metadata = []
        
        for doc in documents:
            text_chunks = doc['chunks']
            for i, chunk in enumerate(text_chunks):
                all_text_chunks.append(chunk)
                all_metadata.append({"title": doc['title'], "url": doc['url'], "chunk_index": i})
        
        embeddings = self.embedding_model.encode(all_text_chunks, convert_to_numpy=True).astype("float32")
        self.index.add(embeddings)
        for idx, metadata in enumerate(all_metadata):
            self.metadata[idx] = metadata
    
    def search(self, query, top_k=6):
        """Retrieve top-k relevant documents from FAISS."""
        query_embedding = self.get_embedding(query).reshape(1, -1)
        _, indices = self.index.search(query_embedding, top_k)
        return [self.metadata[idx] for idx in indices[0] if idx in self.metadata]
