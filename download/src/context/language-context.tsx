
'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

export type Language = 'en' | 'ar';

interface Translations {
  [key: string]: string | Translations;
}

interface LoginTranslations extends Translations {
  loginTitle: string;
  loginDescription: string;
  patientLoginTab: string;
  staffLoginTab: string;
  registerTab: string; 
  phoneNumberLabel: string;
  phoneNumberPlaceholder: string;
  patientPasswordLabel: string;
  patientPasswordPlaceholder: string;
  patientLoginButton: string;
  patientLoginHint: string;
  sendOtpButton: string;
  otpLabel: string;
  otpPlaceholder: string;
  verifyOtpButton: string;
  accessCodeLabel: string;
  accessCodePlaceholder: string;
  accessPasswordLabel: string;
  accessPasswordPlaceholder: string;
  accessCodeHint: string;
  loginWithCodeButton: string;
  switchToEnglish: string;
  switchToArabic: string;
  languageSwitcherLabel: string;
  loginSuccessTitle: string;
  loginSuccessDescriptionPatient: string;
  loginSuccessDescriptionStaff: string;
  loginSuccessDescriptionDoctor: string;
  loginSuccessDescriptionPharmacist: string;
  loginSuccessDescriptionLaboratory: string;
  loginSuccessDescriptionAdmin: string;
  otpSentTitle: string;
  otpSentDescription: string;
  missingPhoneNumberTitle: string;
  missingPhoneNumberDescription: string;
  missingPhoneOrPasswordTitle: string;
  missingPhoneOrPasswordDescription: string;
  invalidPhoneOrPasswordTitle: string;
  invalidPhoneOrPasswordDescription: string;
  missingOtpTitle: string;
  missingOtpDescription: string;
  missingAccessCodeTitle: string;
  missingAccessCodeDescription: string;
  missingAccessCodeOrPasswordTitle: string;
  missingAccessCodeOrPasswordDescription: string;
  invalidAccessCodeTitle: string;
  invalidAccessCodeDescription: string;
  invalidCredentialsTitle: string;
  invalidCredentialsDescription: string;
  changeNumberOrResend: string;
  defaultPatientNameOtp: string;
  
  fullNameLabelReg: string;
  fullNamePlaceholderReg: string;
  phoneNumberLabelReg: string;
  phoneNumberPlaceholderReg: string;
  passwordLabelReg: string;
  passwordPlaceholderReg: string;
  confirmPasswordLabelReg: string;
  confirmPasswordPlaceholderReg: string;
  registerButton: string;
  registrationSuccessTitle: string;
  registrationSuccessDescription: string;
  registrationErrorTitle: string;
  registrationErrorDescription: string;
  passwordsDoNotMatchTitle: string;
  passwordsDoNotMatchDescription: string;
  phoneNumberExistsTitle: string;
  phoneNumberExistsDescription: string;
  missingRegistrationFieldsTitle: string;
  missingRegistrationFieldsDescription: string;
}

interface HeaderTranslations extends Translations {
  appointments: string;
  smartScheduler: string;
  adminPanel: string;
  login: string;
  logout: string;
  openMenu: string;
  patientDashboard: string;
  doctorDashboard: string;
  pharmacistDashboard: string;
  laboratoryDashboard: string;
  adminManagementDashboard: string;
  patientManagement: string;
  patientRecordsPharmacist: string;
  patientRecordsLaboratory: string;
}

interface HomeTranslations extends Translations {
  welcomeTitle: string;
  welcomeDescription: string;
  // bookAppointmentButton: string; // Removed
  // smartSchedulerButton: string; // Removed
  featureEasySchedulingTitle: string;
  featureEasySchedulingDescription: string;
  featureAdminPanelTitle: string;
  featureAdminPanelDescription: string;
  featureSmartAssistantTitle: string;
  featureSmartAssistantDescription: string;
  featurePatientInfoTitle: string;
  featurePatientInfoDescription: string;
  featureWhatsappTitle: string;
  featureWhatsappDescription: string;
  featureHealthRecordsTitle: string;
  featureHealthRecordsDescription: string;
  modernCareTitle: string;
  modernCarePara1: string;
  modernCarePara2: string;
}

interface AppointmentsPageTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  selectDate: string;
  selectTimeSlotFor: string;
  selectTimePlaceholder: string;
  confirmDetailsTitle: string;
  bookingFor: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  whatsappNotifications: string;
  bookAppointmentButton: string;
  missingInfoToastTitle: string;
  missingInfoToastDescription: string;
  missingInfoToastDescriptionDoctor: string; 
  bookedToastTitle: string;
  bookedToastDescription: string;
  bookedToastDescriptionDoctor: string; 
  loadingCalendar: string;
  noSlotsAvailable: string;
  defaultBookingReason: string;
  selectDoctorLabel: string; 
  selectDoctorPlaceholder: string; 
  withDoctorLabel: string; 
  unknownDoctor: string; 
  bookingFailedToastTitle: string; 
  bookingFailedToastDescription: string; 
  selectClinicLabel: string;
  selectClinicPlaceholder: string;
  atClinicLabel: string;
  noDoctorsAvailable: string;
  promptSelectClinic: string;
  promptSelectDoctor: string;
}

interface SmartSchedulerPageTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  errorTitle: string;
  errorMessage: string;
  suggestionTitle: string;
  bestTimeLabel: string;
  reasoningLabel: string;
}

interface SchedulerFormTranslations extends Translations {
  patientPrefsLabel: string;
  patientPrefsPlaceholder: string;
  doctorAvailLabel: string;
  doctorAvailPlaceholder: string;
  getSuggestionButton: string;
}

interface AdminPageTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  addAppointmentButton: string;
  patientNameHeader: string;
  dateTimeHeader: string;
  durationHeader: string;
  reasonHeader: string;
  statusHeader: string;
  actionsHeader: string;
  noAppointmentsFound: string;
  dialogEditTitle: string;
  dialogAddTitle: string;
  dialogEditDescription: string;
  dialogAddDescription: string;
  patientLabel: string;
  patientSelectPlaceholder: string;
  dateTimeLabel: string;
  durationLabel: string;
  reasonLabel: string;
  statusLabel: string;
  statusSelectPlaceholder: string;
  cancelButton: string;
  saveButton: string;
  appointmentDeletedToastTitle: string;
  appointmentDeletedToastDescription: string;
  appointmentUpdatedToastTitle: string;
  appointmentUpdatedToastDescription: string;
  appointmentAddedToastTitle: string;
  appointmentAddedToastDescription: string;
  loadingAdminPanel: string;
  statusScheduled: string;
  statusConfirmed: string;
  statusCancelled: string;
  statusCompleted: string;
  statusPlaceholder: string;
  doctorHeader: string; 
  doctorLabel: string; 
  clinicLabel: string; 
  noDoctorAssigned: string; 
  errorToastTitle: string; 
  errorDeletingAppointment: string; 
  errorPatientNotSelected: string; 
  errorUpdatingAppointment: string; 
  errorAddingAppointment: string; 
}

interface PatientDetailPageTranslations extends Translations {
  patientNotFoundTitle: string;
  patientNotFoundDescription: string;
  goToAdminButton: string;
  backToPatientListButton: string;
  patientIdLabel: string;
  editProfileButton: string;
  dateOfBirthLabel: string;
  phoneLabel: string;
  emailLabel: string;
  addressLabel: string;
  medicalHistoryLabel: string;
  prescriptionsTitle: string;
  prescriptionsDosage: string;
  prescriptionsInstructions: string;
  prescriptionsIssued: string;
  prescriptionsByDoctor: string;
  noPrescriptionsFound: string;
  noPrescriptionsSharedWithPharmacy: string;
  noPrescriptionsSharedWithPharmacyMessage: string;
  xraysTitle: string;
  xraysTaken: string;
  xraysNotes: string;
  noXRaysFound: string;
  noXRaysSharedWithLaboratory: string;
  noXRaysSharedWithLaboratoryMessage: string;
  addNewPrescriptionButton: string;
  editPrescriptionButton: string;
  addNewXRayButton: string;
  featurePlaceholderToastTitle: string;
  featurePlaceholderToastDescription: string;
  shareWithPharmacyLabel: string;
  shareWithLaboratoryLabel: string;
  sharingStatusUpdatedTitle: string;
  sharingStatusUpdatedDescription: string;
  sharedAction: string;
  unsharedAction: string;
  pharmacyEntity: string;
  laboratoryEntity: string;
  currentlySharedWithPharmacy: string;
  currentlySharedWithLaboratory: string;
  loadingPatientData: string;
  notApplicable: string;
  viewImageTooltip: string;

  editProfileDialogTitle: string;
  editProfileDialogDescription: string;
  formLabelName: string;
  formLabelDob: string;
  formLabelPhone: string;
  formLabelEmail: string;
  formLabelAddress: string;
  formLabelMedicalHistory: string;
  dialogSaveButton: string;
  dialogCancelButton: string;
  profileUpdatedSuccessTitle: string;
  profileUpdatedSuccessDescription: string;
  profileUpdatedErrorTitle: string;
  profileUpdatedErrorDescription: string;

  prescriptionDialogTitle: string;
  prescriptionDialogDescription: string;
  prescriptionFormMedication: string;
  prescriptionFormMedicationPlaceholder: string;
  prescriptionFormDosage: string;
  prescriptionFormDosagePlaceholder: string;
  prescriptionFormInstructions: string;
  prescriptionFormInstructionsPlaceholder: string;
  prescriptionFormDateIssued: string;
  prescriptionDialogErrorTitle: string;
  prescriptionDialogErrorDescription: string;
  prescriptionAddedSuccessTitle: string;
  prescriptionAddedSuccessDescription: string;

  xrayDialogTitle: string;
  xrayDialogDescription: string;
  xrayDialogDescriptionLabel: string;
  xrayDialogDescriptionPlaceholder: string;
  xrayDialogDateTakenLabel: string;
  xrayDialogImageUploadLabel: string;
  xrayDialogNotesLabel: string;
  xrayDialogNotesPlaceholder: string;
  xrayDialogErrorTitle: string;
  xrayDialogErrorDescription: string;
  xrayAddedSuccessTitle: string;
  xrayAddedSuccessDescription: string;
}


