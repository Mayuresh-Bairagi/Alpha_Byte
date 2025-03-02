export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  disease: string;
  symptoms: string[];
  medications: string[];
  treatment: string;
  lastVisit?: string;
  nextAppointment?: string | null;
  contactNumber: string;
  mobile_number?: string;
  doctor_Assigned: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}
