
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { getPatientById, getPrescriptionsByPatientId, getXRaysByPatientId, updatePrescriptionSharingStatus, updateXRaySharingStatus, addXRayToPatient, updatePatientById, addPrescriptionToPatient } from '@/lib/data';
import type { Patient, Prescription, XRay, NewXRayFormData, EditablePatientProfile, NewPrescriptionFormData } from '@/lib/types';
import { CalendarIcon, FileText, Image as ImageIcon, Mail, MapPin, Phone, User, Edit3, PlusCircle, ArrowLeft, UploadCloud, Pill } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { format, parseISO, isValid } from 'date-fns';
import { useLanguage } from '@/hooks/use-language';
import { useEffect, useState, use, useCallback } from 'react';
import { enUS, arSA } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth'; 

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-md font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

interface ManageSectionProps<T extends { id: string }> {
  title: string;
  icon: React.ReactNode;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessageKey: keyof typeof currentTranslations.patientDetail;
  currentTranslations: typeof import('@/context/language-context').translations.en;
  addButtonLabel?: string; 
  onAddClick?: () => void; 
}

function ManageSection<T extends { id: string }>({ title, icon, items, renderItem, emptyMessageKey, currentTranslations, addButtonLabel, onAddClick }: ManageSectionProps<T>) {
  const T_patientDetail = currentTranslations.patientDetail;
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          {icon} {title}
        </CardTitle>
        {onAddClick && addButtonLabel && (
          <Button variant="outline" size="sm" onClick={onAddClick} className="transform hover:scale-105 transition-transform duration-300">
            <PlusCircle className="mr-2 h-4 w-4" /> {addButtonLabel}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item, index) => renderItem(item, index))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">{T_patientDetail[emptyMessageKey] as string || 'No items found.'}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function PatientDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(paramsPromise);
  const patientId = resolvedParams.id;

  const { currentTranslations, language } = useLanguage();
  const T = currentTranslations.patientDetail;
  const dateLocale = language === 'ar' ? arSA : enUS;
  const { toast } = useToast();
  const auth = useAuth(); 

  const [patient, setPatient] = useState<Patient | null | undefined>(undefined);
  const [allPrescriptions, setAllPrescriptions] = useState<Prescription[]>([]);
  const [allXrays, setAllXRays] = useState<XRay[]>([]);
  
  const [isAddXRayDialogOpen, setIsAddXRayDialogOpen] = useState(false);
  const [newXRayForm, setNewXRayForm] = useState<NewXRayFormData>({ description: '', dateTaken: '', notes: '' });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [editableProfile, setEditableProfile] = useState<EditablePatientProfile | null>(null);

  const [isAddPrescriptionDialogOpen, setIsAddPrescriptionDialogOpen] = useState(false);
  const [newPrescriptionForm, setNewPrescriptionForm] = useState<NewPrescriptionFormData>({ medication: '', dosage: '', instructions: '', dateIssued: format(new Date(), 'yyyy-MM-dd') });


  const fetchData = useCallback(async () => {
    if (!patientId) return;
    const patientData = await getPatientById(patientId);
    setPatient(patientData);
    if (patientData) {
      setEditableProfile(patientData); 
      const presData = await getPrescriptionsByPatientId(patientId);
      setAllPrescriptions(presData);
      const xrayData = await getXRaysByPatientId(patientId);
      setAllXRays(xrayData);
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
        fetchData();
    }
  }, [patientId, fetchData]);

  // Edit Profile Handlers
  const handleOpenEditProfileDialog = () => {
    if (patient) {
      setEditableProfile({ ...patient }); 
      setIsEditProfileDialogOpen(true);
    }
  };

  const handleEditableProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveProfile = async () => {
    if (!patientId || !editableProfile) return;
    const updatedPatient = await updatePatientById(patientId, editableProfile);
    if (updatedPatient) {
      setPatient(updatedPatient); 
      toast({ title: T.profileUpdatedSuccessTitle, description: T.profileUpdatedSuccessDescription });
    } else {
      toast({ title: T.profileUpdatedErrorTitle, description: T.profileUpdatedErrorDescription, variant: 'destructive' });
    }
    setIsEditProfileDialogOpen(false);
  };


  // Prescription Sharing Handlers
  const handlePrescriptionSharingChange = useCallback(async (prescriptionId: string, type: 'pharmacy' | 'laboratory', checked: boolean) => {
    setAllPrescriptions(prev => 
      prev.map(p => 
        p.id === prescriptionId ? { ...p, [type === 'pharmacy' ? 'sharedWithPharmacy' : 'sharedWithLaboratory']: checked } : p
      )
    );
    await updatePrescriptionSharingStatus(prescriptionId, type, checked);
    toast({
      title: T.sharingStatusUpdatedTitle,
      description: T.sharingStatusUpdatedDescription
        .replace('{itemType}', T.prescriptionsTitle.toLowerCase())
        .replace('{action}', checked ? T.sharedAction : T.unsharedAction)
        .replace('{entity}', type === 'pharmacy' ? T.pharmacyEntity : T.laboratoryEntity),
    });
  }, [T, toast]);

  // X-Ray Sharing Handlers
  const handleXRaySharingChange = useCallback(async (xrayId: string, type: 'pharmacy' | 'laboratory', checked: boolean) => {
    setAllXRays(prev => 
      prev.map(x => 
        x.id === xrayId ? { ...x, [type === 'pharmacy' ? 'sharedWithPharmacy' : 'sharedWithLaboratory']: checked } : x
      )
    );
    await updateXRaySharingStatus(xrayId, type, checked);
     toast({
      title: T.sharingStatusUpdatedTitle,
      description: T.sharingStatusUpdatedDescription
        .replace('{itemType}', T.xraysTitle.toLowerCase())
        .replace('{action}', checked ? T.sharedAction : T.unsharedAction)
        .replace('{entity}', type === 'pharmacy' ? T.pharmacyEntity : T.laboratoryEntity),
    });
  }, [T, toast]);

  // Add Prescription Handlers
  const handleOpenAddPrescriptionDialog = () => {
    setNewPrescriptionForm({ medication: '', dosage: '', instructions: '', dateIssued: format(new Date(), 'yyyy-MM-dd')});
    setIsAddPrescriptionDialogOpen(true);
  };

  const handleNewPrescriptionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPrescriptionForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNewPrescription = async () => {
    if (!patientId || !newPrescriptionForm.medication || !newPrescriptionForm.dosage || !newPrescriptionForm.dateIssued) {
      toast({ title: T.prescriptionDialogErrorTitle, description: T.prescriptionDialogErrorDescription, variant: 'destructive'});
      return;
    }
    const dateIssuedParsed = parseISO(newPrescriptionForm.dateIssued);
    if (!isValid(dateIssuedParsed)) {
        toast({ title: T.prescriptionDialogErrorTitle, description: "Invalid date format for Date Issued.", variant: 'destructive'});
        return;
    }

    try {
      const newPrescription = await addPrescriptionToPatient(patientId, {
        medication: newPrescriptionForm.medication,
        dosage: newPrescriptionForm.dosage,
        instructions: newPrescriptionForm.instructions,
        dateIssued: dateIssuedParsed,
        issuingDoctorId: auth.user?.id || 'doc-unknown' 
      });
      setAllPrescriptions(prev => [...prev, newPrescription]);
      toast({ title: T.prescriptionAddedSuccessTitle, description: T.prescriptionAddedSuccessDescription });
      setIsAddPrescriptionDialogOpen(false);
    } catch (error) {
      console.error("Error saving prescription:", error);
      toast({ title: T.prescriptionDialogErrorTitle, description: "An unexpected error occurred while saving.", variant: 'destructive'});
    }
  };


  // Add X-Ray Handlers
  const handleOpenAddXRayDialog = () => {
    setNewXRayForm({ description: '', dateTaken: '', notes: '' });
    setPreviewImage(null);
    setIsAddXRayDialogOpen(true);
  };
  
  const handleNewXRayFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewXRayForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewXRayForm(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setNewXRayForm(prev => ({ ...prev, imageFile: undefined }));
      setPreviewImage(null);
    }
  };

  const handleSaveNewXRay = async () => {
    if (!patientId || !newXRayForm.description || !newXRayForm.dateTaken || !newXRayForm.imageFile) {
      toast({ title: T.xrayDialogErrorTitle, description: T.xrayDialogErrorDescription, variant: 'destructive'});
      return;
    }
    const dateTakenParsed = parseISO(newXRayForm.dateTaken);
    if (!isValid(dateTakenParsed)) {
        toast({ title: T.xrayDialogErrorTitle, description: "Invalid date format for Date Taken.", variant: 'destructive'});
        return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const imageUrl = reader.result as string;
        const newXray = await addXRayToPatient(patientId, {
          description: newXRayForm.description,
          dateTaken: dateTakenParsed,
          imageUrl: imageUrl,
          notes: newXRayForm.notes
        });
        setAllXRays(prev => [...prev, newXray]);
        toast({ title: T.xrayAddedSuccessTitle, description: T.xrayAddedSuccessDescription });
        setIsAddXRayDialogOpen(false);
      } catch (error) {
        console.error("Error saving X-Ray:", error);
        toast({ title: T.xrayDialogErrorTitle, description: "An unexpected error occurred.", variant: 'destructive'});
      }
    };
    reader.onerror = () => {
        toast({ title: T.xrayDialogErrorTitle, description: "Error reading file.", variant: 'destructive'});
    };
    reader.readAsDataURL(newXRayForm.imageFile);
  };


  if (patient === undefined || auth.isLoading) { 
    return <div className="text-center py-10"><p>{T.loadingPatientData || 'Loading patient data...'}</p></div>;
  }

  if (!patient) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold text-destructive">{T.patientNotFoundTitle}</h1>
        <p className="text-muted-foreground">{T.patientNotFoundDescription}</p>
        <Button asChild className="mt-4">
          <Link href={auth.user?.role === 'doctor' ? "/dashboard/doctor/patient-management" : "/admin"}>
            {auth.user?.role === 'doctor' ? (T.backToPatientListButton || 'Back to Patient List') : (T.goToAdminButton || 'Go to Admin')}
          </Link>
        </Button>
      </div>
    );
  }
  
  const isDoctor = auth.user?.role === 'doctor';
  const isPatientViewingOwnRecord = auth.user?.role === 'patient' && auth.user?.id === patient.id;
  const isPharmacist = auth.user?.role === 'pharmacist';
  const isLaboratory = auth.user?.role === 'laboratory';
  const canEditProfile = isDoctor || isPatientViewingOwnRecord;

  const visiblePrescriptions = isPharmacist 
    ? allPrescriptions.filter(p => p.sharedWithPharmacy) 
    : allPrescriptions;

  const visibleXRays = isLaboratory
    ? allXrays.filter(x => x.sharedWithLaboratory)
    : allXrays;

  const backLinkPath = 
    isDoctor ? "/dashboard/doctor/patient-management" :
    isPharmacist ? "/dashboard/pharmacist/patient-list" :
    isLaboratory ? "/dashboard/laboratory/patient-list" :
    auth.user?.role === 'admin' ? "/admin" : 
    undefined;


  return (
    <div className="space-y-8">
       {backLinkPath && (
        <Button variant="outline" asChild className="mb-4">
          <Link href={backLinkPath}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {T.backToPatientListButton || "Back to List"}
          </Link>
        </Button>
      )}
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/10 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={`https://placehold.co/100x100.png?text=${patient.name.charAt(0)}`} alt={patient.name} data-ai-hint="profile photo"/>
                <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="font-headline text-3xl text-primary">{patient.name}</CardTitle>
                <CardDescription className="text-primary/80">{T.patientIdLabel} {patient.id}</CardDescription>
              </div>
            </div>
            {canEditProfile && ( 
              <Button variant="outline" size="sm" className="transform hover:scale-105 transition-transform duration-300" onClick={handleOpenEditProfileDialog}>
                <Edit3 className="mr-2 h-4 w-4" /> {T.editProfileButton}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          <InfoItem icon={<CalendarIcon className="h-5 w-5 text-primary" />} label={T.dateOfBirthLabel} value={patient.dateOfBirth ? format(parseISO(patient.dateOfBirth), 'PPP', { locale: dateLocale }) : T.notApplicable} />
          <InfoItem icon={<Phone className="h-5 w-5 text-primary" />} label={T.phoneLabel} value={patient.phone} />
          {patient.email && <InfoItem icon={<Mail className="h-5 w-5 text-primary" />} label={T.emailLabel} value={patient.email} />}
          {patient.address && <InfoItem icon={<MapPin className="h-5 w-5 text-primary" />} label={T.addressLabel} value={patient.address} />}
        </CardContent>
        {(isDoctor || isPatientViewingOwnRecord) && patient.medicalHistory && (
          <>
            <Separator className="my-0" />
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2 text-primary flex items-center"><User className="mr-2 h-5 w-5" /> {T.medicalHistoryLabel}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{patient.medicalHistory}</p>
            </CardContent>
          </>
        )}
      </Card>

      {/* Prescriptions Section */}
      {(isDoctor || isPatientViewingOwnRecord || (isPharmacist && visiblePrescriptions.length > 0)) && (
        <ManageSection
          title={T.prescriptionsTitle}
          icon={<Pill className="mr-2 h-7 w-7 text-primary" />}
          items={visiblePrescriptions}
          currentTranslations={currentTranslations}
          renderItem={(item: Prescription) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-secondary-foreground">{item.medication}</CardTitle>
                <CardDescription>{T.prescriptionsDosage} {item.dosage}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{T.prescriptionsInstructions} {item.instructions}</p>
                 {isDoctor && (
                    <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => { 
                      toast({ 
                        title: T.featurePlaceholderToastTitle, 
                        description: (T.featurePlaceholderToastDescription || "Adding/editing {itemType} will be available in a future update.").replace('{itemType}', T.prescriptionsTitle.toLowerCase()) 
                      }) 
                    }}>
                        <Edit3 className="mr-1 h-3 w-3" /> {T.editPrescriptionButton || "Edit"}
                    </Button>
                 )}
                {isDoctor && (
                  <div className="space-y-3 pt-2 border-t mt-3">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`presc-pharm-${item.id}`} 
                        checked={item.sharedWithPharmacy}
                        onCheckedChange={(checked) => handlePrescriptionSharingChange(item.id, 'pharmacy', checked)}
                      />
                      <Label htmlFor={`presc-pharm-${item.id}`}>{T.shareWithPharmacyLabel}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`presc-lab-${item.id}`} 
                        checked={item.sharedWithLaboratory}
                        onCheckedChange={(checked) => handlePrescriptionSharingChange(item.id, 'laboratory', checked)}
                      />
                      <Label htmlFor={`presc-lab-${item.id}`}>{T.shareWithLaboratoryLabel}</Label>
                    </div>
                  </div>
                )}
                 {(isPatientViewingOwnRecord || isDoctor || isPharmacist) && (item.sharedWithPharmacy || item.sharedWithLaboratory) && (
                  <div className="text-xs text-muted-foreground pt-2">
                    {item.sharedWithPharmacy && <span>{T.currentlySharedWithPharmacy}. </span>}
                    {item.sharedWithLaboratory && !isPharmacist && <span>{T.currentlySharedWithLaboratory}.</span>}
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
               {T.prescriptionsIssued} {format(new Date(item.dateIssued), 'PPP', { locale: dateLocale })} {T.prescriptionsByDoctor} {item.issuingDoctorId}
              </CardFooter>
            </Card>
          )}
          emptyMessageKey={isPharmacist ? "noPrescriptionsSharedWithPharmacy" : "noPrescriptionsFound"}
          addButtonLabel={isDoctor ? T.addNewPrescriptionButton : undefined}
          onAddClick={isDoctor ? handleOpenAddPrescriptionDialog : undefined}
        />
      )}
      {isPharmacist && visiblePrescriptions.length === 0 && allPrescriptions.length > 0 && (
         <Card><CardContent className="p-6 text-center text-muted-foreground">{T.noPrescriptionsSharedWithPharmacyMessage}</CardContent></Card>
      )}


      {/* X-Rays Section */}
      {(isDoctor || isPatientViewingOwnRecord || isLaboratory) && ( 
        <ManageSection
          title={T.xraysTitle}
          icon={<ImageIcon className="mr-2 h-7 w-7 text-primary" />}
          items={visibleXRays}
          currentTranslations={currentTranslations}
          renderItem={(item: XRay) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-secondary-foreground">{item.description}</CardTitle>
                <CardDescription>{T.xraysTaken} {format(new Date(item.dateTaken), 'PPP', { locale: dateLocale })}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href={item.imageUrl} target="_blank" rel="noopener noreferrer" title={T.viewImageTooltip || "View full image"}>
                  <NextImage src={item.imageUrl} alt={item.description} width={200} height={150} className="rounded-md border cursor-pointer hover:opacity-80 transition-opacity" data-ai-hint="medical scan"/>
                </a>
                {item.notes && <p className="text-sm text-muted-foreground">{T.xraysNotes} {item.notes}</p>}
                {isDoctor && (
                   <div className="space-y-3 pt-2 border-t mt-3">
                     <div className="flex items-center space-x-2">
                      <Switch 
                        id={`xray-pharm-${item.id}`} 
                        checked={item.sharedWithPharmacy}
                        onCheckedChange={(checked) => handleXRaySharingChange(item.id, 'pharmacy', checked)}
                      />
                      <Label htmlFor={`xray-pharm-${item.id}`}>{T.shareWithPharmacyLabel}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`xray-lab-${item.id}`} 
                        checked={item.sharedWithLaboratory}
                        onCheckedChange={(checked) => handleXRaySharingChange(item.id, 'laboratory', checked)}
                      />
                      <Label htmlFor={`xray-lab-${item.id}`}>{T.shareWithLaboratoryLabel}</Label>
                    </div>
                  </div>
                )}
                {(isPatientViewingOwnRecord || isDoctor || isLaboratory) && (item.sharedWithPharmacy || item.sharedWithLaboratory) && (
                  <div className="text-xs text-muted-foreground pt-2">
                    {!isLaboratory && item.sharedWithPharmacy && <span>{T.currentlySharedWithPharmacy}. </span>}
                    {item.sharedWithLaboratory && <span>{T.currentlySharedWithLaboratory}.</span>}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          emptyMessageKey={(isLaboratory && visibleXRays.length === 0) ? "noXRaysSharedWithLaboratory" : "noXRaysFound"}
          addButtonLabel={(isDoctor || isLaboratory) ? T.addNewXRayButton : undefined}
          onAddClick={(isDoctor || isLaboratory) ? handleOpenAddXRayDialog : undefined}
        />
      )}
       {isLaboratory && visibleXRays.length === 0 && allXrays.length > 0 && !isDoctor && (
         <Card><CardContent className="p-6 text-center text-muted-foreground">{T.noXRaysSharedWithLaboratoryMessage}</CardContent></Card>
      )}

      {/* Edit Profile Dialog */}
      {canEditProfile && editableProfile && (
        <Dialog open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-headline text-primary flex items-center">
                <Edit3 className="mr-2 h-6 w-6" /> {T.editProfileDialogTitle || "Edit Patient Profile"}
              </DialogTitle>
              <DialogDescription>{T.editProfileDialogDescription || "Update the patient's information below."}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-1">
                <Label htmlFor="editName">{T.formLabelName || "Name"}</Label>
                <Input id="editName" name="name" value={editableProfile.name} onChange={handleEditableProfileChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="editDob">{T.formLabelDob || "Date of Birth"}</Label>
                <Input id="editDob" name="dateOfBirth" type="date" value={editableProfile.dateOfBirth} onChange={handleEditableProfileChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="editPhone">{T.formLabelPhone || "Phone"}</Label>
                <Input id="editPhone" name="phone" value={editableProfile.phone} onChange={handleEditableProfileChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="editEmail">{T.formLabelEmail || "Email"}</Label>
                <Input id="editEmail" name="email" type="email" value={editableProfile.email || ''} onChange={handleEditableProfileChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="editAddress">{T.formLabelAddress || "Address"}</Label>
                <Textarea id="editAddress" name="address" value={editableProfile.address || ''} onChange={handleEditableProfileChange} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="editMedicalHistory">{T.formLabelMedicalHistory || "Medical History"}</Label>
                <Textarea id="editMedicalHistory" name="medicalHistory" value={editableProfile.medicalHistory || ''} onChange={handleEditableProfileChange} rows={4} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">{T.dialogCancelButton || "Cancel"}</Button></DialogClose>
              <Button onClick={handleSaveProfile} className="transform hover:scale-105 transition-transform duration-300">{T.dialogSaveButton || "Save Changes"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add New Prescription Dialog */}
      {isDoctor && (
        <Dialog open={isAddPrescriptionDialogOpen} onOpenChange={setIsAddPrescriptionDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-headline text-primary flex items-center">
                <Pill className="mr-2 h-6 w-6" /> {T.prescriptionDialogTitle || "Add New Prescription"}
              </DialogTitle>
              <DialogDescription>{T.prescriptionDialogDescription || "Fill in the details for the new prescription."}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="prescMedication">{T.prescriptionFormMedication || "Medication"}</Label>
                <Input id="prescMedication" name="medication" value={newPrescriptionForm.medication} onChange={handleNewPrescriptionFormChange} placeholder={T.prescriptionFormMedicationPlaceholder || "e.g., Amoxicillin 500mg"} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="prescDosage">{T.prescriptionFormDosage || "Dosage"}</Label>
                <Input id="prescDosage" name="dosage" value={newPrescriptionForm.dosage} onChange={handleNewPrescriptionFormChange} placeholder={T.prescriptionFormDosagePlaceholder || "e.g., 1 tablet twice a day"} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="prescInstructions">{T.prescriptionFormInstructions || "Instructions"}</Label>
                <Textarea id="prescInstructions" name="instructions" value={newPrescriptionForm.instructions} onChange={handleNewPrescriptionFormChange} placeholder={T.prescriptionFormInstructionsPlaceholder || "e.g., Take with food for 7 days"} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="prescDateIssued">{T.prescriptionFormDateIssued || "Date Issued"}</Label>
                <Input id="prescDateIssued" name="dateIssued" type="date" value={newPrescriptionForm.dateIssued} onChange={handleNewPrescriptionFormChange} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">{T.dialogCancelButton || "Cancel"}</Button></DialogClose>
              <Button onClick={handleSaveNewPrescription} className="transform hover:scale-105 transition-transform duration-300">{T.dialogSaveButton || "Save Prescription"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}


      {/* Add New X-Ray Dialog */}
      {(isDoctor || isLaboratory) && ( 
        <Dialog open={isAddXRayDialogOpen} onOpenChange={setIsAddXRayDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-primary flex items-center">
                <UploadCloud className="mr-2 h-6 w-6" /> {T.xrayDialogTitle || "Add New X-Ray/Scan"}
              </DialogTitle>
              <DialogDescription>
                {T.xrayDialogDescription || "Fill in the details and upload the X-Ray image."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="xrayDescription">{T.xrayDialogDescriptionLabel || "Description"}</Label>
                <Input id="xrayDescription" name="description" value={newXRayForm.description} onChange={handleNewXRayFormChange} placeholder={T.xrayDialogDescriptionPlaceholder || "e.g., Chest X-Ray, PA View"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xrayDateTaken">{T.xrayDialogDateTakenLabel || "Date Taken"}</Label>
                <Input id="xrayDateTaken" name="dateTaken" type="date" value={newXRayForm.dateTaken} onChange={handleNewXRayFormChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xrayImageFile">{T.xrayDialogImageUploadLabel || "Upload Image"}</Label>
                <Input id="xrayImageFile" name="imageFile" type="file" accept="image/*" onChange={handleImageFileChange} />
                {previewImage && <NextImage src={previewImage} alt="X-Ray Preview" width={150} height={100} className="rounded-md border mt-2" data-ai-hint="medical scan"/>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="xrayNotes">{T.xrayDialogNotesLabel || "Notes (Optional)"}</Label>
                <Textarea id="xrayNotes" name="notes" value={newXRayForm.notes || ''} onChange={handleNewXRayFormChange} placeholder={T.xrayDialogNotesPlaceholder || "Any relevant notes..."} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{T.dialogCancelButton || "Cancel"}</Button>
              </DialogClose>
              <Button onClick={handleSaveNewXRay} className="transform hover:scale-105 transition-transform duration-300">
                {T.dialogSaveButton || "Save X-Ray"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

