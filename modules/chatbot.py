import json
import requests
from modules.database import database
from modules.fetch_data import PMCResearchFetcher
from modules.faiss_index import FaissIndex
from dotenv import load_dotenv
import os
load_dotenv()

class MedicalChatbot:
    def __init__(self):
        self.db = database()
        self.research_fetcher = PMCResearchFetcher()
        self.faiss_index = FaissIndex()
        self.GROQ_API_KEY = os.getenv("GROQ_API_KEY")
        self.GROQ_MODEL = os.getenv("GROQ_MODEL")
        
        # Cache for storing patient-related research papers
        self.cached_patient_data = {}

    def fetch_patient_disease(self, patient_id):
        """Fetch disease for a given patient ID from patient records."""
        patient_records = self.db.get_patient_records(patient_id)
        if patient_records and len(patient_records) > 0:
            return patient_records.get('disease')  # Fetch first record's disease
        return None

    def process_research_papers(self, patient_id, disease):
        """Fetch and store research papers in FAISS for a given disease (only once per patient)."""
        if patient_id in self.cached_patient_data:
            return  # If already cached, skip processing
        
        articles = self.research_fetcher.fetch_articles(disease)
        documents = []
        
        for title, details in articles.items():
            text_chunks = details.get("extracted_text", "").split("\n")
            documents.append({"title": title, "url": details["url"], "chunks": text_chunks})
        
        self.faiss_index.add_documents(documents)

        # Cache the processed data
        self.cached_patient_data[patient_id] = {
            "disease": disease,
            "faiss_index": self.faiss_index
        }

    def retrieve_relevant_docs(self, patient_id, query, top_k=6):
        """Retrieve top-k relevant documents from FAISS (using cached index)."""
        if patient_id not in self.cached_patient_data:
            return []
        return self.cached_patient_data[patient_id]["faiss_index"].search(query, top_k)

    def query_llama(self, prompt):
        """Send a request to Groq API with the given prompt."""
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {"Authorization": f"Bearer {self.GROQ_API_KEY}", "Content-Type": "application/json"}
        data = {"model": self.GROQ_MODEL,"temperature":0.3, "messages": [{"role": "system", "content": "You are an AI medical assistant."}, {"role": "user", "content": prompt}]}
        response = requests.post(url, headers=headers, json=data)
        return response.json()["choices"][0]["message"]["content"] if response.status_code == 200 else f"Error: {response.text}"
    
    def generate_response(self, patient_id, question):
        """Generate AI-assisted response using cached data or new processing."""
        disease = self.fetch_patient_disease(patient_id)
        if not disease:
            return "Patient record not found."
        
        # Process research papers only if not already cached
        if patient_id not in self.cached_patient_data:
            self.process_research_papers(patient_id, disease)

        # Retrieve relevant documents
        retrieved_docs = self.retrieve_relevant_docs(patient_id, question)
        context = "\n".join([f"Title: {doc['title']}, Chunk: {doc['chunk_index']}" for doc in retrieved_docs])
        prompt = f"""You are an AI medical assistant with expertise in analyzing medical research and providing clear, concise, and accurate explanations. 

        Based on the following medical research related to {disease}, provide a well-explained answer to the user's question in simple and understandable terms also if there is need you can all provide answer in form of bullet points.

        ### Context (Relevant Research Findings):
        {context}

        Now, based on this information, answer the user's question in a professional yet patient-friendly manner.

        ### User's Question:
        {question}
        """
        
        return self.query_llama(prompt)
