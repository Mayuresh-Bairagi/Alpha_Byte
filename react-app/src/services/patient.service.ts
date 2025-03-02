import api from "../lib/axios";
import { Patient } from "../types/Patient";

// Define interface for patient record from API
interface PatientRecord {
  record_id: string;
  id: string; // patient_id
  disease: string;
  symptoms: string[];
  treatment: string;
  medications?: string[]; // optional field
}

interface PatientBasic {
  id: string;
  name: string;
  age: number;
  mobnumber: string;
  gender: string;
  doctor: string;
  last_visit?: string;
  next_visit?: string;
}

// Mock data for testing when backend is unavailable
const mockPatients = {
  patients: [
    {
      id: "1",
      name: "John Doe",
      age: 45,
      mobnumber: "555-123-4567",
      gender: "Male",
      doctor: "Dr. Sarah Johnson",
    },
    {
      id: "2",
      name: "Emily Smith",
      age: 32,
      mobnumber: "555-987-6543",
      gender: "Female",
      doctor: "Dr. Michael Chen",
    },
  ],
};

const mockRecords = {
  "1": {
    record: {
      record_id: "r1",
      id: "1",
      symptoms: ["Headache", "Dizziness", "Shortness of breath"],
      disease: "Hypertension",
      treatment: "Diet modification, regular exercise, and medication",
      medications: ["Lisinopril", "Amlodipine"],
    },
  },
  "2": {
    record: {
      record_id: "r2",
      id: "2",
      symptoms: ["Increased thirst", "Frequent urination", "Fatigue"],
      disease: "Type 2 Diabetes",
      treatment: "Carbohydrate monitoring, regular blood glucose testing",
      medications: ["Metformin", "Insulin"],
    },
  },
};

const useMockData = false; // Set to false when your backend is ready

export const PatientService = {
  // Get all patients basic info (cached)
  getPatients: async () => {
    if (useMockData) {
      console.log("Using mock patient data");
      return mockPatients;
    }
    return api.get<{ patients: PatientBasic[] }>("/patient_all");
  },

  getPatientRecord: async (id: string) => {
    if (useMockData) {
      console.log(`Using mock record data for patient ${id}`);
      return (
        mockRecords[id as keyof typeof mockRecords]?.record || {
          record_id: `r${id}`,
          id: id,
          disease: `Mock Disease for ${id}`,
          symptoms: ["Symptom 1", "Symptom 2"],
          treatment: "Mock treatment plan",
          // Medications intentionally omitted for some records to test fallback
        }
      );
    }

    // The correct API endpoint structure based on the requirement
    try {
      console.log(`Fetching record for patient ID ${id} from API`);
      const response = await api.get(`/patientRecord/{patient_id}?id=${id}`);

      // More detailed logging to debug symptom issues
      console.log(`Successfully fetched record for patient ${id}`);
      console.log(`Response data:`, JSON.stringify(response));

      // Check specifically for symptoms format
      const checkSymptoms = (data: any) => {
        if (!data) return;

        if (data.symptoms) {
          console.log(`Found symptoms for patient ${id}:`, data.symptoms);
          console.log(`Symptoms type:`, typeof data.symptoms);
        }

        if (data.patientRecord && data.patientRecord.symptoms) {
          console.log(
            `Found nested symptoms for patient ${id}:`,
            data.patientRecord.symptoms
          );
          console.log(
            `Nested symptoms type:`,
            typeof data.patientRecord.symptoms
          );
        }
      };

      checkSymptoms(response);

      return response;
    } catch (error) {
      console.error(`Error fetching record for patient ${id}:`, error);
      // Return fallback data if API fails
      return {
        record_id: `error-${id}`,
        id: id,
        disease: "Not Available",
        symptoms: [],
        treatment: "No treatment information available",
        medications: ["Aspirin", "Insulin"],
      };
    }
  },

  // Get single patient (cached)
  getPatient: (id: string) => api.get<APIResponse<Patient>>(`/patient/${id}`),

  // Create patient (no cache)
  createPatient: (data: Partial<Patient>) =>
    api.post<APIResponse<Patient>>("/patient", data),

  // Update patient and clear cache
  updatePatient: (id: string, data: Partial<Patient>) => {
    api.clearCache(`/patient/${id}`);
    api.clearCache("/patient_all");
    api.clearCache(`/patientRecord/{patient_id}?id=${id}`);
    return api.put<APIResponse<Patient>>(`/patient/${id}`, data);
  },

  // Delete patient and clear cache
  deletePatient: (id: string) => {
    api.clearCache(`/patient/${id}`);
    api.clearCache("/patient_all");
    api.clearCache(`/patientRecord/{patient_id}?id=${id}`);
    return api.delete<APIResponse<void>>(`/patient/${id}`);
  },
};