interface PatientDashboardTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  myAppointmentsTitle: string;
  myAppointmentsDescription: string;
  myProfileTitle: string;
  myProfileDescription: string;
}

interface StaffDashboardTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  adminPanelTitle: string;
  adminPanelDescription: string;
  patientManagementTitle: string;
  patientManagementDescription: string;
  shareCenterTitle: string;
  shareCenterDescription: string;
}

interface DoctorDashboardTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  manageAppointmentsTitle: string;
  manageAppointmentsDescription: string;
  patientRecordsTitle: string;
  patientRecordsDescription: string;
  appointmentCalendarTitle: string;
  appointmentsForDateLabel: string;
  noAppointmentsForDay: string;
  patientLabel: string;
  reasonLabel: string;
  viewPatientButton: string;
  loadingDashboard: string;
}

interface DoctorPatientManagementTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  loadingPage: string;
  tableHeaderName: string;
  tableHeaderDob: string;
  tableHeaderPhone: string;
  tableHeaderActions: string;
  viewRecordButton: string;
  noPatientsFound: string;
}

interface PharmacistDashboardTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  loadingDashboard: string;
  viewPatientRecordsTitle: string;
  viewPatientRecordsDescription: string;
  actionsLabel: string;
  addNoteForDoctorButton: string;
  toastFeaturePlannedTitle: string;
  toastAddNoteForDoctorDescription: string;
}

interface PharmacistPatientListTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  loadingPage: string;
  tableHeaderName: string;
  tableHeaderDob: string;
  tableHeaderPhone: string;
  tableHeaderActions: string;
  viewRecordButton: string;
  noPatientsFound: string;
}

interface LaboratoryDashboardTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  loadingDashboard: string;
  viewPatientRecordsTitle: string;
  viewPatientRecordsDescription: string;
  actionsLabel: string;
  addReportForDoctorButton: string;
  toastFeaturePlannedTitle: string;
  toastAddReportForDoctorDescription: string;
}

interface LaboratoryPatientListTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  loadingPage: string;
  tableHeaderName: string;
  tableHeaderDob: string;
  tableHeaderPhone: string;
  tableHeaderActions: string;
  viewRecordButton: string;
  noPatientsFound: string;
}

interface AdminDashboardTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  userManagementTitle: string;
  userManagementDescription: string;
  systemSettingsTitle: string;
  systemSettingsDescription: string;
  dataAnalysisTitle: string;
  dataAnalysisDescription: string;
  accessDeniedTitle: string;
  accessDeniedDescription: string;
}

interface AdminUserManagementPageTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  loadingPage: string;
  addUserButton: string;
  tableHeaderId: string;
  tableHeaderName: string;
  tableHeaderRole: string;
  tableHeaderAccessCode: string;
  tableHeaderActions: string;
  noUsersFound: string;
  dialogAddUserTitle: string;
  dialogAddUserDescription: string;
  dialogEditUserTitle: string;
  dialogEditUserDescription: string;
  formLabelName: string;
  formPlaceholderName: string;
  formLabelRole: string;
  formPlaceholderRole: string;
  formLabelAccessCode: string;
  formPlaceholderAccessCode: string;
  formLabelAccessPassword: string;
  formPlaceholderAccessPassword: string;
  formPlaceholderEditPassword?: string;
  dialogCancelButton: string;
  dialogAddButton: string;
  dialogSaveButton: string;
  toastUserAddedTitle: string;
  toastUserAddedDescription: string;
  toastUserUpdatedTitle?: string;
  toastUserUpdatedDescription?: string;
  toastEditUserErrorTitle?: string;
  toastEditUserErrorDescription?: string;
  toastMissingFieldsTitle: string;
  toastMissingFieldsDescription: string;
  toastMissingFieldsWithAccessCodeDescription: string;
  toastMissingFieldsFullDescription: string;
  toastEditUserPlaceholderTitle: string;
  toastEditUserPlaceholderDescription: string;
  toastUserDeletedTitle: string;
  toastUserDeletedDescription: string;
  confirmDeleteUser: string;
  roleNotApplicable: string;
  roleDoctor: string;
  rolePharmacist: string;
  roleLaboratory: string;
  roleAdmin: string;
  tableHeaderClinic: string; 
  formLabelClinic: string; 
  formPlaceholderClinic: string; 
  noClinicAssigned: string; 
  toastMissingClinicDescription: string; 
}

interface AdminSystemSettingsPageTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  loadingPage: string;
  generalSettingsTitle: string;
  clinicNameLabel: string;
  clinicNamePlaceholder: string;
  adminEmailLabel: string;
  adminEmailPlaceholder: string;
  appointmentSettingsTitle: string;
  defaultDurationLabel: string;
  notificationSettingsTitle: string;
  enableWhatsappLabel: string;
  whatsappHint: string;
  saveSettingsButton: string;
  toastSettingsSavedTitle: string;
  toastSettingsSavedDescription: string;
}

interface AdminDataAnalysisPageTranslations extends Translations {
  pageTitle: string;
  pageDescription: string;
  loadingPage: string;
  appointmentVolumeTitle: string;
  patientDemographicsTitle: string;
  patientDemographicsDescription: string;
  patientDemographicsDetailDesc: string; 
  peakBookingTimesTitle: string;
  peakBookingTimesDescription: string;
  peakBookingTimesDetailDesc: string; 
  servicePopularityTitle: string;
  servicePopularityDescription: string;
  servicePopularityDetailDesc: string; 
  userActivityLogsTitle: string;
  userActivityLogsDescription: string;
  userActivityLogsDetailDesc: string; 
  revenueAnalyticsTitle: string;
  revenueAnalyticsDescription: string;
  loadingChartData: string;
  loadingPatientData: string;
  loadingAppointmentData: string;
  loadingServiceData: string;
  noAppointmentDataForChart: string;
  noPatientDataForChart: string;
  noServiceData: string;
  viewDetailsButton: string; 
  dialogCloseButton: string; 
}


interface AppTranslations {
  login: LoginTranslations;
  header: HeaderTranslations;
  home: HomeTranslations;
  appointments: AppointmentsPageTranslations;
  smartScheduler: SmartSchedulerPageTranslations;
  schedulerForm: SchedulerFormTranslations;
  admin: AdminPageTranslations;
  patientDetail: PatientDetailPageTranslations;
  patientDashboard: PatientDashboardTranslations;
  staffDashboard: StaffDashboardTranslations;
  doctorDashboard: DoctorDashboardTranslations;
  doctorPatientManagement: DoctorPatientManagementTranslations;
  pharmacistDashboard: PharmacistDashboardTranslations;
  pharmacistPatientList: PharmacistPatientListTranslations;
  laboratoryDashboard: LaboratoryDashboardTranslations;
  laboratoryPatientList: LaboratoryPatientListTranslations;
  adminDashboard: AdminDashboardTranslations;
  adminUserManagement: AdminUserManagementPageTranslations;
  adminSystemSettings: AdminSystemSettingsPageTranslations;
  adminDataAnalysis: AdminDataAnalysisPageTranslations;
}

