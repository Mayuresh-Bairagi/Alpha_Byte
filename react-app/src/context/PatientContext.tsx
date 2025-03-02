import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Patient } from "../types/Patient";
import { PatientService } from "../services/patient.service";
import { PaginatedResponse, APIResponse } from "../types/api";

// Define interface for patient record from API
interface PatientRecord {
  record_id: string;
  id: string; // patient_id
  symptoms: string[];
  disease: string;
  treatment: string;
  medications?: string[];
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

interface PatientContextType {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  addPatient: (patient: Patient) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  refreshPatients: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Improved helper function to process symptoms with better pattern matching
  const processSymptoms = (symptomsData: any): string[] => {
    // Handle invalid inputs
    if (!symptomsData) {
      return [];
    }

    console.log("Processing symptoms input:", JSON.stringify(symptomsData));

    // Case 1: If it's already an array, return it
    if (Array.isArray(symptomsData)) {
      return symptomsData;
    }

    // Case 2: If it's a string, split it properly
    if (typeof symptomsData === "string") {
      const trimmed = symptomsData.trim();
      if (trimmed === "") return [];

      // Split by comma, period, semicolon, or 'or', 'and' and trim each item
      const splitRegex = /,|\.|;|\s(?:or|and)\s/;

      // Log the string we're about to split for debugging
      console.log(`Splitting symptom string: "${trimmed}"`);

      const symptoms = trimmed
        .split(splitRegex)
        .map((s) => s.trim())
        .filter((s) => s !== "");

      console.log("Processed symptoms:", symptoms);
      return symptoms;
    }

    // Case 3: If it's an object with a string property for symptoms
    if (symptomsData && typeof symptomsData === "object") {
      // Try to find a symptoms property
      if (
        "symptoms" in symptomsData &&
        typeof symptomsData.symptoms === "string"
      ) {
        return processSymptoms(symptomsData.symptoms);
      }

      // Try looking for a property that might contain symptoms
      for (const key in symptomsData) {
        if (
          typeof symptomsData[key] === "string" &&
          (key.includes("symptom") || key === "description")
        ) {
          return processSymptoms(symptomsData[key]);
        }
      }
    }

    // Default case: Unable to extract symptoms
    console.warn("Unable to extract symptoms from data:", symptomsData);
    return [];
  };

  // Enhanced data mapping with better symptoms handling and handling typos
  const mapPatientData = (
    basicData: PatientBasic,
    recordData: any
  ): Patient => {
    // Extract data safely with fallbacks
    const safeRecord = recordData || {};

    // Log raw record data with key names for diagnosis
    console.log(`Raw record data for ${basicData.id}:`, safeRecord);
    console.log(`Record data keys:`, Object.keys(safeRecord));

    // Special handling for symptoms with typo handling
    let symptoms: string[] = [];

    // Check for the misspelled "symtoms" field
    if (safeRecord.symtoms) {
      console.log(
        `Found misspelled symptoms (symtoms) for patient ${basicData.id}:`,
        safeRecord.symtoms
      );
      symptoms = processSymptoms(safeRecord.symtoms);
    }
    // Continue with other checks if the misspelled field wasn't found
    else if ("patientRecord" in safeRecord && safeRecord.patientRecord) {
      // Check both correct spelling and misspelling in patientRecord
      const symptomData =
        safeRecord.patientRecord.symptoms || safeRecord.patientRecord.symtoms;
      if (symptomData) {
        symptoms = processSymptoms(symptomData);
      }
    } else if ("symptoms" in safeRecord) {
      symptoms = processSymptoms(safeRecord.symptoms);
    } else if (safeRecord.record) {
      // Check both correct spelling and misspelling in record
      const symptomData =
        safeRecord.record.symptoms || safeRecord.record.symtoms;
      if (symptomData) {
        symptoms = processSymptoms(symptomData);
      }
    }

    console.log(
      `Final processed symptoms for patient ${basicData.id}:`,
      symptoms
    );

    return {
      id: basicData.id,
      name: basicData.name || "Unknown",
      age: basicData.age || 0,
      gender: basicData.gender || "Not Specified",
      disease: safeRecord.disease || "Not Available",
      symptoms: symptoms,
      medications: safeRecord.medications || [
        "Pertuzumab",
        "Lapatinib",
        "Tucatinib",
      ],
      treatment: safeRecord.treatment || "No treatment plan available",
      contactNumber: basicData.mobnumber || "N/A",
      mobile_number: basicData.mobnumber || "N/A",
      doctor_Assigned: basicData.doctor || "Unassigned",
      lastVisit: basicData.last_visit || "2025-03-10",
      nextAppointment: basicData.next_visit || "2025-03-10",
    };
  };

