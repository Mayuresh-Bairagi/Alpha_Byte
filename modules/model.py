from pydantic import BaseModel, EmailStr, conint, StringConstraints
from typing import Literal
from datetime import date
from typing import Annotated



class patient(BaseModel):
    name: str
    age: conint(ge=0, le=150)
    mobnumber : str
    gender : Literal["Male", "Female", "Other"]
    doctor : str   

class patientRecord(BaseModel):
    id : int
    symtoms : str
    disease : str
    treatment : str