
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string; // Stored as YYYY-MM-DD string for easier input binding
  phone: string; // Acts as a username for password login
  password?: string; // Added for password-based login
  email?: string;
  address?: string;
  medicalHistory?: string;
  registeredClinicId?: string; // ID of the clinic patient is primarily associated with
}

export interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  // Add other clinic-specific settings here in the future
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string; // Denormalized for easy display
  clinicId: string; // New: ID of the clinic this appointment belongs to
  clinicName?: string; // New: Denormalized clinic name
  dateTime: Date;
  durationMinutes: number;
  reason?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  doctorId?: string; // ID of the assigned doctor
  doctorName?: string; // Denormalized doctor name
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: string; // Simple string for now, e.g., "Mon 9-5, Tue 1-5"
}

export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  instructions: string;
  dateIssued: Date;
  issuingDoctorId: string; // In a real app, this would link to a Doctor's ID
  sharedWithPharmacy: boolean;
  sharedWithLaboratory: boolean;
}

export interface XRay {
  id: string;
  patientId: string;
  description: string;
  dateTaken: Date;
  imageUrl: string; // URL to the X-ray image (can be placeholder or Data URI)
  notes?: string;
  sharedWithPharmacy: boolean;
  sharedWithLaboratory: boolean;
}

export type SmartSchedulerInput = {
  patientSchedulePreferences: string;
  doctorAvailability: string;
};

export type SmartSchedulerOutput = {
  suggestedAppointmentTime: string;
  reasoning: string;
};

// Type for the new X-Ray form data
export interface NewXRayFormData {
  description: string;
  dateTaken: string; // Store as string from input type="date"
  imageFile?: File;
  notes?: string;
}

// Type for the new Prescription form data
export interface NewPrescriptionFormData {
  medication: string;
  dosage: string;
  instructions: string;
  dateIssued: string; // Store as string from input type="date"
}

// Type for editing patient profile
export type EditablePatientProfile = Omit<Patient, 'id' | 'password' | 'registeredClinicId'>;
