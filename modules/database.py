import os
import json
from supabase import create_client, Client
from fastapi import HTTPException
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()


class database:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY")
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
    
    def add_patient(self, patient):
        try:
            self.supabase.table('patients').insert(patient).execute()
            return {"status": "success", "message": "Patient added successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error adding patient: {str(e)}")
    
    def get_patients(self):
        try :
            patients = self.supabase.table('patients').select().execute()
            patients = patients.json()
            patients_data = json.loads(patients)
            print(patients_data)
            return patients_data['data']
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving patients: {str(e)}")
    
    def get_patient(self, id):
        try :
            patient = self.supabase.table('patients').select().eq('id', id).execute()
            patient = patient.json()
            patient_data = json.loads(patient)
            return patient_data['data']
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving patient: {str(e)}")
    
    def delete_patient(self, id):
        try :
            self.supabase.table('patients').delete().eq('id', id).execute()
            return {"status": "success", "message": "Patient deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting patient: {str(e)}")
    
    def update_patient(self, id, patient):
        try :
            self.supabase.table('patients').update(patient).eq('id', id).execute()
            return {"status": "success", "message": "Patient updated successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating patient: {str(e)}")
    
    def search_patient(self, name):
        try :
            patients = self.supabase.table('patients').select().ilike('name', f'%{name}%').execute()
            patients = patients.json()
            patients_data = json.loads(patients)
            return patients_data['data']
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error searching patient: {str(e)}")
    
    def add_patient_record(self, patient_record):
        try :
            self.supabase.table('patient_records').insert(patient_record).execute()
            return {"status": "success", "message": "Patient record added successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error adding patient record: {str(e)}")
    
    
    def get_patient_records(self, id):
        try :
            patient_records = self.supabase.table('patient_records').select().eq('patient_id', id).execute()
            patient_records = patient_records.json()
            patient_records_data = json.loads(patient_records)
            return patient_records_data['data']
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error retrieving patient records: {str(e)}")
        
    
    def modify_patient_record(self, id, patient_record):
        try :
            self.supabase.table('patient_records').update(patient_record).eq('id', id).execute()
            return {"status": "success", "message": "Patient record modified successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error modifying patient record: {str(e)}")
    
    def delete_patient_record(self, id):
        try :
            self.supabase.table('patient_records').delete().eq('id', id).execute()
            return {"status": "success", "message": "Patient record deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting patient record: {str(e)}")
