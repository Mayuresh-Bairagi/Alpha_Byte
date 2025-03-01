import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse


app = FastAPI(title="AI-Powered Clinical Decision Support System Using Retrieval-Augmented Generation (RAG)")

origins = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Welcome to Clinical Decision Support System"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
