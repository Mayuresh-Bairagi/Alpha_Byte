import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from modules.database import database
from modules.model import patient, patientRecord



app = FastAPI(title="AI-Powered Clinical Decision Support System Using Retrieval-Augmented Generation (RAG)")
db = database()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173",
]

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


@app.post("/patient")
def create_patient(patient: patient):
    message = db.add_patient(patient.dict())
    return message


@app.get("/patient/{patient_id}")
def get_patient(id: int):
    patient = db.get_patient(id)
    return {"patient": patient}

@app.get("/patient_all")
def get_patients():
    patients = db.get_patients()
    return {"patients": patients}


@app.delete("/patient/{patient_id}")
def delete_patient(id: int):
    message = db.delete_patient(id)
    return message

@app.put("/patient/{patient_id}")
def update_patient(id: int, patient: patient):
    message = db.update_patient(id, patient.dict())
    return message

@app.get("/search_patient/{name}")
def search_patient(name: str):
    patients = db.search_patient(name)
    return {"patients": patients}

@app.post("/patientRecord")
def create_patientRecord(patientRecord: patientRecord):
    message = db.add_patient_record(patientRecord.dict())
    return message

@app.get("/patientRecord/{patient_id}")
def get_patientRecord(id: int):
    patientRecord = db.get_patient_records(id)
    return {"patientRecord": patientRecord}



@app.delete("/patientRecord/{patientRecord_id}")
def delete_patientRecord(id: int):
    message = db.delete_patient_record(id)
    return message

@app.put("/patientRecord/{patientRecord_id}")
def update_patientRecord(id: int, patientRecord: patientRecord):
    message = db.modify_patient_record(id, patientRecord.dict())
    return message



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
