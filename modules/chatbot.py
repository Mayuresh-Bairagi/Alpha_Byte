import json
import requests
from modules.database import database
from modules.fetch_data import PMCResearchFetcher
from modules.faiss_index import FaissIndex

class MedicalChatbot:
    def __init__(self):
        self.db = database()
        self.research_fetcher = PMCResearchFetcher()
        self.faiss_index = FaissIndex()
        self.GROQ_API_KEY = "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"
        self.GROQ_MODEL = "llama3-8b-8192"
    
    def fetch_patient_disease(self, patient_id):
        """Fetch disease for a given patient ID from patient records."""
        patient_records = self.db.get_patient_records(patient_id)
        if patient_records and len(patient_records) > 0:
            return patient_records.get('disease')
        return None

    def process_research_papers(self, disease):
        """Fetch research papers related to the disease and store them in FAISS."""
        articles = self.research_fetcher.fetch_articles(disease)
        documents = []
        
        for title, details in articles.items():
            text_chunks = details.get("extracted_text", "").split("\n")
            documents.append({"title": title, "url": details["url"], "chunks": text_chunks})
        
        self.faiss_index.add_documents(documents)
    
    def retrieve_relevant_docs(self, query, top_k=6):
        """Retrieve top-k relevant documents from FAISS."""
        return self.faiss_index.search(query, top_k)
    
    def query_llama(self, prompt):
        """Send a request to Groq API with the given prompt."""
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {"Authorization": f"Bearer {self.GROQ_API_KEY}", "Content-Type": "application/json"}
        data = {"model": self.GROQ_MODEL, "messages": [{"role": "system", "content": "You are an AI medical assistant."}, {"role": "user", "content": prompt}]}
        response = requests.post(url, headers=headers, json=data)
        return response.json()["choices"][0]["message"]["content"] if response.status_code == 200 else f"Error: {response.text}"
    
    def generate_response(self, id, question):
        """Fetch patient disease, retrieve research papers, and generate AI-assisted response."""
        disease = self.fetch_patient_disease(id)
        if not disease:
            return "Patient record not found."
        
        self.process_research_papers(disease)
        retrieved_docs = self.retrieve_relevant_docs(question)
        context = "\n".join([f"Title: {doc['title']}, Chunk: {doc['chunk_index']}" for doc in retrieved_docs])
        prompt = f"""Based on the following medical {disease} and context, answer the user's question.\nContext:\n{context}\n\nUser's Question: {question}"""
        print(disease)
        return self.query_llama(prompt)