const translations: Record<Language, AppTranslations> = {
  en: {
    login: {
      loginTitle: 'Access Your Account',
      loginDescription: 'Select your login method.',
      patientLoginTab: 'Patient Login',
      staffLoginTab: 'Staff/Partner',
      registerTab: 'Register',
      phoneNumberLabel: 'Phone Number (Username)',
      phoneNumberPlaceholder: 'Enter your phone number',
      patientPasswordLabel: 'Password',
      patientPasswordPlaceholder: 'Enter your password',
      patientLoginButton: 'Login',
      patientLoginHint: "Hint: For mock users, use phone e.g., '+15551234567' with password 'password123'.",
      sendOtpButton: 'Send OTP',
      otpLabel: 'One-Time Password (OTP)',
      otpPlaceholder: 'Enter OTP received',
      verifyOtpButton: 'Verify OTP & Login',
      accessCodeLabel: 'Access Code',
      accessCodePlaceholder: 'Enter your access code',
      accessPasswordLabel: 'Password',
      accessPasswordPlaceholder: 'Enter your password',
      accessCodeHint: "Hint: Use codes like DOCTOR123 with password 'password123' or ADMIN123 with 'adminpass'.",
      loginWithCodeButton: 'Login with Code',
      switchToEnglish: 'English',
      switchToArabic: 'العربية',
      languageSwitcherLabel: 'Switch Language:',
      loginSuccessTitle: 'Login Successful',
      loginSuccessDescriptionPatient: 'Redirecting to your dashboard...',
      loginSuccessDescriptionStaff: 'Redirecting to staff dashboard...',
      loginSuccessDescriptionDoctor: 'Redirecting to Doctor Dashboard...',
      loginSuccessDescriptionPharmacist: 'Redirecting to Pharmacist Dashboard...',
      loginSuccessDescriptionLaboratory: 'Redirecting to Laboratory Dashboard...',
      loginSuccessDescriptionAdmin: 'Redirecting to Admin Dashboard...',
      otpSentTitle: 'OTP Sent',
      otpSentDescription: 'OTP has been sent to your phone (mock).',
      missingPhoneNumberTitle: 'Missing Phone Number',
      missingPhoneNumberDescription: 'Please enter your phone number to receive an OTP.',
      missingPhoneOrPasswordTitle: 'Missing Information',
      missingPhoneOrPasswordDescription: 'Please enter both phone number and password.',
      invalidPhoneOrPasswordTitle: 'Login Failed',
      invalidPhoneOrPasswordDescription: 'Invalid phone number or password.',
      missingOtpTitle: 'Missing OTP',
      missingOtpDescription: 'Please enter the OTP.',
      missingAccessCodeTitle: 'Missing Access Code',
      missingAccessCodeDescription: 'Please enter your access code.',
      missingAccessCodeOrPasswordTitle: 'Missing Credentials',
      missingAccessCodeOrPasswordDescription: 'Please enter both Access Code and Password.',
      invalidAccessCodeTitle: 'Invalid Access Code',
      invalidAccessCodeDescription: 'The access code provided is incorrect.',
      invalidCredentialsTitle: 'Invalid Credentials',
      invalidCredentialsDescription: 'The Access Code or Password is incorrect.',
      changeNumberOrResend: 'Change phone number or resend OTP',
      defaultPatientNameOtp: 'Patient',
      
      fullNameLabelReg: 'Full Name',
      fullNamePlaceholderReg: 'Enter your full name',
      phoneNumberLabelReg: 'Phone Number',
      phoneNumberPlaceholderReg: 'Enter your phone number',
      passwordLabelReg: 'Password',
      passwordPlaceholderReg: 'Choose a strong password (min. 6 characters)',
      confirmPasswordLabelReg: 'Confirm Password',
      confirmPasswordPlaceholderReg: 'Re-enter your password',
      registerButton: 'Register',
      registrationSuccessTitle: 'Registration Successful!',
      registrationSuccessDescription: 'Your account has been created. Redirecting to your dashboard...',
      registrationErrorTitle: 'Registration Failed',
      registrationErrorDescription: 'An unexpected error occurred. Please try again.',
      passwordsDoNotMatchTitle: 'Passwords Do Not Match',
      passwordsDoNotMatchDescription: 'Please ensure both passwords are the same.',
      phoneNumberExistsTitle: 'Phone Number Already Registered',
      phoneNumberExistsDescription: 'This phone number is already associated with an account. Please login or use a different number.',
      missingRegistrationFieldsTitle: 'Missing Information',
      missingRegistrationFieldsDescription: 'Please fill in all fields to register.',
    },
    header: {
      appointments: 'Appointments',
      smartScheduler: 'Smart Scheduler',
      adminPanel: 'Appointment Admin',
      login: 'Login',
      logout: 'Logout',
      openMenu: 'Open menu',
      patientDashboard: 'My Dashboard',
      doctorDashboard: 'Doctor Dashboard',
      pharmacistDashboard: 'Pharmacist Tools',
      laboratoryDashboard: 'Laboratory Tools',
      adminManagementDashboard: 'Admin Dashboard',
      patientManagement: 'Patient Records',
      patientRecordsPharmacist: 'Patient Records',
      patientRecordsLaboratory: 'Patient Records',
    },
    home: {
      welcomeTitle: 'Welcome to MediPoint',
      welcomeDescription: 'Streamlining healthcare appointments with smart technology and seamless communication.',
      // bookAppointmentButton: 'Book an Appointment', // Removed
      // smartSchedulerButton: 'Smart Scheduler', // Removed
      featureEasySchedulingTitle: 'Easy Appointment Scheduling',
      featureEasySchedulingDescription: 'Patients can easily view available slots and book appointments online in minutes.',
      featureAdminPanelTitle: 'Admin Management Panel',
      featureAdminPanelDescription: 'Clinic staff can efficiently manage schedules, update availabilities, and oversee appointments.',
      featureSmartAssistantTitle: 'Smart Scheduling Assistant',
      featureSmartAssistantDescription: 'AI-powered tool to recommend optimal appointment times based on preferences and availability.',
      featurePatientInfoTitle: 'Patient Information Hub',
      featurePatientInfoDescription: 'Securely manage patient data, including medical history, prescriptions, and X-rays.',
      featureWhatsappTitle: 'WhatsApp Notifications',
      featureWhatsappDescription: 'Automated WhatsApp messages for confirmations and reminders (integration mock).',
      featureHealthRecordsTitle: 'Comprehensive Health Records',
      featureHealthRecordsDescription: 'Access and manage detailed patient profiles, including medical history, prescriptions, and lab results, all in one secure place.',
      modernCareTitle: 'Modern Care, Simplified',
      modernCarePara1: 'MediPoint is designed to enhance the patient experience and optimize clinic operations. Our platform is built with cutting-edge technology to ensure reliability, security, and ease of use for both patients and healthcare providers.',
      modernCarePara2: 'Accessible on both desktop and mobile devices, MediPoint offers a comprehensive solution for modern healthcare management.',
    },
    appointments: {
      pageTitle: 'Book Your Appointment',
      pageDescription: 'Select a clinic, doctor, date, and time slot that works for you.',
      selectDate: '3. Select Date:',
      selectTimeSlotFor: 'Select Time Slot for',
      selectTimePlaceholder: 'Select a time',
      confirmDetailsTitle: 'Confirm Your Details',
      bookingFor: 'You are booking for:',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'e.g., John Doe',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'e.g., +15551234567',
      whatsappNotifications: 'Used for WhatsApp notifications.',
      bookAppointmentButton: 'Book Appointment',
      missingInfoToastTitle: 'Missing Information',
      missingInfoToastDescription: 'Please fill in all fields and select a date/time.',
      missingInfoToastDescriptionDoctor: 'Please select clinic, doctor, date, time, and fill all patient fields.',
      bookedToastTitle: 'Appointment Booked!',
      bookedToastDescription: 'Your appointment for {date} at {time} is scheduled.',
      bookedToastDescriptionDoctor: 'Your appointment for {date} at {time} with {doctorName} at {clinicName} is scheduled.',
      loadingCalendar: 'Loading...',
      noSlotsAvailable: 'No available slots for this date/doctor.',
      defaultBookingReason: 'Online Booking',
      selectDoctorLabel: '2. Select Doctor:',
      selectDoctorPlaceholder: 'Choose a doctor',
      withDoctorLabel: 'with',
      unknownDoctor: 'Selected Doctor',
      bookingFailedToastTitle: 'Booking Failed',
      bookingFailedToastDescription: 'Could not book the appointment. Please try again.',
      selectClinicLabel: '1. Select Clinic:',
      selectClinicPlaceholder: 'Choose a clinic',
      atClinicLabel: "at",
      noDoctorsAvailable: "No doctors available in this clinic",
      promptSelectClinic: "Please select a clinic to see available doctors and times.",
      promptSelectDoctor: "Please select a doctor to see their availability."
    },
    smartScheduler: {
      pageTitle: 'Smart Scheduling Assistant',
      pageDescription: 'Let our AI recommend the best appointment time based on patient preferences and doctor availability.',
      errorTitle: 'Error',
      errorMessage: 'Failed to get suggestion. Please try again.',
      suggestionTitle: 'Suggested Appointment Time',
      bestTimeLabel: 'Best Time:',
      reasoningLabel: 'Reasoning:',
    },
    schedulerForm: {
      patientPrefsLabel: 'Patient Schedule Preferences',
      patientPrefsPlaceholder: "e.g., 'Prefers weekday afternoons', 'Available Mondays and Wednesdays after 2 PM', 'Not available on Fridays'",
      doctorAvailLabel: 'Doctor Availability',
      doctorAvailPlaceholder: "e.g., 'Monday 9 AM - 12 PM, 2 PM - 5 PM', 'Tuesday 10 AM - 3 PM', 'Not available this Wednesday'",
      getSuggestionButton: 'Get Suggestion',
    },
    admin: {
      pageTitle: 'Appointment Admin Panel',
      pageDescription: 'View, edit, and manage all scheduled appointments.',
      addAppointmentButton: 'Add Appointment',
      patientNameHeader: 'Patient Name',
      dateTimeHeader: 'Date & Time',
      durationHeader: 'Duration',
      reasonHeader: 'Reason',
      statusHeader: 'Status',
      actionsHeader: 'Actions',
      noAppointmentsFound: 'No appointments found.',
      dialogEditTitle: 'Edit Appointment',
      dialogAddTitle: 'Add New Appointment',
      dialogEditDescription: 'Modify the details below.',
      dialogAddDescription: 'Fill in the details for the new appointment.',
      patientLabel: 'Patient',
      patientSelectPlaceholder: 'Select patient',
      dateTimeLabel: 'Date & Time',
      durationLabel: 'Duration (min)',
      reasonLabel: 'Reason',
      statusLabel: 'Status',
      statusSelectPlaceholder: 'Select status',
      cancelButton: 'Cancel',
      saveButton: 'Save Changes',
      appointmentDeletedToastTitle: 'Appointment Deleted',
      appointmentDeletedToastDescription: 'Appointment ID {id} has been removed.',
      appointmentUpdatedToastTitle: 'Appointment Updated',
      appointmentUpdatedToastDescription: 'Appointment for {name} updated.',
      appointmentAddedToastTitle: 'Appointment Added',
      appointmentAddedToastDescription: 'New appointment for {name} scheduled.',
      loadingAdminPanel: 'Loading admin panel...',
      statusScheduled: 'Scheduled',
      statusConfirmed: 'Confirmed',
      statusCancelled: 'Cancelled',
      statusCompleted: 'Completed',
      statusPlaceholder: 'Unknown Status',
      doctorHeader: 'Doctor',
      doctorLabel: 'Doctor',
      clinicLabel: 'Clinic',
      noDoctorAssigned: 'No specific doctor',
      errorToastTitle: 'Error',
      errorDeletingAppointment: 'Failed to delete appointment.',
      errorPatientNotSelected: 'Please select a patient.',
      errorUpdatingAppointment: 'Failed to update appointment.',
      errorAddingAppointment: 'Failed to add appointment.',
    },
    patientDetail: {
      patientNotFoundTitle: 'Patient not found',
      patientNotFoundDescription: 'The patient ID you provided does not exist.',
      goToAdminButton: 'Go to Admin Panel',
      backToPatientListButton: 'Back to List',
      patientIdLabel: 'Patient ID:',
      editProfileButton: 'Edit Profile',
      dateOfBirthLabel: 'Date of Birth',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      addressLabel: 'Address',
      medicalHistoryLabel: 'Medical History',
      prescriptionsTitle: 'Prescriptions',
      prescriptionsDosage: 'Dosage:',
      prescriptionsInstructions: 'Instructions:',
      prescriptionsIssued: 'Issued:',
      prescriptionsByDoctor: 'by Dr. ID:',
      noPrescriptionsFound: 'No prescriptions found for this patient.',
      noPrescriptionsSharedWithPharmacy: "No prescriptions have been shared with the pharmacy for this patient.",
      noPrescriptionsSharedWithPharmacyMessage: "There are prescriptions for this patient, but none are currently shared with the pharmacy.",
      xraysTitle: 'X-Rays & Imaging',
      xraysTaken: 'Taken:',
      xraysNotes: 'Notes:',
      noXRaysFound: 'No X-rays or imaging found for this patient.',
      noXRaysSharedWithLaboratory: "No X-rays/imaging have been shared with the laboratory for this patient.",
      noXRaysSharedWithLaboratoryMessage: "There are X-rays/imaging for this patient, but none are currently shared with the laboratory.",
      addNewPrescriptionButton: 'Add New Prescription',
      editPrescriptionButton: 'Edit',
      addNewXRayButton: 'Add New X-Ray/Scan',
      featurePlaceholderToastTitle: 'Feature Under Development',
      featurePlaceholderToastDescription: 'Adding/editing {itemType} will be available in a future update.',
      shareWithPharmacyLabel: 'Share with Pharmacy',
      shareWithLaboratoryLabel: 'Share with Laboratory',
      sharingStatusUpdatedTitle: 'Sharing Status Updated',
      sharingStatusUpdatedDescription: '{itemType} is now {action} {entity}.',
      sharedAction: 'shared with',
      unsharedAction: 'no longer shared with',
      pharmacyEntity: 'Pharmacy',
      laboratoryEntity: 'Laboratory',
      currentlySharedWithPharmacy: "Currently shared with Pharmacy",
      currentlySharedWithLaboratory: "Currently shared with Laboratory",
      loadingPatientData: 'Loading patient data...',
      notApplicable: 'N/A',
      viewImageTooltip: "View full image",

      editProfileDialogTitle: "Edit Patient Profile",
      editProfileDialogDescription: "Update the patient's information below.",
      formLabelName: "Name",
      formLabelDob: "Date of Birth",
      formLabelPhone: "Phone",
      formLabelEmail: "Email",
      formLabelAddress: "Address",
      formLabelMedicalHistory: "Medical History",
      dialogSaveButton: "Save Changes",
      dialogCancelButton: "Cancel",
      profileUpdatedSuccessTitle: "Profile Updated",
      profileUpdatedSuccessDescription: "Patient profile has been successfully updated.",
      profileUpdatedErrorTitle: "Update Failed",
      profileUpdatedErrorDescription: "Could not update patient profile.",

      prescriptionDialogTitle: "Add New Prescription",
      prescriptionDialogDescription: "Fill in the details for the new prescription.",
      prescriptionFormMedication: "Medication",
      prescriptionFormMedicationPlaceholder: "e.g., Amoxicillin 500mg",
      prescriptionFormDosage: "Dosage",
      prescriptionFormDosagePlaceholder: "e.g., 1 tablet twice a day",
      prescriptionFormInstructions: "Instructions",
      prescriptionFormInstructionsPlaceholder: "e.g., Take with food for 7 days",
      prescriptionFormDateIssued: "Date Issued",
      prescriptionDialogErrorTitle: "Error Adding Prescription",
      prescriptionDialogErrorDescription: "Please fill all required fields correctly.",
      prescriptionAddedSuccessTitle: "Prescription Added",
      prescriptionAddedSuccessDescription: "The new prescription has been successfully added.",

      xrayDialogTitle: "Add New X-Ray/Scan",
      xrayDialogDescription: "Fill in the details and upload the X-Ray image.",
      xrayDialogDescriptionLabel: "Description",
      xrayDialogDescriptionPlaceholder: "e.g., Chest X-Ray, PA View",
      xrayDialogDateTakenLabel: "Date Taken",
      xrayDialogImageUploadLabel: "Upload Image",
      xrayDialogNotesLabel: "Notes (Optional)",
      xrayDialogNotesPlaceholder: "Any relevant notes...",
      xrayDialogErrorTitle: "Error Adding X-Ray",
      xrayDialogErrorDescription: "Please fill all required fields and select an image.",
      xrayAddedSuccessTitle: "X-Ray Added",
      xrayAddedSuccessDescription: "The new X-Ray has been successfully added to the patient's record.",
    },
    patientDashboard: {
      pageTitle: 'Patient Dashboard',
      pageDescription: 'Manage your appointments and view your details.',
      myAppointmentsTitle: "My Appointments",
      myAppointmentsDescription: "View your upcoming and past appointments.",
      myProfileTitle: "My Profile",
      myProfileDescription: "View and update your personal information.",
    },
    staffDashboard: {
      pageTitle: 'Staff Dashboard',
      pageDescription: 'Manage clinic operations, appointments, and patient data.',
      adminPanelTitle: "Admin Panel",
      adminPanelDescription: "Manage appointments and clinic settings.",
      patientManagementTitle: "Patient Management",
      patientManagementDescription: "Access and manage patient records.",
      shareCenterTitle: "Share Center",
      shareCenterDescription: "Share patient data with labs/pharmacies.",
    },
    doctorDashboard: {
      pageTitle: 'Doctor Dashboard',
      pageDescription: 'Manage your appointments, patient records, and clinic tasks.',
      manageAppointmentsTitle: 'Manage Appointments',
      manageAppointmentsDescription: 'View and update appointment schedules.',
      patientRecordsTitle: 'Patient Records',
      patientRecordsDescription: 'Access and manage patient information.',
      appointmentCalendarTitle: "Appointment Calendar",
      appointmentsForDateLabel: "Appointments for {date}",
      noAppointmentsForDay: "No appointments scheduled for this day.",
      patientLabel: "Patient",
      reasonLabel: "Reason",
      viewPatientButton: "View Patient",
      loadingDashboard: "Loading dashboard..."
    },
    doctorPatientManagement: {
      pageTitle: 'Patient Management',
      pageDescription: 'View and manage all patient records.',
      loadingPage: 'Loading page...',
      tableHeaderName: 'Name',
      tableHeaderDob: 'Date of Birth',
      tableHeaderPhone: 'Phone',
      tableHeaderActions: 'Actions',
      viewRecordButton: 'View Record',
      noPatientsFound: 'No patients found.',
    },
    pharmacistDashboard: {
      pageTitle: 'Pharmacist Dashboard',
      pageDescription: 'Access patient records to view shared prescriptions.',
      loadingDashboard: 'Loading dashboard...',
      viewPatientRecordsTitle: "View Patient Records",
      viewPatientRecordsDescription: "Browse patient list to see shared prescriptions.",
      actionsLabel: "Actions",
      addNoteForDoctorButton: "Add Note for Doctor (Mock)",
      toastFeaturePlannedTitle: "Feature Planned",
      toastAddNoteForDoctorDescription: "Functionality to add a note for the doctor will be implemented in a future update.",
    },
    pharmacistPatientList: {
      pageTitle: 'Patient List (Pharmacy)',
      pageDescription: 'Select a patient to view their prescriptions shared with the pharmacy.',
      loadingPage: 'Loading page...',
      tableHeaderName: 'Name',
      tableHeaderDob: 'Date of Birth',
      tableHeaderPhone: 'Phone',
      tableHeaderActions: 'Actions',
      viewRecordButton: 'View Shared Prescriptions',
      noPatientsFound: 'No patients found in the system.',
    },
    laboratoryDashboard: {
      pageTitle: 'Laboratory Dashboard',
      pageDescription: 'Access patient records to view shared X-Rays and imaging results.',
      loadingDashboard: 'Loading dashboard...',
      viewPatientRecordsTitle: "View Patient Records",
      viewPatientRecordsDescription: "Browse patient list to see shared X-Rays and imaging.",
      actionsLabel: "Actions",
      addReportForDoctorButton: "Add Report/Note for Doctor (Mock)",
      toastFeaturePlannedTitle: "Feature Planned",
      toastAddReportForDoctorDescription: "Functionality to add a report or note for the doctor will be implemented in a future update.",
    },
    laboratoryPatientList: {
      pageTitle: 'Patient List (Laboratory)',
      pageDescription: 'Select a patient to view their X-Rays/imaging shared with the laboratory.',
      loadingPage: 'Loading page...',
      tableHeaderName: 'Name',
      tableHeaderDob: 'Date of Birth',
      tableHeaderPhone: 'Phone',
      tableHeaderActions: 'Actions',
      viewRecordButton: 'View Shared Imaging',
      noPatientsFound: 'No patients found in the system.',
    },
    adminDashboard: {
      pageTitle: 'System Administration',
      pageDescription: 'Manage system users, settings, and monitor data analysis.',
      userManagementTitle: 'User Management',
      userManagementDescription: 'Add, edit, and assign roles to system users.',
      systemSettingsTitle: 'System Settings',
      systemSettingsDescription: 'Configure core application parameters and integrations.',
      dataAnalysisTitle: 'Data Analysis',
      dataAnalysisDescription: 'Monitor key metrics and clinic performance.',
      accessDeniedTitle: 'Access Denied',
      accessDeniedDescription: 'You do not have permission to view this page.',
    },
    adminUserManagement: {
      pageTitle: 'User Management',
      pageDescription: 'Manage system users (doctors, pharmacists, labs, etc.).',
      loadingPage: 'Loading page...',
      addUserButton: 'Add New User',
      tableHeaderId: 'User ID',
      tableHeaderName: 'Name',
      tableHeaderRole: 'Role',
      tableHeaderAccessCode: 'Access Code',
      tableHeaderActions: 'Actions',
      noUsersFound: 'No system users found.',
      dialogAddUserTitle: 'Add New User',
      dialogAddUserDescription: 'Enter the details for the new system user.',
      dialogEditUserTitle: 'Edit User',
      dialogEditUserDescription: 'Modify the user details below.',
      formLabelName: 'Name',
      formPlaceholderName: 'Enter user full name',
      formLabelRole: 'Role',
      formPlaceholderRole: 'Select user role',
      formLabelAccessCode: 'Access Code',
      formPlaceholderAccessCode: 'Enter access code (like a username)',
      formLabelAccessPassword: 'Password',
      formPlaceholderAccessPassword: 'Enter a secure password',
      formPlaceholderEditPassword: "Leave blank to keep current",
      dialogCancelButton: 'Cancel',
      dialogAddButton: 'Add User',
      dialogSaveButton: 'Save Changes',
      toastUserAddedTitle: 'User Added',
      toastUserAddedDescription: 'User {name} has been successfully added.',
      toastUserUpdatedTitle: "User Updated",
      toastUserUpdatedDescription: "User {name} has been successfully updated.",
      toastEditUserErrorTitle: "Update Failed",
      toastEditUserErrorDescription: "Failed to update user.",
      toastMissingFieldsTitle: 'Missing Fields',
      toastMissingFieldsDescription: 'Please provide both name and role for the user.',
      toastMissingFieldsWithAccessCodeDescription: 'Name, role, and access code (for staff/admin) are required.',
      toastMissingFieldsFullDescription: 'All fields including Access Code and Password are required for new users.',
      toastEditUserPlaceholderTitle: 'Edit User (Placeholder)',
      toastEditUserPlaceholderDescription: 'Editing for {name} is not fully implemented yet.',
      toastUserDeletedTitle: 'User Deleted',
      toastUserDeletedDescription: 'User {name} has been removed.',
      confirmDeleteUser: 'Are you sure you want to delete user {name}?',
      roleNotApplicable: 'N/A',
      roleDoctor: 'Doctor',
      rolePharmacist: 'Pharmacist',
      roleLaboratory: 'Laboratory',
      roleAdmin: 'Administrator',
      tableHeaderClinic: 'Assigned Clinic',
      formLabelClinic: 'Clinic',
      formPlaceholderClinic: 'Select clinic',
      noClinicAssigned: 'N/A (e.g. Super Admin)',
      toastMissingClinicDescription: 'Please assign a clinic to this user role.',
    },
    adminSystemSettings: {
      pageTitle: 'System Settings',
      pageDescription: 'Configure overall application settings and integrations.',
      loadingPage: 'Loading page...',
      generalSettingsTitle: 'General Settings',
      clinicNameLabel: 'Clinic Name',
      clinicNamePlaceholder: 'Enter clinic name',
      adminEmailLabel: 'Admin Contact Email',
      adminEmailPlaceholder: 'Enter admin contact email',
      appointmentSettingsTitle: 'Appointment Settings',
      defaultDurationLabel: 'Default Appointment Duration (minutes)',
      notificationSettingsTitle: 'Notification Settings',
      enableWhatsappLabel: 'Enable WhatsApp Notifications (Mock)',
      whatsappHint: 'WhatsApp integration is currently mocked.',
      saveSettingsButton: 'Save Settings',
      toastSettingsSavedTitle: 'Settings Saved',
      toastSettingsSavedDescription: 'System settings have been (mock) saved.',
    },
     adminDataAnalysis: {
      pageTitle: 'Data Analysis & Reporting',
      pageDescription: 'View key metrics, generate reports, and gain insights into clinic operations.',
      loadingPage: 'Loading...',
      appointmentVolumeTitle: "Appointment Volume",
      patientDemographicsTitle: "Patient Demographics",
      patientDemographicsDescription: "Breakdown of patients by clinic.", 
      patientDemographicsDetailDesc: "This section provides insights into patient age distribution, gender ratios, and geographic concentrations.", 
      peakBookingTimesTitle: "Peak Booking Times",
      peakBookingTimesDescription: "Analysis of busiest hours for bookings.", 
      peakBookingTimesDetailDesc: "This section shows charts identifying the most popular booking slots and trends over time.", 
      servicePopularityTitle: "Service Popularity",
      servicePopularityDescription: "Most common reasons for appointments.", 
      servicePopularityDetailDesc: "This will include a breakdown of appointment reasons and frequency of different service types.", 
      userActivityLogsTitle: "User Activity Logs",
      userActivityLogsDescription: "Overview of system access and key actions.", 
      userActivityLogsDetailDesc: "User activity logs are typically sourced from a backend system and would display key actions and access patterns here. This feature is for future integration.", 
      revenueAnalyticsTitle: "Revenue Analytics", 
      revenueAnalyticsDescription: "Insights into financial performance, service revenue, etc. This feature is planned for future integration with financial data systems.", 
      loadingChartData: "Loading chart data...",
      loadingPatientData: "Loading patient data...",
      loadingAppointmentData: "Loading appointment data...",
      loadingServiceData: "Loading service data...",
      noAppointmentDataForChart: "No appointment data available for the chart.",
      noPatientDataForChart: "No patient data available for demographics chart.",
      noServiceData: "No service/reason data available.",
      viewDetailsButton: "View Details", 
      dialogCloseButton: "Close", 
    },
  },
  ar: {
    login: {
      loginTitle: 'الوصول إلى حسابك',
      loginDescription: 'اختر طريقة تسجيل الدخول الخاصة بك.',
      patientLoginTab: 'دخول المريض',
      staffLoginTab: 'موظف/شريك',
      registerTab: 'تسجيل جديد',
      phoneNumberLabel: 'رقم الهاتف (اسم المستخدم)',
      phoneNumberPlaceholder: 'أدخل رقم هاتفك',
      patientPasswordLabel: 'كلمة المرور',
      patientPasswordPlaceholder: 'أدخل كلمة المرور الخاصة بك',
      patientLoginButton: 'تسجيل الدخول',
      patientLoginHint: "تلميح: للمستخدمين التجريبيين، استخدم هاتفًا مثل '+15551234567' مع كلمة المرور 'password123'.",
      sendOtpButton: 'إرسال رمز التحقق',
      otpLabel: 'كلمة المرور لمرة واحدة (OTP)',
      otpPlaceholder: 'أدخل رمز التحقق المستلم',
      verifyOtpButton: 'تحقق من الرمز وسجل الدخول',
      accessCodeLabel: 'رمز الوصول',
      accessCodePlaceholder: 'أدخل رمز الوصول الخاص بك',
      accessPasswordLabel: 'كلمة المرور',
      accessPasswordPlaceholder: 'أدخل كلمة المرور الخاصة بك',
      accessCodeHint: "تلميح: استخدم رموزًا مثل DOCTOR123 مع كلمة المرور 'password123' أو ADMIN123 مع 'adminpass'.",
      loginWithCodeButton: 'تسجيل الدخول بالرمز',
      switchToEnglish: 'English',
      switchToArabic: 'العربية',
      languageSwitcherLabel: 'تغيير اللغة:',
      loginSuccessTitle: 'تم تسجيل الدخول بنجاح',
      loginSuccessDescriptionPatient: 'جارٍ إعادة توجيهك إلى لوحة التحكم الخاصة بك...',
      loginSuccessDescriptionStaff: 'جارٍ إعادة توجيهك إلى لوحة تحكم الموظفين...',
      loginSuccessDescriptionDoctor: 'جارٍ إعادة توجيهك إلى لوحة تحكم الطبيب...',
      loginSuccessDescriptionPharmacist: 'جارٍ إعادة توجيهك إلى لوحة تحكم الصيدلي...',
      loginSuccessDescriptionLaboratory: 'جارٍ إعادة توجيهك إلى لوحة تحكم المختبر...',
      loginSuccessDescriptionAdmin: 'جارٍ إعادة توجيهك إلى لوحة تحكم المسؤول...',
      otpSentTitle: 'تم إرسال رمز التحقق',
      otpSentDescription: 'تم إرسال رمز التحقق إلى هاتفك (تجريبي).',
      missingPhoneNumberTitle: 'رقم الهاتف مفقود',
      missingPhoneNumberDescription: 'الرجاء إدخال رقم هاتفك لاستلام رمز التحقق.',
      missingPhoneOrPasswordTitle: 'معلومات ناقصة',
      missingPhoneOrPasswordDescription: 'الرجاء إدخال رقم الهاتف وكلمة المرور.',
      invalidPhoneOrPasswordTitle: 'فشل تسجيل الدخول',
      invalidPhoneOrPasswordDescription: 'رقم الهاتف أو كلمة المرور غير صالحة.',
      missingOtpTitle: 'رمز التحقق مفقود',
      missingOtpDescription: 'الرجاء إدخال رمز التحقق.',
      missingAccessCodeTitle: 'رمز الوصول مفقود',
      missingAccessCodeDescription: 'الرجاء إدخال رمز الوصول الخاص بك.',
      missingAccessCodeOrPasswordTitle: 'البيانات ناقصة',
      missingAccessCodeOrPasswordDescription: 'الرجاء إدخال رمز الوصول وكلمة المرور.',
      invalidAccessCodeTitle: 'رمز الوصول غير صالح',
      invalidAccessCodeDescription: 'رمز الوصول الذي أدخلته غير صحيح.',
      invalidCredentialsTitle: 'بيانات الاعتماد غير صالحة',
      invalidCredentialsDescription: 'رمز الوصول أو كلمة المرور غير صحيحة.',
      changeNumberOrResend: 'تغيير رقم الهاتف أو إعادة إرسال الرمز',
      defaultPatientNameOtp: 'مريض',
      
      fullNameLabelReg: 'الاسم الكامل',
      fullNamePlaceholderReg: 'أدخل اسمك الكامل',
      phoneNumberLabelReg: 'رقم الهاتف',
      phoneNumberPlaceholderReg: 'أدخل رقم هاتفك',
      passwordLabelReg: 'كلمة المرور',
      passwordPlaceholderReg: 'اختر كلمة مرور قوية (6 أحرف على الأقل)',
      confirmPasswordLabelReg: 'تأكيد كلمة المرور',
      confirmPasswordPlaceholderReg: 'أعد إدخال كلمة المرور',
      registerButton: 'تسجيل',
      registrationSuccessTitle: 'تم التسجيل بنجاح!',
      registrationSuccessDescription: 'تم إنشاء حسابك. جارٍ إعادة توجيهك إلى لوحة التحكم...',
      registrationErrorTitle: 'فشل التسجيل',
      registrationErrorDescription: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      passwordsDoNotMatchTitle: 'كلمتا المرور غير متطابقتين',
      passwordsDoNotMatchDescription: 'يرجى التأكد من تطابق كلمتي المرور.',
      phoneNumberExistsTitle: 'رقم الهاتف مسجل بالفعل',
      phoneNumberExistsDescription: 'هذا الرقم مرتبط بالفعل بحساب. يرجى تسجيل الدخول أو استخدام رقم آخر.',
      missingRegistrationFieldsTitle: 'معلومات ناقصة',
      missingRegistrationFieldsDescription: 'يرجى ملء جميع الحقول للتسجيل.',
    },
    header: {
      appointments: 'المواعيد',
      smartScheduler: 'الجدولة الذكية',
      adminPanel: 'إدارة المواعيد',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      openMenu: 'فتح القائمة',
      patientDashboard: 'لوحة التحكم',
      doctorDashboard: 'لوحة تحكم الطبيب',
      pharmacistDashboard: 'أدوات الصيدلي',
      laboratoryDashboard: 'أدوات المختبر',
      adminManagementDashboard: 'لوحة تحكم المسؤول',
      patientManagement: 'سجلات المرضى',
      patientRecordsPharmacist: 'سجلات المرضى',
      patientRecordsLaboratory: 'سجلات المرضى',
    },
    home: {
      welcomeTitle: 'مرحباً بك في ميدي بوينت',
      welcomeDescription: 'تبسيط مواعيد الرعاية الصحية بتقنية ذكية وتواصل سلس.',
      // bookAppointmentButton: 'احجز موعدًا', // Removed
      // smartSchedulerButton: 'الجدولة الذكية', // Removed
      featureEasySchedulingTitle: 'سهولة حجز المواعيد',
      featureEasySchedulingDescription: 'يمكن للمرضى بسهولة عرض المواعيد المتاحة وحجزها عبر الإنترنت في دقائق.',
      featureAdminPanelTitle: 'لوحة إدارة المسؤولين',
      featureAdminPanelDescription: 'يمكن لموظفي العيادة إدارة الجداول بكفاءة وتحديث التوفر والإشراف على المواعيد.',
      featureSmartAssistantTitle: 'مساعد الجدولة الذكي',
      featureSmartAssistantDescription: 'أداة مدعومة بالذكاء الاصطناعي للتوصية بأوقات المواعيد المثلى بناءً على التفضيلات والتوفر.',
      featurePatientInfoTitle: 'مركز معلومات المرضى',
      featurePatientInfoDescription: 'إدارة بيانات المرضى بشكل آمن، بما في ذلك التاريخ الطبي والوصفات الطبية والأشعة السينية.',
      featureWhatsappTitle: 'إشعارات واتساب',
      featureWhatsappDescription: 'رسائل واتساب آلية للتأكيدات والتذكيرات (محاكاة التكامل).',
      featureHealthRecordsTitle: 'سجلات صحية شاملة',
      featureHealthRecordsDescription: 'الوصول إلى ملفات تعريف المرضى التفصيلية وإدارتها، بما في ذلك التاريخ الطبي والوصفات الطبية ونتائج المختبر، كل ذلك في مكان واحد آمن.',
      modernCareTitle: 'رعاية حديثة، مبسطة',
      modernCarePara1: 'تم تصميم ميدي بوينت لتعزيز تجربة المريض وتحسين عمليات العيادة. تم بناء منصتنا بأحدث التقنيات لضمان الموثوقية والأمان وسهولة الاستخدام لكل من المرضى ومقدمي الرعاية الصحية.',
      modernCarePara2: 'يمكن الوصول إلى ميدي بوينت على كل من أجهزة سطح المكتب والأجهزة المحمولة، ويوفر حلاً شاملاً لإدارة الرعاية الصحية الحديثة.',
    },
    appointments: {
      pageTitle: 'احجز موعدك',
      pageDescription: 'اختر عيادة وطبيبًا وتاريخًا ووقتًا يناسبك.',
      selectDate: '٣. اختر التاريخ:',
      selectTimeSlotFor: 'اختر الفترة الزمنية لـ',
      selectTimePlaceholder: 'اختر وقتًا',
      confirmDetailsTitle: 'أكد تفاصيلك',
      bookingFor: 'أنت تحجز لـ:',
      fullNameLabel: 'الاسم الكامل',
      fullNamePlaceholder: 'مثال: جون دو',
      phoneLabel: 'رقم الهاتف',
      phonePlaceholder: 'مثال: +15551234567',
      whatsappNotifications: 'يستخدم لإشعارات الواتساب.',
      bookAppointmentButton: 'احجز الموعد',
      missingInfoToastTitle: 'معلومات ناقصة',
      missingInfoToastDescription: 'يرجى ملء جميع الحقول واختيار تاريخ/وقت.',
      missingInfoToastDescriptionDoctor: 'يرجى اختيار العيادة والطبيب والتاريخ والوقت وملء جميع بيانات المريض.',
      bookedToastTitle: 'تم حجز الموعد!',
      bookedToastDescription: 'تم تحديد موعدك بتاريخ {date} في الساعة {time}.',
      bookedToastDescriptionDoctor: 'تم تحديد موعدك بتاريخ {date} في الساعة {time} مع {doctorName} في {clinicName}.',
      loadingCalendar: 'جاري التحميل...',
      noSlotsAvailable: 'لا توجد مواعيد متاحة في هذا التاريخ/لهذا الطبيب.',
      defaultBookingReason: 'حجز عبر الإنترنت',
      selectDoctorLabel: '٢. اختر الطبيب:',
      selectDoctorPlaceholder: 'اختر طبيبًا',
      withDoctorLabel: 'مع',
      unknownDoctor: 'الطبيب المختار',
      bookingFailedToastTitle: 'فشل الحجز',
      bookingFailedToastDescription: 'تعذر حجز الموعد. يرجى المحاولة مرة أخرى.',
      selectClinicLabel: '١. اختر العيادة:',
      selectClinicPlaceholder: 'اختر عيادة',
      atClinicLabel: "في",
      noDoctorsAvailable: "لا يوجد أطباء متاحون في هذه العيادة",
      promptSelectClinic: "يرجى اختيار عيادة لعرض الأطباء والأوقات المتاحة.",
      promptSelectDoctor: "يرجى اختيار طبيب لعرض جدول مواعيده."
    },
    smartScheduler: {
      pageTitle: 'مساعد الجدولة الذكي',
      pageDescription: 'دع الذكاء الاصطناعي يوصي بأفضل وقت للموعد بناءً على تفضيلات المريض وتوفر الطبيب.',
      errorTitle: 'خطأ',
      errorMessage: 'فشل في الحصول على اقتراح. حاول مرة اخرى.',
      suggestionTitle: 'وقت الموعد المقترح',
      bestTimeLabel: 'أفضل وقت:',
      reasoningLabel: 'السبب:',
    },
    schedulerForm: {
      patientPrefsLabel: 'تفضيلات جدول المريض',
      patientPrefsPlaceholder: "مثال: 'يفضل فترات بعد الظهر في أيام الأسبوع'، 'متاح يومي الاثنين والأربعاء بعد الساعة 2 ظهرًا'، 'غير متاح يوم الجمعة'",
      doctorAvailLabel: 'توفر الطبيب',
      doctorAvailPlaceholder: "مثال: 'الاثنين 9 صباحًا - 12 ظهرًا، 2 ظهرًا - 5 مساءً'، 'الثلاثاء 10 صباحًا - 3 عصرًا'، 'غير متاح هذا الأربعاء'",
      getSuggestionButton: 'احصل على اقتراح',
    },
    admin: {
      pageTitle: 'لوحة إدارة المواعيد',
      pageDescription: 'عرض وتعديل وإدارة جميع المواعيد المجدولة.',
      addAppointmentButton: 'إضافة موعد',
      patientNameHeader: 'اسم المريض',
      dateTimeHeader: 'التاريخ والوقت',
      durationHeader: 'المدة',
      reasonHeader: 'السبب',
      statusHeader: 'الحالة',
      actionsHeader: 'الإجراءات',
      noAppointmentsFound: 'لم يتم العثور على مواعيد.',
      dialogEditTitle: 'تعديل الموعد',
      dialogAddTitle: 'إضافة موعد جديد',
      dialogEditDescription: 'قم بتعديل التفاصيل أدناه.',
      dialogAddDescription: 'املأ تفاصيل الموعد الجديد.',
      patientLabel: 'المريض',
      patientSelectPlaceholder: 'اختر المريض',
      dateTimeLabel: 'التاريخ والوقت',
      durationLabel: 'المدة (دقائق)',
      reasonLabel: 'السبب',
      statusLabel: 'الحالة',
      statusSelectPlaceholder: 'اختر الحالة',
      cancelButton: 'إلغاء',
      saveButton: 'حفظ التغييرات',
      appointmentDeletedToastTitle: 'تم حذف الموعد',
      appointmentDeletedToastDescription: 'تمت إزالة الموعد رقم {id}.',
      appointmentUpdatedToastTitle: 'تم تحديث الموعد',
      appointmentUpdatedToastDescription: 'تم تحديث موعد {name}.',
      appointmentAddedToastTitle: 'تمت إضافة الموعد',
      appointmentAddedToastDescription: 'تم تحديد موعد جديد لـ {name}.',
      loadingAdminPanel: 'جاري تحميل لوحة الإدارة...',
      statusScheduled: 'مجدول',
      statusConfirmed: 'مؤكد',
      statusCancelled: 'ملغى',
      statusCompleted: 'مكتمل',
      statusPlaceholder: 'حالة غير معروفة',
      doctorHeader: 'الطبيب',
      doctorLabel: 'الطبيب',
      clinicLabel: 'العيادة',
      noDoctorAssigned: 'لا يوجد طبيب محدد',
      errorToastTitle: 'خطأ',
      errorDeletingAppointment: 'فشل حذف الموعد.',
      errorPatientNotSelected: 'الرجاء اختيار مريض.',
      errorUpdatingAppointment: 'فشل تحديث الموعد.',
      errorAddingAppointment: 'فشل إضافة الموعد.',
    },
    patientDetail: {
      patientNotFoundTitle: 'المريض غير موجود',
      patientNotFoundDescription: 'معرف المريض الذي قدمته غير موجود.',
      goToAdminButton: 'اذهب إلى لوحة الإدارة',
      backToPatientListButton: 'العودة إلى القائمة',
      patientIdLabel: 'معرف المريض:',
      editProfileButton: 'تعديل الملف الشخصي',
      dateOfBirthLabel: 'تاريخ الميلاد',
      phoneLabel: 'الهاتف',
      emailLabel: 'البريد الإلكتروني',
      addressLabel: 'العنوان',
      medicalHistoryLabel: 'التاريخ الطبي',
      prescriptionsTitle: 'الوصفات الطبية',
      prescriptionsDosage: 'الجرعة:',
      prescriptionsInstructions: 'التعليمات:',
      prescriptionsIssued: 'صادرة بتاريخ:',
      prescriptionsByDoctor: 'بواسطة الطبيب رقم:',
      noPrescriptionsFound: 'لم يتم العثور على وصفات طبية لهذا المريض.',
      noPrescriptionsSharedWithPharmacy: "لم تتم مشاركة أي وصفات طبية مع الصيدلية لهذا المريض.",
      noPrescriptionsSharedWithPharmacyMessage: "توجد وصفات طبية لهذا المريض، ولكن لم يتم مشاركة أي منها حاليًا مع الصيدلية.",
      xraysTitle: 'الأشعة السينية والتصوير',
      xraysTaken: 'تم التقاطها بتاريخ:',
      xraysNotes: 'ملاحظات:',
      noXRaysFound: 'لم يتم العثور على أشعة سينية أو صور لهذا المريض.',
      noXRaysSharedWithLaboratory: "لم تتم مشاركة أي أشعة/صور مع المختبر لهذا المريض.",
      noXRaysSharedWithLaboratoryMessage: "توجد أشعة/صور لهذا المريض، ولكن لم يتم مشاركة أي منها حاليًا مع المختبر.",
      addNewPrescriptionButton: 'إضافة وصفة جديدة',
      editPrescriptionButton: 'تعديل',
      addNewXRayButton: 'إضافة أشعة/مسح جديد',
      featurePlaceholderToastTitle: 'الميزة قيد التطوير',
      featurePlaceholderToastDescription: 'إضافة/تعديل {itemType} سيكون متاحًا في تحديث مستقبلي.',
      shareWithPharmacyLabel: 'مشاركة مع الصيدلية',
      shareWithLaboratoryLabel: 'مشاركة مع المختبر',
      sharingStatusUpdatedTitle: 'تم تحديث حالة المشاركة',
      sharingStatusUpdatedDescription: '{itemType} الآن {action} {entity}.',
      sharedAction: 'مشتركة مع',
      unsharedAction: 'لم تعد مشتركة مع',
      pharmacyEntity: 'الصيدلية',
      laboratoryEntity: 'المختبر',
      currentlySharedWithPharmacy: "مشتركة حاليًا مع الصيدلية",
      currentlySharedWithLaboratory: "مشتركة حاليًا مع المختبر",
      loadingPatientData: 'جاري تحميل بيانات المريض...',
      notApplicable: 'غير متوفر',
      viewImageTooltip: "عرض الصورة كاملة",

      editProfileDialogTitle: "تعديل ملف المريض",
      editProfileDialogDescription: "قم بتحديث معلومات المريض أدناه.",
      formLabelName: "الاسم",
      formLabelDob: "تاريخ الميلاد",
      formLabelPhone: "الهاتف",
      formLabelEmail: "البريد الإلكتروني",
      formLabelAddress: "العنوان",
      formLabelMedicalHistory: "التاريخ الطبي",
      dialogSaveButton: "حفظ التغييرات",
      dialogCancelButton: "إلغاء",
      profileUpdatedSuccessTitle: "تم تحديث الملف الشخصي",
      profileUpdatedSuccessDescription: "تم تحديث ملف المريض بنجاح.",
      profileUpdatedErrorTitle: "فشل التحديث",
      profileUpdatedErrorDescription: "تعذر تحديث ملف المريض.",

      prescriptionDialogTitle: "إضافة وصفة طبية جديدة",
      prescriptionDialogDescription: "املأ تفاصيل الوصفة الطبية الجديدة.",
      prescriptionFormMedication: "الدواء",
      prescriptionFormMedicationPlaceholder: "مثال: أموكسيسيلين 500 مجم",
      prescriptionFormDosage: "الجرعة",
      prescriptionFormDosagePlaceholder: "مثال: قرص واحد مرتين يوميًا",
      prescriptionFormInstructions: "التعليمات",
      prescriptionFormInstructionsPlaceholder: "مثال: يؤخذ مع الطعام لمدة 7 أيام",
      prescriptionFormDateIssued: "تاريخ الإصدار",
      prescriptionDialogErrorTitle: "خطأ في إضافة الوصفة",
      prescriptionDialogErrorDescription: "يرجى ملء جميع الحقول المطلوبة بشكل صحيح.",
      prescriptionAddedSuccessTitle: "تمت إضافة الوصفة",
      prescriptionAddedSuccessDescription: "تمت إضافة الوصفة الطبية الجديدة بنجاح.",

      xrayDialogTitle: "إضافة أشعة/مسح جديد",
      xrayDialogDescription: "املأ التفاصيل وقم بتحميل صورة الأشعة.",
      xrayDialogDescriptionLabel: "الوصف",
      xrayDialogDescriptionPlaceholder: "مثال: أشعة الصدر، منظر أمامي جانبي",
      xrayDialogDateTakenLabel: "تاريخ الالتقاط",
      xrayDialogImageUploadLabel: "تحميل الصورة",
      xrayDialogNotesLabel: "ملاحظات (اختياري)",
      xrayDialogNotesPlaceholder: "أي ملاحظات ذات صلة...",
      xrayDialogErrorTitle: "خطأ في إضافة الأشعة",
      xrayDialogErrorDescription: "يرجى ملء جميع الحقول المطلوبة واختيار صورة.",
      xrayAddedSuccessTitle: "تمت إضافة الأشعة",
      xrayAddedSuccessDescription: "تمت إضافة الأشعة الجديدة بنجاح إلى سجل المريض.",
    },
    patientDashboard: {
      pageTitle: 'لوحة تحكم المريض',
      pageDescription: 'إدارة مواعيدك وعرض تفاصيلك.',
      myAppointmentsTitle: "مواعيـدي",
      myAppointmentsDescription: "عرض مواعيدك القادمة والسابقة.",
      myProfileTitle: "ملفي الشخصي",
      myProfileDescription: "عرض وتحديث معلوماتك الشخصية.",
    },
    staffDashboard: {
      pageTitle: 'لوحة تحكم الموظفين',
      pageDescription: 'إدارة عمليات العيادة والمواعيد وبيانات المرضى.',
      adminPanelTitle: "لوحة الإدارة",
      adminPanelDescription: "إدارة المواعيد وإعدادات العيادة.",
      patientManagementTitle: "إدارة المرضى",
      patientManagementDescription: "الوصول إلى سجلات المرضى وإدارتها.",
      shareCenterTitle: "مركز المشاركة",
      shareCenterDescription: "مشاركة بيانات المرضى مع المختبرات/الصيدليات.",
    },
    doctorDashboard: {
      pageTitle: 'لوحة تحكم الطبيب',
      pageDescription: 'إدارة مواعيدك وسجلات المرضى ومهام العيادة.',
      manageAppointmentsTitle: 'إدارة المواعيد',
      manageAppointmentsDescription: 'عرض وتحديث جداول المواعيد.',
      patientRecordsTitle: 'سجلات المرضى',
      patientRecordsDescription: 'الوصول إلى معلومات المرضى وإدارتها.',
      appointmentCalendarTitle: "تقويم المواعيد",
      appointmentsForDateLabel: "مواعيد تاريخ {date}",
      noAppointmentsForDay: "لا توجد مواعيد مجدولة لهذا اليوم.",
      patientLabel: "المريض",
      reasonLabel: "السبب",
      viewPatientButton: "عرض المريض",
      loadingDashboard: "جاري تحميل لوحة التحكم..."
    },
    doctorPatientManagement: {
      pageTitle: 'إدارة المرضى',
      pageDescription: 'عرض وإدارة جميع سجلات المرضى.',
      loadingPage: 'جاري تحميل الصفحة...',
      tableHeaderName: 'الاسم',
      tableHeaderDob: 'تاريخ الميلاد',
      tableHeaderPhone: 'الهاتف',
      tableHeaderActions: 'الإجراءات',
      viewRecordButton: 'عرض السجل',
      noPatientsFound: 'لم يتم العثور على مرضى.',
    },
    pharmacistDashboard: {
      pageTitle: 'لوحة تحكم الصيدلي',
      pageDescription: 'الوصول إلى سجلات المرضى لعرض الوصفات الطبية المشتركة.',
      loadingDashboard: 'جاري تحميل لوحة التحكم...',
      viewPatientRecordsTitle: "عرض سجلات المرضى",
      viewPatientRecordsDescription: "تصفح قائمة المرضى لرؤية الوصفات الطبية المشتركة.",
      actionsLabel: "الإجراءات",
      addNoteForDoctorButton: "إضافة ملاحظة للطبيب (تجريبي)",
      toastFeaturePlannedTitle: "ميزة مخطط لها",
      toastAddNoteForDoctorDescription: "سيتم تنفيذ وظيفة إضافة ملاحظة للطبيب في تحديث مستقبلي.",
    },
    pharmacistPatientList: {
      pageTitle: 'قائمة المرضى (صيدلية)',
      pageDescription: 'اختر مريضًا لعرض وصفاته الطبية المشتركة مع الصيدلية.',
      loadingPage: 'جاري تحميل الصفحة...',
      tableHeaderName: 'الاسم',
      tableHeaderDob: 'تاريخ الميلاد',
      tableHeaderPhone: 'الهاتف',
      tableHeaderActions: 'الإجراءات',
      viewRecordButton: 'عرض الوصفات المشتركة',
      noPatientsFound: 'لم يتم العثور على مرضى في النظام.',
    },
    laboratoryDashboard: {
      pageTitle: 'لوحة تحكم المختبر',
      pageDescription: 'الوصول إلى سجلات المرضى لعرض الأشعة ونتائج التصوير المشتركة.',
      loadingDashboard: 'جاري تحميل لوحة التحكم...',
      viewPatientRecordsTitle: "عرض سجلات المرضى",
      viewPatientRecordsDescription: "تصفح قائمة المرضى لرؤية الأشعة والتصوير المشترك.",
      actionsLabel: "الإجراءات",
      addReportForDoctorButton: "إضافة تقرير/ملاحظة للطبيب (تجريبي)",
      toastFeaturePlannedTitle: "ميزة مخطط لها",
      toastAddReportForDoctorDescription: "سيتم تنفيذ وظيفة إضافة تقرير أو ملاحظة للطبيب في تحديث مستقبلي.",
    },
    laboratoryPatientList: {
      pageTitle: 'قائمة المرضى (مختبر)',
      pageDescription: 'اختر مريضًا لعرض الأشعة/الصور المشتركة مع المختبر.',
      loadingPage: 'جاري تحميل الصفحة...',
      tableHeaderName: 'الاسم',
      tableHeaderDob: 'تاريخ الميلاد',
      tableHeaderPhone: 'الهاتف',
      tableHeaderActions: 'الإجراءات',
      viewRecordButton: 'عرض الصور المشتركة',
      noPatientsFound: 'لم يتم العثور على مرضى في النظام.',
    },
    adminDashboard: {
      pageTitle: 'إدارة النظام',
      pageDescription: 'إدارة مستخدمي النظام والإعدادات ومراقبة تحليل البيانات.',
      userManagementTitle: 'إدارة المستخدمين',
      userManagementDescription: 'إضافة وتعديل وتعيين أدوار لمستخدمي النظام.',
      systemSettingsTitle: 'إعدادات النظام',
      systemSettingsDescription: 'تكوين معلمات التطبيق الأساسية والتكاملات.',
      dataAnalysisTitle: 'تحليل البيانات',
      dataAnalysisDescription: 'مراقبة المقاييس الرئيسية وأداء العيادة.',
      accessDeniedTitle: 'الوصول مرفوض',
      accessDeniedDescription: 'ليس لديك صلاحية لعرض هذه الصفحة.',
    },
    adminUserManagement: {
      pageTitle: 'إدارة المستخدمين',
      pageDescription: 'إدارة مستخدمي النظام (الأطباء، الصيادلة، المختبرات، إلخ).',
      loadingPage: 'جاري تحميل الصفحة...',
      addUserButton: 'إضافة مستخدم جديد',
      tableHeaderId: 'معرف المستخدم',
      tableHeaderName: 'الاسم',
      tableHeaderRole: 'الدور',
      tableHeaderAccessCode: 'رمز الوصول',
      tableHeaderActions: 'الإجراءات',
      noUsersFound: 'لم يتم العثور على مستخدمي النظام.',
      dialogAddUserTitle: 'إضافة مستخدم جديد',
      dialogAddUserDescription: 'أدخل تفاصيل مستخدم النظام الجديد.',
      dialogEditUserTitle: 'تعديل المستخدم',
      dialogEditUserDescription: 'قم بتعديل تفاصيل المستخدم أدناه.',
      formLabelName: 'الاسم',
      formPlaceholderName: 'أدخل الاسم الكامل للمستخدم',
      formLabelRole: 'الدور',
      formPlaceholderRole: 'اختر دور المستخدم',
      formLabelAccessCode: 'رمز الوصول',
      formPlaceholderAccessCode: 'أدخل رمز الوصول (مثل اسم المستخدم)',
      formLabelAccessPassword: 'كلمة المرور',
      formPlaceholderAccessPassword: 'أدخل كلمة مرور آمنة',
      formPlaceholderEditPassword: "اتركه فارغًا للحفاظ على كلمة المرور الحالية",
      dialogCancelButton: 'إلغاء',
      dialogAddButton: 'إضافة مستخدم',
      dialogSaveButton: 'حفظ التغييرات',
      toastUserAddedTitle: 'تمت إضافة المستخدم',
      toastUserAddedDescription: 'تمت إضافة المستخدم {name} بنجاح.',
      toastUserUpdatedTitle: "تم تحديث المستخدم",
      toastUserUpdatedDescription: "تم تحديث المستخدم {name} بنجاح.",
      toastEditUserErrorTitle: "فشل التحديث",
      toastEditUserErrorDescription: "فشل تحديث المستخدم.",
      toastMissingFieldsTitle: 'حقول ناقصة',
      toastMissingFieldsDescription: 'يرجى تقديم الاسم والدور للمستخدم.',
      toastMissingFieldsWithAccessCodeDescription: 'الاسم، الدور، ورمز الوصول (للموظفين/المسؤولين) مطلوبة.',
      toastMissingFieldsFullDescription: 'جميع الحقول بما في ذلك رمز الوصول وكلمة المرور مطلوبة للمستخدمين الجدد.',
      toastEditUserPlaceholderTitle: 'تعديل المستخدم (تجريبي)',
      toastEditUserPlaceholderDescription: 'تعديل المستخدم {name} لم يتم تنفيذه بالكامل بعد.',
      toastUserDeletedTitle: 'تم حذف المستخدم',
      toastUserDeletedDescription: 'تمت إزالة المستخدم {name}.',
      confirmDeleteUser: 'هل أنت متأكد أنك تريد حذف المستخدم {name}؟',
      roleNotApplicable: 'غير متاح',
      roleDoctor: 'طبيب',
      rolePharmacist: 'صيدلي',
      roleLaboratory: 'مختبر',
      roleAdmin: 'مسؤول',
      tableHeaderClinic: 'العيادة المعينة',
      formLabelClinic: 'العيادة',
      formPlaceholderClinic: 'اختر العيادة',
      noClinicAssigned: 'غير معين (مثال: مسؤول عام)',
      toastMissingClinicDescription: 'يرجى تعيين عيادة لهذا الدور.',
    },
    adminSystemSettings: {
      pageTitle: 'إعدادات النظام',
      pageDescription: 'تكوين إعدادات التطبيق العامة والتكاملات.',
      loadingPage: 'جاري تحميل الصفحة...',
      generalSettingsTitle: 'الإعدادات العامة',
      clinicNameLabel: 'اسم العيادة',
      clinicNamePlaceholder: 'أدخل اسم العيادة',
      adminEmailLabel: 'بريد الاتصال بالمسؤول',
      adminEmailPlaceholder: 'أدخل بريد الاتصال بالمسؤول',
      appointmentSettingsTitle: 'إعدادات المواعيد',
      defaultDurationLabel: 'المدة الافتراضية للموعد (دقائق)',
      notificationSettingsTitle: 'إعدادات الإشعارات',
      enableWhatsappLabel: 'تمكين إشعارات واتساب (تجريبي)',
      whatsappHint: 'تكامل واتساب تجريبي حاليًا.',
      saveSettingsButton: 'حفظ الإعدادات',
      toastSettingsSavedTitle: 'تم حفظ الإعدادات',
      toastSettingsSavedDescription: 'تم (تجريبيًا) حفظ إعدادات النظام.',
    },
     adminDataAnalysis: {
      pageTitle: 'تحليل البيانات والتقارير',
      pageDescription: 'عرض المقاييس الرئيسية وإنشاء التقارير واكتساب رؤى حول عمليات العيادة.',
      loadingPage: 'جار التحميل...',
      appointmentVolumeTitle: "حجم المواعيد",
      patientDemographicsTitle: "التركيبة السكانية للمرضى",
      patientDemographicsDescription: "تصنيف المرضى حسب العيادة.",
      patientDemographicsDetailDesc: "هذا القسم يوفر رؤى حول توزيع أعمار المرضى، نسب الجنس، والتركيزات الجغرافية.",
      peakBookingTimesTitle: "أوقات الذروة للحجوزات",
      peakBookingTimesDescription: "تحليل لأكثر الساعات ازدحامًا بالحجوزات.",
      peakBookingTimesDetailDesc: "هذا القسم يعرض مخططات تحدد فترات الحجز الأكثر شيوعًا والاتجاهات بمرور الوقت.",
      servicePopularityTitle: "شعبية الخدمات",
      servicePopularityDescription: "الأسباب الأكثر شيوعًا للمواعيد.",
      servicePopularityDetailDesc: "سيشمل ذلك تفصيلاً لأسباب المواعيد وتكرار أنواع الخدمات المختلفة.",
      userActivityLogsTitle: "سجلات نشاط المستخدم",
      userActivityLogsDescription: "نظرة عامة على الوصول إلى النظام والإجراءات الرئيسية.",
      userActivityLogsDetailDesc: "عادةً ما يتم الحصول على سجلات نشاط المستخدم من نظام خلفي وستعرض الإجراءات الرئيسية وأنماط الوصول هنا. هذه الميزة للتكامل المستقبلي.",
      revenueAnalyticsTitle: "تحليلات الإيرادات",
      revenueAnalyticsDescription: "رؤى حول الأداء المالي، إيرادات الخدمات، إلخ. هذه الميزة مخطط لها للتكامل المستقبلي مع أنظمة البيانات المالية.",
      loadingChartData: "جاري تحميل بيانات الرسم البياني...",
      loadingPatientData: "جاري تحميل بيانات المرضى...",
      loadingAppointmentData: "جاري تحميل بيانات المواعيد...",
      loadingServiceData: "جاري تحميل بيانات الخدمات...",
      noAppointmentDataForChart: "لا توجد بيانات مواعيد متاحة للرسم البياني.",
      noPatientDataForChart: "لا توجد بيانات مرضى متاحة لمخطط التركيبة السكانية.",
      noServiceData: "لا توجد بيانات خدمة/سبب متاحة.",
      viewDetailsButton: "عرض التفاصيل",
      dialogCloseButton: "إغلاق",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  currentTranslations: AppTranslations;
  dir: 'ltr' | 'rtl';
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedLang = localStorage.getItem('appLanguage') as Language | null;
    if (storedLang && (storedLang === 'en' || storedLang === 'ar')) {
      setLanguage(storedLang);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      const newDir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      document.documentElement.dir = newDir;
      localStorage.setItem('appLanguage', language);
      document.body.classList.remove('lang-en', 'lang-ar');
      document.body.classList.add(`lang-${language}`);
    }
  }, [language, isClient]);

  const currentTranslations = useMemo(() => translations[language], [language]);
  const dir = useMemo(() => (language === 'ar' ? 'rtl' : 'ltr'), [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, currentTranslations, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