  // Improved fetch function with better logging of API response
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching patient list...");
      const patientsData = await PatientService.getPatients();
      const patientsList = patientsData.patients || [];

      if (patientsList.length === 0) {
        console.log("No patients found in API response");
        setPatients([]);
        setLoading(false);
        return;
      }

      console.log(
        `Found ${patientsList.length} patients, fetching detailed records...`
      );

      const fullPatientsData = await Promise.all(
        patientsList.map(async (basicPatient) => {
          try {
            console.log(`Fetching record for patient ${basicPatient.id}`);
            const recordResponse = await PatientService.getPatientRecord(
              basicPatient.id
            );

            // Extract the record data from the response based on the actual structure
            // Debug the actual response structure
            console.log(`Record response structure:`, recordResponse);

            // Try different possible structures based on the logs
            let recordData = null;

            // Check all possible paths where the record data might be
            if (recordResponse.patientRecord) {
              recordData = recordResponse.patientRecord;
              console.log("Found record in patientRecord property");
            } else if (recordResponse.record) {
              recordData = recordResponse.record;
              console.log("Found record in record property");
            } else if (
              recordResponse.data &&
              recordResponse.data.patientRecord
            ) {
              recordData = recordResponse.data.patientRecord;
              console.log("Found record in data.patientRecord property");
            } else if (recordResponse.data && recordResponse.data.record) {
              recordData = recordResponse.data.record;
              console.log("Found record in data.record property");
            } else {
              // If none of the expected properties exist, assume the response itself is the record
              recordData = recordResponse;
              console.log("Using the entire response as record");
            }

            console.log(`Record data extracted:`, recordData);

            // More detailed symptom logging with typo awareness
            if (recordData) {
              console.log(
                `Checking symptoms for patient ${basicPatient.id}...`
              );
              if (recordData.symptoms) {
                console.log(`Found symptoms:`, recordData.symptoms);
              }
              if (recordData.symtoms) {
                console.log(
                  `Found misspelled symptoms (symtoms):`,
                  recordData.symtoms
                );
              }

              // Check nested too
              if (recordData.patientRecord?.symptoms) {
                console.log(
                  `Found nested symptoms:`,
                  recordData.patientRecord.symptoms
                );
              }
              if (recordData.patientRecord?.symtoms) {
                console.log(
                  `Found nested misspelled symptoms:`,
                  recordData.patientRecord.symtoms
                );
              }
            }

            // Map data to our Patient model
            const mappedPatient = mapPatientData(basicPatient, recordData);

            // Debug the mapped patient
            console.log(
              `Mapped patient data for ID ${basicPatient.id}:`,
              mappedPatient
            );

            return mappedPatient;
          } catch (err) {
            console.error(
              `Failed to fetch/process record for patient ${basicPatient.id}:`,
              err
            );
            return mapPatientData(basicPatient, null);
          }
        })
      );

      console.log(
        `Successfully processed ${fullPatientsData.length} patient records`
      );
      setPatients(fullPatientsData);
    } catch (err: any) {
      console.error("Error in fetchPatients:", err);
      setError(err.message || "Failed to fetch patients data");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPatient = async (patient: Patient) => {
    try {
      const response = await PatientService.createPatient(patient);
      setPatients([...patients, response.data]);
    } catch (err) {
      console.error("Error adding patient:", err);
      throw err;
    }
  };

  const updatePatient = async (updatedPatient: Patient) => {
    try {
      const response = await PatientService.updatePatient(
        updatedPatient.id,
        updatedPatient
      );
      setPatients(
        patients.map((patient) =>
          patient.id === updatedPatient.id ? response.data : patient
        )
      );

      if (selectedPatient && selectedPatient.id === updatedPatient.id) {
        setSelectedPatient(response.data);
      }
    } catch (err) {
      console.error("Error updating patient:", err);
      throw err;
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await PatientService.deletePatient(id);
      setPatients(patients.filter((patient) => patient.id !== id));

      if (selectedPatient && selectedPatient.id === id) {
        setSelectedPatient(null);
      }
    } catch (err) {
      console.error("Error deleting patient:", err);
      throw err;
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        loading,
        error,
        selectedPatient,
        setSelectedPatient,
        addPatient,
        updatePatient,
        deletePatient,
        refreshPatients: fetchPatients,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatients must be used within a PatientProvider");
  }
  return context;
};
