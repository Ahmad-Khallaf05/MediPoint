
'use client';

import { useState, useEffect } from 'react';
import type { Locale } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CalendarCheck, User, Phone, Clock, BriefcaseMedical, Hospital } from 'lucide-react';
import type { Appointment, Patient, Doctor, Clinic } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { getAppointments, addOrUpdatePatient, mockPatients, getDoctors, addAppointment as addAppointmentToData, mockClinics } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { format, parse, addMinutes, subMinutes, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';

// Base time slots for a typical day
const baseTimeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

const APPOINTMENT_DURATION_MINUTES = 30;
const GAP_BETWEEN_APPOINTMENTS_MINUTES = 30;

export default function AppointmentsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string | undefined>();
  const [doctorsInClinic, setDoctorsInClinic] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Start with undefined date
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<string[]>([]);
  const [currentBookedAppointments, setCurrentBookedAppointments] = useState<Appointment[]>([]);
  
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const { currentTranslations, language } = useLanguage();
  const T = currentTranslations.appointments;
  const auth = useAuth();

  const [dateFnsLocale, setDateFnsLocale] = useState<Locale | undefined>(undefined);

  useEffect(() => {
    setIsClient(true);
    // Fetch clinics on mount
    async function fetchClinics() {
        // mockClinics is imported directly
        setClinics(mockClinics);
    }
    fetchClinics();
  }, []);

  // Effect to fetch doctors when a clinic is selected
  useEffect(() => {
    if (selectedClinicId && isClient) {
      async function fetchDoctorsForClinic() {
        const fetchedDoctors = await getDoctors(selectedClinicId);
        setDoctorsInClinic(fetchedDoctors);
        setSelectedDoctorId(undefined); // Reset doctor if clinic changes
        setSelectedDate(undefined); // Reset date
        setSelectedTime(undefined); // Reset time
        setFilteredTimeSlots([]);
      }
      fetchDoctorsForClinic();
    } else {
      setDoctorsInClinic([]); // Clear doctors if no clinic selected
    }
  }, [selectedClinicId, isClient]);


  useEffect(() => {
    if (auth.user && auth.user.role === 'patient') {
      setPatientName(auth.user.name);
      const currentPatient = mockPatients.find(p => p.id === auth.user?.id);
      if (currentPatient) {
        setPatientPhone(currentPatient.phone);
      } else {
        setPatientPhone(''); 
      }
    } else {
      setPatientName('');
      setPatientPhone('');
    }
  }, [auth.user]);

  useEffect(() => {
    async function loadLocale() {
      try {
        const localeModule = language === 'ar'
          ? await import('date-fns/locale/ar-SA')
          : await import('date-fns/locale/en-US');
        setDateFnsLocale(localeModule.default);
      } catch (error) {
        console.error("Failed to load date-fns locale:", error);
        const enLocaleModule = await import('date-fns/locale/en-US');
        setDateFnsLocale(enLocaleModule.default);
      }
    }
    if (isClient) {
      loadLocale();
    }
  }, [language, isClient]);
  
  // Effect to fetch and filter time slots
  useEffect(() => {
    async function fetchAndFilterSlots() {
      if (!selectedDate || !isClient || !selectedClinicId || !selectedDoctorId) {
        setFilteredTimeSlots([]);
        return;
      }

      // Fetch current appointments for the selected clinic and doctor
      const allAppointments = await getAppointments(selectedClinicId, selectedDoctorId); 
      setCurrentBookedAppointments(allAppointments);

      const appointmentsOnSelectedDate = allAppointments
        .filter(app => {
          const appDate = app.dateTime instanceof Date ? app.dateTime : new Date(app.dateTime);
          return (
            appDate.getFullYear() === selectedDate.getFullYear() &&
            appDate.getMonth() === selectedDate.getMonth() &&
            appDate.getDate() === selectedDate.getDate() &&
            (app.status === 'scheduled' || app.status === 'confirmed')
          );
        });

      const trulyAvailableSlots = baseTimeSlots.filter(slotString => {
        const parsedSlotTime = parse(slotString, 'hh:mm a', new Date());
        let pStart = new Date(selectedDate);
        pStart = setHours(pStart, parsedSlotTime.getHours());
        pStart = setMinutes(pStart, parsedSlotTime.getMinutes());
        pStart = setSeconds(pStart, 0);
        pStart = setMilliseconds(pStart, 0);

        const pEnd = addMinutes(pStart, APPOINTMENT_DURATION_MINUTES);

        for (const bookedAppt of appointmentsOnSelectedDate) {
          const bStart = bookedAppt.dateTime instanceof Date ? bookedAppt.dateTime : new Date(bookedAppt.dateTime);
          const bEnd = addMinutes(bStart, bookedAppt.durationMinutes);

          const forbiddenZoneStart = subMinutes(bStart, GAP_BETWEEN_APPOINTMENTS_MINUTES);
          const forbiddenZoneEnd = addMinutes(bEnd, GAP_BETWEEN_APPOINTMENTS_MINUTES);

          if (pStart < forbiddenZoneEnd && pEnd > forbiddenZoneStart) {
            return false;
          }
        }
        return true;
      });

      setFilteredTimeSlots(trulyAvailableSlots);

      if (selectedTime && !trulyAvailableSlots.includes(selectedTime)) {
        setSelectedTime(undefined);
      }
    }
    fetchAndFilterSlots();
  }, [selectedDate, selectedClinicId, selectedDoctorId, isClient, language]); // Added selectedClinicId and selectedDoctorId


  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClinicId || !selectedDoctorId || !selectedDate || !selectedTime || !patientName || !patientPhone) {
      toast({
        title: T.missingInfoToastTitle,
        description: T.missingInfoToastDescriptionDoctor || 'Please select clinic, doctor, date, time, and fill all patient fields.',
        variant: 'destructive',
      });
      return;
    }

    const parsedTime = parse(selectedTime, 'hh:mm a', new Date());

    let appointmentDateTime = new Date(selectedDate);
    appointmentDateTime = setHours(appointmentDateTime, parsedTime.getHours());
    appointmentDateTime = setMinutes(appointmentDateTime, parsedTime.getMinutes());
    appointmentDateTime = setSeconds(appointmentDateTime, 0);
    appointmentDateTime = setMilliseconds(appointmentDateTime, 0);

    const bookedPatientRecord = await addOrUpdatePatient(patientName, patientPhone, auth.user?.id, undefined, selectedClinicId);

    const appointmentDetails = {
      dateTime: appointmentDateTime,
      durationMinutes: APPOINTMENT_DURATION_MINUTES,
      reason: T.defaultBookingReason || 'Online Booking',
      status: 'scheduled' as Appointment['status'],
    };

    const newAppointment = await addAppointmentToData(appointmentDetails, bookedPatientRecord.id, bookedPatientRecord.name, selectedClinicId, selectedDoctorId);

    if (newAppointment) {
      const selectedDoctor = doctorsInClinic.find(d => d.id === selectedDoctorId);
      const selectedClinic = clinics.find(c => c.id === selectedClinicId);
      toast({
        title: T.bookedToastTitle,
        description: (T.bookedToastDescriptionDoctor || T.bookedToastDescription)
          .replace('{date}', selectedDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { locale: dateFnsLocale }))
          .replace('{time}', selectedTime)
          .replace('{doctorName}', selectedDoctor?.name || T.unknownDoctor || 'Selected Doctor')
          .replace('{clinicName}', selectedClinic?.name || 'Selected Clinic'),
        className: 'bg-accent text-accent-foreground',
      });
      
      // Trigger re-fetch and filter of slots for the selected doctor/clinic
      if (isClient && selectedDate && selectedClinicId && selectedDoctorId) {
          const allAppointments = await getAppointments(selectedClinicId, selectedDoctorId);
          setCurrentBookedAppointments(allAppointments);
          const appointmentsOnSelectedDate = allAppointments
            .filter(app => {
                const appDate = app.dateTime instanceof Date ? app.dateTime : new Date(app.dateTime);
                return (
                    appDate.getFullYear() === selectedDate.getFullYear() &&
                    appDate.getMonth() === selectedDate.getMonth() &&
                    appDate.getDate() === selectedDate.getDate() &&
                    (app.status === 'scheduled' || app.status === 'confirmed')
                );
            });

          const trulyAvailableSlots = baseTimeSlots.filter(slotString => {
            const parsedSlotTime = parse(slotString, 'hh:mm a', new Date());
            let pStart = new Date(selectedDate);
            pStart = setHours(pStart, parsedSlotTime.getHours());
            pStart = setMinutes(pStart, parsedSlotTime.getMinutes());
            pStart = setSeconds(pStart, 0);
            pStart = setMilliseconds(pStart, 0);

            const pEnd = addMinutes(pStart, APPOINTMENT_DURATION_MINUTES);

            for (const bookedAppt of appointmentsOnSelectedDate) {
                const bStart = bookedAppt.dateTime instanceof Date ? bookedAppt.dateTime : new Date(bookedAppt.dateTime);
                const bEnd = addMinutes(bStart, bookedAppt.durationMinutes);
                const forbiddenZoneStart = subMinutes(bStart, GAP_BETWEEN_APPOINTMENTS_MINUTES);
                const forbiddenZoneEnd = addMinutes(bEnd, GAP_BETWEEN_APPOINTMENTS_MINUTES);
                if (pStart < forbiddenZoneEnd && pEnd > forbiddenZoneStart) {
                    return false;
                }
            }
            return true;
          });
          setFilteredTimeSlots(trulyAvailableSlots);
          setSelectedTime(undefined); 
      }

      if (!(auth.user && auth.user.role === 'patient')) {
          setPatientName('');
          setPatientPhone('');
      }
    } else {
      toast({
        title: T.bookingFailedToastTitle || "Booking Failed",
        description: T.bookingFailedToastDescription || "Could not book the appointment. Please try again.",
        variant: 'destructive',
      });
    }
  };

  if (!isClient || !dateFnsLocale) {
    return <div className="flex justify-center items-center h-64"><p>{T.loadingCalendar}</p></div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center">
            <CalendarCheck className="mr-2 h-8 w-8" /> {T.pageTitle}
          </CardTitle>
          <CardDescription>{T.pageDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{T.selectClinicLabel || "1. Select Clinic:"}</h3>
              <Select onValueChange={(value) => {
                setSelectedClinicId(value);
                setSelectedDoctorId(undefined); // Reset doctor
                setSelectedDate(undefined); // Reset date
                setSelectedTime(undefined); // Reset time
              }} value={selectedClinicId}>
                <SelectTrigger className="w-full md:w-[280px]">
                  <SelectValue placeholder={T.selectClinicPlaceholder || "Choose a clinic"} />
                </SelectTrigger>
                <SelectContent>
                  {clinics.map((clinic) => (
                    <SelectItem key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedClinicId && (
              <div>
                <h3 className="text-lg font-semibold mb-2">{T.selectDoctorLabel || "2. Select Doctor:"}</h3>
                <Select onValueChange={(value) => {
                  setSelectedDoctorId(value);
                  setSelectedDate(undefined); // Reset date
                  setSelectedTime(undefined); // Reset time
                }} value={selectedDoctorId} disabled={doctorsInClinic.length === 0}>
                  <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder={doctorsInClinic.length > 0 ? (T.selectDoctorPlaceholder || "Choose a doctor") : (T.noDoctorsAvailable || "No doctors in this clinic")} />
                  </SelectTrigger>
                  <SelectContent>
                    {doctorsInClinic.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.specialty})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {selectedClinicId && selectedDoctorId && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{T.selectDate || "3. Select Date:"}</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setSelectedTime(undefined); // Reset time when date changes
                    }}
                    className="rounded-md border"
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) }
                    locale={dateFnsLocale}
                  />
                </div>
                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{T.selectTimeSlotFor} {selectedDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { locale: dateFnsLocale })}:</h3>
                    {filteredTimeSlots.length > 0 ? (
                      <Select onValueChange={setSelectedTime} value={selectedTime}>
                        <SelectTrigger className="w-full md:w-[280px]">
                          <SelectValue placeholder={T.selectTimePlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredTimeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-muted-foreground">{T.noSlotsAvailable || "No available slots for this date/doctor."}</p>
                    )}
                  </div>
                )}
              </>
            )}
            {!selectedClinicId && <p className="text-muted-foreground">{T.promptSelectClinic || "Please select a clinic to see available doctors and times."}</p>}
            {selectedClinicId && !selectedDoctorId && <p className="text-muted-foreground">{T.promptSelectDoctor || "Please select a doctor to see their availability."}</p>}
          </div>
        </CardContent>
      </Card>

      {selectedClinicId && selectedDoctorId && selectedDate && selectedTime && (
        <Card className="shadow-lg animate-fadeIn">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">{T.confirmDetailsTitle}</CardTitle>
            <CardDescription>
              {T.bookingFor} <strong>{selectedDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { locale: dateFnsLocale })} {language === 'ar' ? 'في' : 'at'} {selectedTime}</strong>
              <br/>
              {T.withDoctorLabel || "with"} <strong>{doctorsInClinic.find(d=>d.id === selectedDoctorId)?.name || ''}</strong> {T.atClinicLabel || "at"} <strong>{clinics.find(c=>c.id === selectedClinicId)?.name || ''}</strong>.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleBooking}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName" className="flex items-center"><User className="mr-2 h-4 w-4" />{T.fullNameLabel}</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder={T.fullNamePlaceholder}
                  required
                  disabled={!!(auth.user && auth.user.role === 'patient')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientPhone" className="flex items-center"><Phone className="mr-2 h-4 w-4" />{T.phoneLabel}</Label>
                <Input
                  id="patientPhone"
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder={T.phonePlaceholder}
                  required
                  disabled={!!(auth.user && auth.user.role === 'patient')}
                />
                <p className="text-xs text-muted-foreground">{T.whatsappNotifications}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full md:w-auto transform hover:scale-105 transition-transform duration-300">
                <Clock className="mr-2 h-5 w-5" /> {T.bookAppointmentButton}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
