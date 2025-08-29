
import type { Patient, Appointment, Doctor, Prescription, XRay, EditablePatientProfile, NewXRayFormData, NewPrescriptionFormData, Clinic } from './types';
import type { User, UserRole } from '@/context/auth-context';
import { parseISO, isValid, addMonths, subMonths, setDate, setHours } from 'date-fns';

// --- localStorage Helper Functions ---
const V = '_v8_edit_user_password_fix'; // Incremented version key

const dateReviver = (key: string, value: any) => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (typeof value === 'string' && (key === 'dateTime' || key === 'dateIssued' || key === 'dateTaken')) {
    if (isoDateRegex.test(value)) {
      const d = parseISO(value);
      if (isValid(d)) {
        return d;
      }
    }
  }
  return value;
};

function loadFromLocalStorage<T>(key: string, defaultValue: T[], isDateHeavy: boolean = false): T[] {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const storedValue = localStorage.getItem(key + V);
    if (storedValue) {
      return JSON.parse(storedValue, isDateHeavy ? dateReviver : undefined) as T[];
    }
    localStorage.setItem(key + V, JSON.stringify(defaultValue));
    return defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    try {
        localStorage.setItem(key + V, JSON.stringify(defaultValue));
    } catch (saveError) {
        console.error(`Error saving default ${key} to localStorage after load failure:`, saveError);
    }
    return defaultValue;
  }
}

function saveToLocalStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(key + V, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// --- Simulated Network Delay ---
const simulateNetworkDelay = (delay: number = 300) => new Promise(resolve => setTimeout(resolve, delay));

// --- Initial Mock Data Definitions ---
const today = new Date();
const DEFAULT_CLINIC_ID = 'clinic-default-001';
const BRANCH_CLINIC_ID = 'clinic-branch-002';

const initialMockClinics: Clinic[] = [
  { id: DEFAULT_CLINIC_ID, name: 'MediPoint Main Clinic', address: '100 Central Ave, Metro City', phone: '+15550001111'},
  { id: BRANCH_CLINIC_ID, name: 'MediPoint North Branch', address: '200 North Rd, Uptown', phone: '+15550002222' },
];

const initialMockPatients: Patient[] = [
  {
    id: '1',
    name: 'Alice Wonderland',
    dateOfBirth: '1990-05-15',
    phone: '+15551234567',
    password: 'password123',
    email: 'alice@example.com',
    address: '123 Main St, Anytown, USA',
    medicalHistory: 'No known allergies. Previous appendectomy in 2010.',
    registeredClinicId: DEFAULT_CLINIC_ID,
  },
  {
    id: '2',
    name: 'Bob The Builder',
    dateOfBirth: '1985-10-20',
    phone: '+15559876543',
    password: 'password123',
    email: 'bob@example.com',
    address: '456 Oak Ave, Anytown, USA',
    medicalHistory: 'Seasonal allergies. Hypertension, managed with medication.',
    registeredClinicId: DEFAULT_CLINIC_ID,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    dateOfBirth: '2005-07-30',
    phone: '+15552345678',
    password: 'password123',
    email: 'charlie@example.com',
    address: '789 Pine Ln, Anytown, USA',
    medicalHistory: 'Asthma, uses inhaler as needed.',
    registeredClinicId: BRANCH_CLINIC_ID,
  },
  {
    id: '4',
    name: 'Diana Prince',
    dateOfBirth: '1978-03-22',
    phone: '+15553456789',
    password: 'password123',
    email: 'diana@example.com',
    address: '101 Oracle Rd, Themyscira, USA',
    medicalHistory: 'Excellent health. Occasional migraines.',
    registeredClinicId: BRANCH_CLINIC_ID,
  },
  {
    id: '5',
    name: 'Edward Scissorhands',
    dateOfBirth: '1992-12-01',
    phone: '+15554567890',
    password: 'password123',
    email: 'edward@example.com',
    address: '222 Suburbia Ct, Anytown, USA',
    medicalHistory: 'Needs regular hand maintenance.',
    registeredClinicId: DEFAULT_CLINIC_ID,
  },
  {
    id: '6',
    name: 'Fiona Gallagher',
    dateOfBirth: '1988-08-15',
    phone: '+15555678901',
    password: 'password123',
    email: 'fiona@example.com',
    address: '333 Southside St, Chicago, USA',
    medicalHistory: 'Resilient. Stress-related insomnia at times.',
    registeredClinicId: BRANCH_CLINIC_ID,
  },
  {
    id: '7',
    name: 'George Jetson',
    dateOfBirth: '2022-01-10', // For futuristic fun
    phone: '+15556789012',
    password: 'password123',
    email: 'george@example.com',
    address: 'Orbit City Skypad Apts, Earth',
    medicalHistory: 'Push-button finger. Spacely Sprockets related anxiety.',
    registeredClinicId: DEFAULT_CLINIC_ID,
  },
];

const initialMockSystemUsers: User[] = [
  { id: 'user-doc-001', name: 'Dr. Emily Carter', role: 'doctor', accessCode: 'DOCTOR123', accessPassword: 'password123', clinicId: DEFAULT_CLINIC_ID },
  { id: 'user-doc-002', name: 'Dr. John Smith', role: 'doctor', accessCode: 'JSMITHDOC', accessPassword: 'password123', clinicId: DEFAULT_CLINIC_ID },
  { id: 'user-doc-003', name: 'Dr. Aisha Khan', role: 'doctor', accessCode: 'AKHANDOC', accessPassword: 'password123', clinicId: BRANCH_CLINIC_ID },
  { id: 'user-pharma-001', name: 'Pharmacist Phil', role: 'pharmacist', accessCode: 'PHARMA123', accessPassword: 'password123', clinicId: DEFAULT_CLINIC_ID },
  { id: 'user-lab-001', name: 'Lab Tech Larry', role: 'laboratory', accessCode: 'LAB123', accessPassword: 'password123', clinicId: BRANCH_CLINIC_ID },
  { id: 'user-admin-001', name: 'Admin User', role: 'admin', accessCode: 'ADMIN123', accessPassword: 'adminpass' },
];

const staticDoctorProfiles: Pick<Doctor, 'name' | 'specialty' | 'availability'>[] = [
  {
    name: 'Dr. Emily Carter',
    specialty: 'General Practice',
    availability: 'Monday 9 AM - 5 PM, Wednesday 10 AM - 4 PM, Friday 9 AM - 12 PM',
  },
  {
    name: 'Dr. John Smith',
    specialty: 'Cardiology',
    availability: 'Tuesday 8 AM - 4 PM, Thursday 1 PM - 6 PM',
  },
  {
    name: 'Dr. Aisha Khan',
    specialty: 'Pediatrics',
    availability: 'Monday 10 AM - 6 PM, Wednesday 9 AM - 1 PM',
  }
];

// Define these before they are used in initialMockAppointments, etc.
const defaultClinicName = initialMockClinics.find(c => c.id === DEFAULT_CLINIC_ID)?.name || 'Default Clinic';
const branchClinicName = initialMockClinics.find(c => c.id === BRANCH_CLINIC_ID)?.name || 'Branch Clinic';

const initialMockAppointments: Appointment[] = [
  { id: 'appt-curr-1', patientId: '1', patientName: 'Alice Wonderland', clinicId: DEFAULT_CLINIC_ID, clinicName: defaultClinicName, dateTime: setHours(setDate(today, 5), 10), durationMinutes: 30, reason: 'Consultation', status: 'completed', doctorId: 'user-doc-001', doctorName: 'Dr. Emily Carter' },
  { id: 'appt-curr-2', patientId: '2', patientName: 'Bob The Builder', clinicId: DEFAULT_CLINIC_ID, clinicName: defaultClinicName, dateTime: setHours(setDate(today, 10), 14), durationMinutes: 45, reason: 'Dental Cleaning', status: 'confirmed', doctorId: 'user-doc-002', doctorName: 'Dr. John Smith' },
  { id: 'appt-curr-3', patientId: '3', patientName: 'Charlie Brown', clinicId: DEFAULT_CLINIC_ID, clinicName: defaultClinicName, dateTime: setHours(setDate(today, 15), 9), durationMinutes: 30, reason: 'Vaccination', status: 'scheduled', doctorId: 'user-doc-001', doctorName: 'Dr. Emily Carter' },
  { id: 'appt-curr-b-1', patientId: '4', patientName: 'Diana Prince', clinicId: BRANCH_CLINIC_ID, clinicName: branchClinicName, dateTime: setHours(setDate(today, 20), 11), durationMinutes: 60, reason: 'Follow-up', status: 'completed', doctorId: 'user-doc-003', doctorName: 'Dr. Aisha Khan' },
  { id: 'appt-curr-b-2', patientId: '5', patientName: 'Edward Scissorhands', clinicId: BRANCH_CLINIC_ID, clinicName: branchClinicName, dateTime: setHours(setDate(today, 25), 16), durationMinutes: 30, reason: 'Consultation', status: 'scheduled' },
  { id: 'appt-last-1', patientId: '1', patientName: 'Alice Wonderland', clinicId: DEFAULT_CLINIC_ID, clinicName: defaultClinicName, dateTime: setHours(setDate(subMonths(today, 1), 3), 9), durationMinutes: 30, reason: 'Annual Checkup', status: 'completed', doctorId: 'user-doc-001', doctorName: 'Dr. Emily Carter' },
  { id: 'appt-last-2', patientId: '2', patientName: 'Bob The Builder', clinicId: DEFAULT_CLINIC_ID, clinicName: defaultClinicName, dateTime: setHours(setDate(subMonths(today, 1), 8), 15), durationMinutes: 45, reason: 'Follow-up for Hypertension', status: 'completed', doctorId: 'user-doc-002', doctorName: 'Dr. John Smith' },
  { id: 'appt-last-b-1', patientId: '6', patientName: 'Fiona Gallagher', clinicId: BRANCH_CLINIC_ID, clinicName: branchClinicName, dateTime: setHours(setDate(subMonths(today, 1), 12), 10), durationMinutes: 30, reason: 'Consultation', status: 'completed', doctorId: 'user-doc-003', doctorName: 'Dr. Aisha Khan' },
  { id: 'appt-last-b-2', patientId: '7', patientName: 'George Jetson', clinicId: BRANCH_CLINIC_ID, clinicName: branchClinicName, dateTime: setHours(setDate(subMonths(today, 1), 18), 13), durationMinutes: 60, reason: 'Dental Cleaning', status: 'cancelled' },
  { id: 'appt-prev-1', patientId: '3', patientName: 'Charlie Brown', clinicId: DEFAULT_CLINIC_ID, clinicName: defaultClinicName, dateTime: setHours(setDate(subMonths(today, 2), 22), 11), durationMinutes: 30, reason: 'Vaccination', status: 'completed', doctorId: 'user-doc-001', doctorName: 'Dr. Emily Carter' },
  { id: 'appt-prev-2', patientId: '4', patientName: 'Diana Prince', clinicId: DEFAULT_CLINIC_ID, clinicName: defaultClinicName, dateTime: setHours(setDate(subMonths(today, 2), 28), 14), durationMinutes: 45, reason: 'Follow-up', status: 'completed', doctorId: 'user-doc-002', doctorName: 'Dr. John Smith' },
  { id: 'appt-prev-b-1', patientId: '5', patientName: 'Edward Scissorhands', clinicId: BRANCH_CLINIC_ID, clinicName: branchClinicName, dateTime: setHours(setDate(subMonths(today, 2), 5), 14), durationMinutes: 30, reason: 'Consultation', status: 'completed' },
  { id: 'appt-prev-b-2', patientId: '6', patientName: 'Fiona Gallagher', clinicId: BRANCH_CLINIC_ID, clinicName: branchClinicName, dateTime: setHours(setDate(subMonths(today, 2), 10), 9), durationMinutes: 60, reason: 'Annual Checkup', status: 'completed', doctorId: 'user-doc-003', doctorName: 'Dr. Aisha Khan' },
  { id: 'appt-next-1', patientId: '1', patientName: 'Alice Wonderland', clinicId: DEFAULT_CLINIC_ID, clinicName: defaultClinicName, dateTime: setHours(setDate(addMonths(today, 1), 5), 11), durationMinutes: 30, reason: 'Consultation', status: 'scheduled', doctorId: 'user-doc-001', doctorName: 'Dr. Emily Carter' },
  { id: 'appt-next-b-1', patientId: '4', patientName: 'Diana Prince', clinicId: BRANCH_CLINIC_ID, clinicName: branchClinicName, dateTime: setHours(setDate(addMonths(today, 1), 12), 10), durationMinutes: 60, reason: 'Annual Checkup', status: 'confirmed', doctorId: 'user-doc-003', doctorName: 'Dr. Aisha Khan' },
];

const initialMockPrescriptions: Prescription[] = [
  { id: 'presc1', patientId: '1', medication: 'Amoxicillin 250mg', dosage: '1 tablet 3 times a day for 7 days', instructions: 'Take with food.', dateIssued: new Date(new Date().setDate(new Date().getDate() - 10)), issuingDoctorId: 'user-doc-001', sharedWithPharmacy: true, sharedWithLaboratory: false, },
  { id: 'presc2', patientId: '2', medication: 'Lisinopril 10mg', dosage: '1 tablet daily in the morning', instructions: 'Monitor blood pressure regularly.', dateIssued: new Date(new Date().setDate(new Date().getDate() - 30)), issuingDoctorId: 'user-doc-002', sharedWithPharmacy: false, sharedWithLaboratory: false, },
  { id: 'presc3', patientId: '1', medication: 'Ibuprofen 400mg', dosage: '1 tablet as needed for pain', instructions: 'Do not exceed 3 tablets in 24 hours.', dateIssued: new Date(new Date().setDate(new Date().getDate() - 5)), issuingDoctorId: 'user-doc-001', sharedWithPharmacy: true, sharedWithLaboratory: false, },
  { id: 'presc4', patientId: '3', medication: 'Salbutamol Inhaler', dosage: '2 puffs as needed', instructions: 'For asthma attacks.', dateIssued: new Date(new Date().setDate(new Date().getDate() - 60)), issuingDoctorId: 'user-doc-001', sharedWithPharmacy: true, sharedWithLaboratory: false, },
  { id: 'presc5', patientId: '4', medication: 'Sumatriptan 50mg', dosage: '1 tablet at onset of migraine', instructions: 'May repeat after 2 hours if needed.', dateIssued: new Date(new Date().setDate(new Date().getDate() - 15)), issuingDoctorId: 'user-doc-002', sharedWithPharmacy: false, sharedWithLaboratory: false, },
];

const initialMockXRays: XRay[] = [
  { id: 'xray1', patientId: '1', description: 'Chest X-Ray, PA and Lateral views', dateTaken: new Date(new Date().setDate(new Date().getDate() - 20)), imageUrl: 'https://placehold.co/600x400.png', notes: 'Lungs clear. No acute cardiopulmonary process.', sharedWithPharmacy: false, sharedWithLaboratory: true, },
  { id: 'xray2', patientId: '2', description: 'Left Knee MRI', dateTaken: new Date(new Date().setDate(new Date().getDate() - 40)), imageUrl: 'https://placehold.co/600x400.png', notes: 'Minor cartilage wear. No acute ligament damage.', sharedWithPharmacy: false, sharedWithLaboratory: false, },
  { id: 'xray3', patientId: '3', description: 'Dental X-Ray (Panoramic)', dateTaken: new Date(new Date().setDate(new Date().getDate() - 90)), imageUrl: 'https://placehold.co/600x400.png', notes: 'No cavities detected. Wisdom teeth impacted.', sharedWithPharmacy: false, sharedWithLaboratory: true, },
];


// --- Load data from localStorage or use initial mocks ---
export let mockPatients: Patient[] = loadFromLocalStorage<Patient>('mockPatients', initialMockPatients);
export let mockSystemUsers: User[] = loadFromLocalStorage<User>('mockSystemUsers', initialMockSystemUsers);
export let mockClinics: Clinic[] = loadFromLocalStorage<Clinic>('mockClinics', initialMockClinics);
export let mockAppointments: Appointment[] = loadFromLocalStorage<Appointment>('mockAppointments', initialMockAppointments, true);
export let mockPrescriptions: Prescription[] = loadFromLocalStorage<Prescription>('mockPrescriptions', initialMockPrescriptions, true);
export let mockXRays: XRay[] = loadFromLocalStorage<XRay>('mockXRays', initialMockXRays, true);


// --- Data Access Functions ---
export const getDoctors = async (clinicId?: string): Promise<Doctor[]> => {
  await simulateNetworkDelay();
  
  const doctorsList = mockSystemUsers
    .filter(user => {
        if (user.role !== 'doctor') return false;
        if (clinicId && user.clinicId && user.clinicId !== clinicId) return false;
        return true; 
    })
    .map(user => {
      const profile = staticDoctorProfiles.find(p => p.name === user.name);
      return {
        id: user.id,
        name: user.name,
        specialty: profile?.specialty || 'Not Specified',
        availability: profile?.availability || 'To be configured',
      };
    });
  return doctorsList;
};


export const getPatientById = async (id: string): Promise<Patient | undefined> => {
  await simulateNetworkDelay();
  return mockPatients.find(p => p.id === id);
};

export const updatePatientById = async (id: string, updatedData: EditablePatientProfile): Promise<Patient | undefined> => {
  await simulateNetworkDelay();
  const patientIndex = mockPatients.findIndex(p => p.id === id);
  if (patientIndex > -1) {
    const currentPatient = mockPatients[patientIndex];
    mockPatients[patientIndex] = { 
        ...currentPatient, 
        ...updatedData 
    };
    saveToLocalStorage<Patient>('mockPatients', mockPatients);
    return mockPatients[patientIndex];
  }
  return undefined;
};

export const addOrUpdatePatient = async (
  name: string, 
  phone: string, 
  idFromAuth?: string, 
  password?: string, 
  clinicId: string = DEFAULT_CLINIC_ID
): Promise<Patient> => {
  await simulateNetworkDelay();
  let patientRecord: Patient | undefined;

  if (idFromAuth) {
    patientRecord = mockPatients.find(p => p.id === idFromAuth);
    if (patientRecord) {
      patientRecord.name = name;
      patientRecord.phone = phone;
      if (!patientRecord.registeredClinicId) patientRecord.registeredClinicId = clinicId;
      // Note: Password for an existing authenticated user is typically not updated this way.
      // If a password was provided and we intend to update it, logic would be needed here.
      // For now, we assume password update is a separate flow for authenticated users.
    } else {
      // No patient with this auth ID, create one using the auth ID.
      patientRecord = {
        id: idFromAuth,
        name,
        phone,
        password: password || `authPass-${Date.now()}`, // Use provided password or generate one
        dateOfBirth: '2000-01-01', // Default DOB
        email: `${name.split(' ').join('.').toLowerCase()}.${Date.now()}@example.com`, // Ensure unique email
        address: '123 Synced User St', // Default address
        medicalHistory: 'Patient record synced/created from authenticated session.',
        registeredClinicId: clinicId,
      };
      mockPatients.push(patientRecord);
    }
  } else {
    // No idFromAuth: This is for guest booking or new registration.
    // The login page's handlePatientRegistration pre-checks for phone uniqueness for registration.
    patientRecord = mockPatients.find(p => p.phone === phone);
    if (patientRecord) {
      // Phone number exists. For guest booking, update name.
      // For registration, this path should ideally not be hit if pre-check was done.
      patientRecord.name = name;
      if (!patientRecord.registeredClinicId) patientRecord.registeredClinicId = clinicId;
      // If a password is provided here, it might be an attempt to "claim" a guest account.
      // Current registration flow handles unique phones separately.
      if (password && !patientRecord.password) patientRecord.password = password;
    } else {
      // Phone number does not exist. This is the path for a successful new registration
      // or a first-time guest booking.
      patientRecord = {
        id: `patient-reg-${Date.now()}`, // ID prefix for registered user
        name,
        phone,
        password: password || `regPass-${Date.now()}`, // Use provided password
        dateOfBirth: '2000-01-01', 
        email: `${name.split(' ').join('.').toLowerCase()}.${Date.now()}@example.com`,
        address: 'Registered User Default Address', 
        medicalHistory: 'Patient account created via registration.', // Specific history
        registeredClinicId: clinicId,
      };
      mockPatients.push(patientRecord);
    }
  }

  saveToLocalStorage<Patient>('mockPatients', mockPatients);
  if (!patientRecord) {
    // This should ideally not happen if logic is correct.
    throw new Error("Failed to create or update patient record.");
  }
  return patientRecord;
};


export const getAppointments = async (clinicIdParam?: string, doctorIdParam?: string): Promise<Appointment[]> => {
  await simulateNetworkDelay();
  let appointmentsToReturn = [...mockAppointments];

  if (clinicIdParam) {
    appointmentsToReturn = appointmentsToReturn.filter(app => app.clinicId === clinicIdParam);
  }

  if (doctorIdParam) {
    appointmentsToReturn = appointmentsToReturn.filter(app => app.doctorId === doctorIdParam);
  }
  
  return appointmentsToReturn.map(app => {
    const clinic = mockClinics.find(c => c.id === app.clinicId);
    const doctorUser = mockSystemUsers.find(u => u.id === app.doctorId && u.role === 'doctor');
    return {
        ...app,
        clinicName: app.clinicName || clinic?.name || 'Unknown Clinic',
        doctorName: app.doctorName || doctorUser?.name,
        dateTime: app.dateTime instanceof Date ? app.dateTime : parseISO(app.dateTime as unknown as string)
    };
  });
};

export const addAppointment = async (
  appointmentDetails: Omit<Appointment, 'id' | 'patientId' | 'patientName' | 'clinicId' | 'clinicName' | 'doctorName'>,
  patientId: string,
  patientName: string,
  clinicId: string,
  doctorId?: string
): Promise<Appointment | null> => {
  await simulateNetworkDelay(500);
  const clinic = mockClinics.find(c => c.id === clinicId);
  const clinicName = clinic?.name || 'Unknown Clinic';
  
  let doctorName;
  if (doctorId) {
    const doctorUser = mockSystemUsers.find(u => u.id === doctorId && u.role === 'doctor');
    doctorName = doctorUser?.name;
  }

  const newAppointment: Appointment = {
    ...appointmentDetails,
    id: `appt-${Date.now()}`,
    patientId: patientId,
    patientName: patientName,
    clinicId: clinicId,
    clinicName: clinicName,
    doctorId: doctorId,
    doctorName: doctorName,
  };
  mockAppointments.push(newAppointment);
  saveToLocalStorage<Appointment>('mockAppointments', mockAppointments, true);
  return newAppointment;
};

export const deleteAppointment = async (appointmentId: string): Promise<boolean> => {
  await simulateNetworkDelay();
  const initialLength = mockAppointments.length;
  mockAppointments = mockAppointments.filter(app => app.id !== appointmentId);
  if (mockAppointments.length < initialLength) {
    saveToLocalStorage<Appointment>('mockAppointments', mockAppointments, true);
    return true;
  }
  return false;
};

export const updateAppointment = async (updatedAppointment: Appointment): Promise<Appointment | null> => {
  await simulateNetworkDelay();
  const index = mockAppointments.findIndex(app => app.id === updatedAppointment.id);
  if (index > -1) {
    const clinic = mockClinics.find(c => c.id === updatedAppointment.clinicId);
    let doctorName = updatedAppointment.doctorName;
    if (updatedAppointment.doctorId && !doctorName) {
        const doctorUser = mockSystemUsers.find(u => u.id === updatedAppointment.doctorId && u.role === 'doctor');
        doctorName = doctorUser?.name;
    }

    mockAppointments[index] = {
      ...updatedAppointment,
      clinicName: updatedAppointment.clinicName || clinic?.name || 'Unknown Clinic',
      doctorName: doctorName,
      dateTime: updatedAppointment.dateTime instanceof Date ? updatedAppointment.dateTime : parseISO(updatedAppointment.dateTime as unknown as string)
    };
    saveToLocalStorage<Appointment>('mockAppointments', mockAppointments, true);
    return mockAppointments[index];
  }
  return null;
};


export const getPrescriptionsByPatientId = async (patientId: string): Promise<Prescription[]> => {
  await simulateNetworkDelay();
  return mockPrescriptions.filter(p => p.patientId === patientId).map(p => ({
    ...p,
    dateIssued: p.dateIssued instanceof Date ? p.dateIssued : parseISO(p.dateIssued as unknown as string)
  }));
};

export const addPrescriptionToPatient = async (
  patientId: string,
  prescriptionData: { medication: string; dosage: string; instructions: string; dateIssued: Date; issuingDoctorId: string }
): Promise<Prescription> => {
  await simulateNetworkDelay();
  const newPrescription: Prescription = {
    id: `presc-${Date.now()}`,
    patientId,
    ...prescriptionData,
    sharedWithPharmacy: false,
    sharedWithLaboratory: false,
  };
  mockPrescriptions.push(newPrescription);
  saveToLocalStorage<Prescription>('mockPrescriptions', mockPrescriptions, true);
  return newPrescription;
};


export const getXRaysByPatientId = async (patientId: string): Promise<XRay[]> => {
  await simulateNetworkDelay();
  return mockXRays.filter(x => x.patientId === patientId).map(x => ({
    ...x,
    dateTaken: x.dateTaken instanceof Date ? x.dateTaken : parseISO(x.dateTaken as unknown as string)
  }));
};

export const addXRayToPatient = async (
  patientId: string,
  xrayData: { description: string; dateTaken: Date; imageUrl: string; notes?: string }
): Promise<XRay> => {
  await simulateNetworkDelay();
  const newXRay: XRay = {
    id: `xray-${Date.now()}`,
    patientId,
    description: xrayData.description,
    dateTaken: xrayData.dateTaken,
    imageUrl: xrayData.imageUrl,
    notes: xrayData.notes,
    sharedWithPharmacy: false,
    sharedWithLaboratory: false,
  };
  mockXRays.push(newXRay);
  saveToLocalStorage<XRay>('mockXRays', mockXRays, true);
  return newXRay;
};


export const updatePrescriptionSharingStatus = async (prescriptionId: string, type: 'pharmacy' | 'laboratory', status: boolean): Promise<boolean> => {
  await simulateNetworkDelay();
  const index = mockPrescriptions.findIndex(p => p.id === prescriptionId);
  if (index > -1) {
    if (type === 'pharmacy') {
      mockPrescriptions[index].sharedWithPharmacy = status;
    } else if (type === 'laboratory') {
      mockPrescriptions[index].sharedWithLaboratory = status;
    }
    saveToLocalStorage<Prescription>('mockPrescriptions', mockPrescriptions, true);
    return true;
  }
  return false;
};

export const updateXRaySharingStatus = async (xrayId: string, type: 'pharmacy' | 'laboratory', status: boolean): Promise<boolean> => {
  await simulateNetworkDelay();
  const index = mockXRays.findIndex(x => x.id === xrayId);
  if (index > -1) {
    if (type === 'pharmacy') {
      mockXRays[index].sharedWithPharmacy = status;
    } else if (type === 'laboratory') {
      mockXRays[index].sharedWithLaboratory = status;
    }
    saveToLocalStorage<XRay>('mockXRays', mockXRays, true);
    return true;
  }
  return false;
};


export const getSystemUsers = async (): Promise<User[]> => {
  await simulateNetworkDelay();
  return [...mockSystemUsers];
};

export const addSystemUser = async (user: Omit<User, 'id'> & { accessCode?: string, accessPassword?: string, clinicId?: string }): Promise<User> => {
  await simulateNetworkDelay();
  const newUser: User = {
    id: `user-sys-${Date.now()}`,
    name: user.name,
    role: user.role,
    accessCode: user.accessCode,
    accessPassword: user.accessPassword,
    clinicId: user.clinicId,
  };
  mockSystemUsers.push(newUser);
  saveToLocalStorage<User>('mockSystemUsers', mockSystemUsers);
  
  return newUser;
};

export const updateSystemUser = async (userId: string, updates: Partial<Omit<User, 'id'>>): Promise<User | null> => {
  await simulateNetworkDelay();
  const userIndex = mockSystemUsers.findIndex(user => user.id === userId);
  if (userIndex > -1) {
    // Only update password if a new one is provided and it's not an empty string
    const currentPassword = mockSystemUsers[userIndex].accessPassword;
    const { accessPassword, ...otherUpdates } = updates;

    mockSystemUsers[userIndex] = {
      ...mockSystemUsers[userIndex],
      ...otherUpdates,
    };

    if (accessPassword && accessPassword.trim() !== '') {
      mockSystemUsers[userIndex].accessPassword = accessPassword;
    } else {
      // If no new password or empty password provided, keep the old one
      mockSystemUsers[userIndex].accessPassword = currentPassword;
    }

    saveToLocalStorage<User>('mockSystemUsers', mockSystemUsers);
    return mockSystemUsers[userIndex];
  }
  return null;
};

export const deleteSystemUser = async (userId: string): Promise<boolean> => {
  await simulateNetworkDelay();
  const index = mockSystemUsers.findIndex(user => user.id === userId);
  if (index > -1) {
    mockSystemUsers.splice(index, 1);
    saveToLocalStorage<User>('mockSystemUsers', mockSystemUsers);
    return true;
  }
  return false;
};

// Function to get a clinic by ID (useful for populating clinicName)
export const getClinicById = async (id: string): Promise<Clinic | undefined> => {
    await simulateNetworkDelay();
    return mockClinics.find(c => c.id === id);
};

