
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAppointments, deleteAppointment, updateAppointment, addAppointment, mockPatients as allPatients, getClinicById, mockClinics, getDoctors } from '@/lib/data';
import type { Appointment, Patient, Doctor } from '@/lib/types';
import { Pencil, Trash2, PlusCircle, Settings, BriefcaseMedical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { useLanguage } from '@/hooks/use-language';
import { enUS, arSA } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';


const DEFAULT_CLINIC_ID = 'clinic-default-001'; // Default clinic for this admin panel view & new appointments

type EditableAppointment = Partial<Omit<Appointment, 'id' | 'patientId' | 'patientName' | 'clinicId' | 'clinicName' | 'doctorName'>> & {
  id?: string;
  patientId?: string;
  patientName?: string;
  clinicId?: string;
  clinicName?: string;
  doctorId?: string;
  doctorName?: string;
  dateTime?: Date | string; // Allow string for input, convert to Date on save
};

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>(allPatients); 
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<EditableAppointment | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const { currentTranslations, language } = useLanguage();
  const auth = useAuth();
  const T = currentTranslations.admin;
  const T_Appts = currentTranslations.appointments;


  const dateLocale = language === 'ar' ? arSA : enUS;

  const fetchAppointments = useCallback(async () => {
    let loadedAppointments;
    if (auth.user?.role === 'doctor') {
      loadedAppointments = await getAppointments(DEFAULT_CLINIC_ID, auth.user.id);
    } else {
      loadedAppointments = await getAppointments(DEFAULT_CLINIC_ID);
    }
    setAppointments(loadedAppointments.sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
  }, [auth.user]);

  const fetchDoctorsForAdmin = useCallback(async () => {
    const fetchedDoctors = await getDoctors();
    setDoctors(fetchedDoctors);
  }, []);


  useEffect(() => {
    setIsClient(true);
    fetchAppointments();
    fetchDoctorsForAdmin();
  }, [fetchAppointments, fetchDoctorsForAdmin]);

  const handleEdit = (appointment: Appointment) => {
    setCurrentAppointment({
      ...appointment,
      dateTime: appointment.dateTime ? format(new Date(appointment.dateTime), "yyyy-MM-dd'T'HH:mm") : ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (appointmentId: string) => {
    const success = await deleteAppointment(appointmentId);
    if (success) {
      toast({
        title: T.appointmentDeletedToastTitle,
        description: T.appointmentDeletedToastDescription.replace('{id}', appointmentId)
      });
      fetchAppointments(); 
    } else {
      toast({ title: T.errorToastTitle || "Error", description: T.errorDeletingAppointment || "Failed to delete appointment.", variant: "destructive"});
    }
  };

  const handleSaveAppointment = async () => {
    if (!currentAppointment) return;

    let patientNameForSave = currentAppointment.patientName;
    let patientIdForSave = currentAppointment.patientId;

    if (!patientIdForSave) {
      toast({ title: T.errorToastTitle || "Error", description: T.errorPatientNotSelected || "Please select a patient.", variant: "destructive" });
      return;
    }
    if (!patientNameForSave) {
      patientNameForSave = patients.find(p => p.id === patientIdForSave)?.name || T.statusPlaceholder || 'Unknown Patient';
    }

    const appointmentDateTime = currentAppointment.dateTime ? new Date(currentAppointment.dateTime) : new Date();
    const clinicIdToSave = DEFAULT_CLINIC_ID;
    const clinic = await getClinicById(clinicIdToSave);
    const clinicNameToSave = clinic?.name || 'Unknown Clinic';
    
    const selectedDoctorObj = doctors.find(d => d.id === currentAppointment.doctorId);


    if (currentAppointment.id) { // Editing existing appointment
      const appointmentToUpdate: Appointment = {
        id: currentAppointment.id,
        patientId: patientIdForSave,
        patientName: patientNameForSave,
        clinicId: clinicIdToSave,
        clinicName: clinicNameToSave,
        dateTime: appointmentDateTime,
        durationMinutes: currentAppointment.durationMinutes || 30,
        reason: currentAppointment.reason,
        status: currentAppointment.status || 'scheduled',
        doctorId: currentAppointment.doctorId,
        doctorName: selectedDoctorObj?.name || currentAppointment.doctorName,
      };
      const updatedAppt = await updateAppointment(appointmentToUpdate);
      if (updatedAppt) {
        toast({
            title: T.appointmentUpdatedToastTitle,
            description: T.appointmentUpdatedToastDescription.replace('{name}', updatedAppt.patientName || 'N/A'),
            className: 'bg-accent text-accent-foreground'
        });
        fetchAppointments();
      } else {
        toast({ title: T.errorToastTitle || "Error", description: T.errorUpdatingAppointment || "Failed to update appointment.", variant: "destructive"});
      }
    } else { // Adding new appointment
        const appointmentDetails = {
            dateTime: appointmentDateTime,
            durationMinutes: currentAppointment.durationMinutes || 30,
            reason: currentAppointment.reason,
            status: currentAppointment.status || 'scheduled',
        };
      const newAppt = await addAppointment(appointmentDetails, patientIdForSave, patientNameForSave, clinicIdToSave, currentAppointment.doctorId);
      if (newAppt) {
        toast({
          title: T.appointmentAddedToastTitle,
          description: T.appointmentAddedToastDescription.replace('{name}', newAppt.patientName || 'N/A'),
          className: 'bg-accent text-accent-foreground'
        });
        fetchAppointments();
      } else {
         toast({ title: T.errorToastTitle || "Error", description: T.errorAddingAppointment || "Failed to add appointment.", variant: "destructive"});
      }
    }
    setIsDialogOpen(false);
    setCurrentAppointment(null);
  };

  const openNewAppointmentDialog = async () => {
    const defaultClinic = await getClinicById(DEFAULT_CLINIC_ID);
    let defaultDoctorId: string | undefined = undefined;
    let defaultDoctorName: string | undefined = undefined;

    if (auth.user?.role === 'doctor') {
        defaultDoctorId = auth.user.id;
        defaultDoctorName = auth.user.name;
    }

    setCurrentAppointment({
        status: 'scheduled',
        durationMinutes: 30,
        dateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        clinicId: DEFAULT_CLINIC_ID,
        clinicName: defaultClinic?.name || 'Default Clinic',
        doctorId: defaultDoctorId,
        doctorName: defaultDoctorName
    });
    setIsDialogOpen(true);
  };

  const getStatusText = (status: Appointment['status']) => {
    const statusKey = `status${status.charAt(0).toUpperCase() + status.slice(1)}` as keyof typeof T;
    return T[statusKey] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  const pageDescriptionText = auth.user?.role === 'doctor' 
    ? `${T.pageDescription} (Clinic: ${mockClinics.find(c=>c.id === DEFAULT_CLINIC_ID)?.name || DEFAULT_CLINIC_ID} - Your Appointments)`
    : `${T.pageDescription} (Clinic: ${mockClinics.find(c=>c.id === DEFAULT_CLINIC_ID)?.name || DEFAULT_CLINIC_ID})`;


  if (!isClient) {
    return <div className="flex justify-center items-center h-64"><p>{T.loadingAdminPanel}</p></div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-3xl text-primary flex items-center">
              <Settings className="mr-2 h-8 w-8" /> {T.pageTitle}
            </CardTitle>
            <CardDescription>{pageDescriptionText}</CardDescription>
          </div>
          <Button onClick={openNewAppointmentDialog} className="transform hover:scale-105 transition-transform duration-300">
            <PlusCircle className="mr-2 h-5 w-5" /> {T.addAppointmentButton}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{T.patientNameHeader}</TableHead>
                <TableHead>{T.doctorHeader || 'Doctor'}</TableHead>
                <TableHead>{T.dateTimeHeader}</TableHead>
                <TableHead>{T.durationHeader}</TableHead>
                <TableHead>{T.reasonHeader}</TableHead>
                <TableHead>{T.statusHeader}</TableHead>
                <TableHead>{T.actionsHeader}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.doctorName || (language === 'ar' ? 'غير محدد' : 'N/A')}</TableCell>
                  <TableCell>{format(new Date(appointment.dateTime), 'PPP p', { locale: dateLocale })}</TableCell>
                  <TableCell>{appointment.durationMinutes} {language==='ar' ? 'دقيقة' : 'min'}</TableCell>
                  <TableCell>{appointment.reason || (language === 'ar' ? 'غير متوفر' : 'N/A')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      appointment.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(appointment)} className="hover:text-primary transition-colors">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(appointment.id)} className="hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {appointments.length === 0 && <p className="text-center text-muted-foreground py-4">{T.noAppointmentsFound}</p>}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline text-primary">{currentAppointment?.id ? T.dialogEditTitle : T.dialogAddTitle}</DialogTitle>
            <DialogDescription>
              {currentAppointment?.id ? T.dialogEditDescription : T.dialogAddDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{T.clinicLabel || 'Clinic'}</Label>
                <Input
                  value={currentAppointment?.clinicName || mockClinics.find(c=>c.id === DEFAULT_CLINIC_ID)?.name || DEFAULT_CLINIC_ID}
                  readOnly
                  className="col-span-3 bg-muted"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientId" className="text-right">{T.patientLabel}</Label>
              <Select
                value={currentAppointment?.patientId || ""}
                onValueChange={(value) => {
                    if (!value) {
                        setCurrentAppointment(prev => prev ? ({ ...prev, patientId: '', patientName: undefined }) : null);
                    } else {
                        const selectedPatient = patients.find(p => p.id === value);
                        setCurrentAppointment(prev => prev ? ({
                            ...prev,
                            patientId: value,
                            patientName: selectedPatient?.name || undefined
                        }) : null);
                    }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={T.patientSelectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doctorId" className="text-right">{T.doctorLabel || 'Doctor'}</Label>
              <Select
                value={currentAppointment?.doctorId || ""}
                onValueChange={(value) => {
                    const selectedDoc = doctors.find(d => d.id === value);
                    setCurrentAppointment(prev => prev ? ({ 
                        ...prev, 
                        doctorId: value || undefined,
                        doctorName: selectedDoc?.name || undefined 
                    }) : null);
                }}
                disabled={auth.user?.role === 'doctor' && !currentAppointment?.id} // Disable if doctor is adding new appt for themselves
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={T_Appts.selectDoctorPlaceholder || 'Select doctor (optional)'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{T.noDoctorAssigned || 'No specific doctor'}</SelectItem>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.specialty})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateTime" className="text-right">{T.dateTimeLabel}</Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={currentAppointment?.dateTime ? (typeof currentAppointment.dateTime === 'string' ? currentAppointment.dateTime : format(new Date(currentAppointment.dateTime), "yyyy-MM-dd'T'HH:mm")) : ''}
                onChange={(e) => setCurrentAppointment(prev => prev ? ({ ...prev, dateTime: e.target.value }) : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">{T.durationLabel}</Label>
              <Input
                id="duration"
                type="number"
                value={currentAppointment?.durationMinutes?.toString() || ''}
                onChange={(e) => setCurrentAppointment(prev => prev ? ({ ...prev, durationMinutes: parseInt(e.target.value) || undefined }) : null)}
                className="col-span-3"
                min="5"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">{T.reasonLabel}</Label>
              <Input
                id="reason"
                value={currentAppointment?.reason || ''}
                onChange={(e) => setCurrentAppointment(prev => prev ? ({ ...prev, reason: e.target.value }) : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">{T.statusLabel}</Label>
              <Select
                value={currentAppointment?.status || ""}
                onValueChange={(value) => setCurrentAppointment(prev => prev ? ({ ...prev, status: value as Appointment['status'] }) : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={T.statusSelectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {(['scheduled', 'confirmed', 'cancelled', 'completed'] as Appointment['status'][]).map(status => (
                    <SelectItem key={status} value={status}>{getStatusText(status)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{T.cancelButton}</Button>
            <Button onClick={handleSaveAppointment} className="transform hover:scale-105 transition-transform duration-300">{T.saveButton}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
