
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth, type User, type UserRole } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import { Users, PlusCircle, Edit3, Trash2, Hospital } from 'lucide-react';
import { getSystemUsers, addSystemUser, deleteSystemUser, mockClinics, getClinicById, updateSystemUser } from '@/lib/data';
import type { Clinic } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type FormUser = Omit<User, 'id'> & { accessCode?: string; accessPassword?: string; clinicId?: string };

export default function UserManagementPage() {
  const auth = useAuth();
  const { currentTranslations } = useLanguage();
  const T = currentTranslations.adminUserManagement;
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formUser, setFormUser] = useState<FormUser>({ name: '', role: null, accessCode: '', accessPassword: '', clinicId: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadData() {
      const fetchedUsers = await getSystemUsers();
      setUsers(fetchedUsers);
      setClinics(mockClinics); 
    }
    loadData();
  }, []);

  const handleOpenAddUserDialog = () => {
    setEditingUser(null);
    setFormUser({ name: '', role: null, accessCode: '', accessPassword: '', clinicId: '' });
    setIsDialogOpen(true);
  };
  
  const handleOpenEditUserDialog = (user: User) => {
    setEditingUser(user);
    // Initialize formUser: password field is intentionally blank for editing for security.
    // It will only be updated if a new password is typed.
    setFormUser({ 
        name: user.name, 
        role: user.role, 
        accessCode: user.accessCode || '', 
        accessPassword: '', // Password field blank for editing
        clinicId: user.clinicId || '' 
    }); 
    setIsDialogOpen(true);
  };
  
  const handleSaveUser = async () => {
    if (!formUser.name || !formUser.role) {
      toast({ title: T.toastMissingFieldsTitle, description: T.toastMissingFieldsDescription, variant: 'destructive' });
      return;
    }
    if (['doctor', 'pharmacist', 'laboratory'].includes(formUser.role || '') && !formUser.clinicId) {
        toast({ title: T.toastMissingFieldsTitle, description: T.toastMissingClinicDescription || "Please assign a clinic to this user role.", variant: 'destructive' });
        return;
    }

    if (editingUser) { // Update existing user
      if (!editingUser.id) return; // Should not happen

      // Password is only updated if a new one is typed.
      const updatePayload: Partial<User> = {
        name: formUser.name,
        role: formUser.role,
        accessCode: formUser.accessCode,
        clinicId: formUser.clinicId,
      };
      if (formUser.accessPassword && formUser.accessPassword.trim() !== '') {
        updatePayload.accessPassword = formUser.accessPassword;
      }
      
      const updatedUser = await updateSystemUser(editingUser.id, updatePayload);
      if (updatedUser) {
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        toast({ title: T.toastUserUpdatedTitle || "User Updated", description: T.toastUserUpdatedDescription?.replace('{name}', updatedUser.name) || `User ${updatedUser.name} updated.` });
      } else {
        toast({ title: T.toastEditUserErrorTitle || "Update Failed", description: T.toastEditUserErrorDescription || "Failed to update user.", variant: 'destructive' });
      }

    } else { // Add new user
      if (!formUser.accessCode || !formUser.accessPassword) {
         toast({ title: T.toastMissingFieldsTitle, description: T.toastMissingFieldsFullDescription || "All fields including Access Code and Password are required for new users.", variant: 'destructive' });
         return;
      }
      const addedUser = await addSystemUser(formUser);
      setUsers(prevUsers => [...prevUsers, addedUser]);
      toast({ title: T.toastUserAddedTitle, description: T.toastUserAddedDescription.replace('{name}', addedUser.name) });
    }

    setIsDialogOpen(false);
    setEditingUser(null);
    setFormUser({ name: '', role: null, accessCode: '', accessPassword: '', clinicId: '' }); 
  };
  
  const handleDeleteUser = async (userId: string, userName: string) => {
    const confirmMessage = (T.confirmDeleteUser || 'Are you sure you want to delete user {name}?').replace('{name}', userName);
    if (confirm(confirmMessage)) {
      await deleteSystemUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast({ title: T.toastUserDeletedTitle, description: T.toastUserDeletedDescription.replace('{name}', userName), variant: 'destructive' });
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    if (!role) return T.roleNotApplicable || 'N/A';
    const roleKey = `role${role.charAt(0).toUpperCase() + role.slice(1)}` as keyof typeof T;
    return T[roleKey] || (role.charAt(0).toUpperCase() + role.slice(1));
  };
  
  const getClinicName = (clinicId?: string) => {
    if (!clinicId) return T.noClinicAssigned || 'N/A';
    const clinic = clinics.find(c => c.id === clinicId);
    return clinic?.name || clinicId;
  };


  if (auth.isLoading) {
    return <div className="flex justify-center items-center h-64"><p>{T?.loadingPage || 'Loading page...'}</p></div>;
  }

  if (!auth.user || auth.user.role !== 'admin') {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold text-destructive">{currentTranslations.adminDashboard?.accessDeniedTitle || 'Access Denied'}</h1>
        <p className="text-muted-foreground">{currentTranslations.adminDashboard?.accessDeniedDescription || 'You do not have permission to view this page.'}</p>
        <Button asChild className="mt-4">
          <Link href="/login">{currentTranslations.login?.loginTitle || 'Go to Login'}</Link>
        </Button>
      </div>
    );
  }

  const availableRoles: UserRole[] = ['doctor', 'pharmacist', 'laboratory', 'admin'];


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-3xl text-primary flex items-center">
              <Users className="mr-2 h-8 w-8" /> {T?.pageTitle || 'User Management'}
            </CardTitle>
            <CardDescription>{T?.pageDescription || 'Manage system users (doctors, pharmacists, labs, etc.).'}</CardDescription>
          </div>
          <Button onClick={handleOpenAddUserDialog} className="transform hover:scale-105 transition-transform duration-300">
            <PlusCircle className="mr-2 h-5 w-5" /> {T.addUserButton || 'Add New User'}
          </Button>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{T.tableHeaderId || 'User ID'}</TableHead>
                  <TableHead>{T.tableHeaderName || 'Name'}</TableHead>
                  <TableHead>{T.tableHeaderRole || 'Role'}</TableHead>
                  <TableHead>{T.tableHeaderClinic || 'Assigned Clinic'}</TableHead>
                  <TableHead>{T.tableHeaderAccessCode || 'Access Code'}</TableHead>
                  <TableHead>{T.tableHeaderActions || 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{getRoleDisplayName(user.role)}</TableCell>
                    <TableCell>{getClinicName(user.clinicId)}</TableCell>
                    <TableCell className="font-mono text-xs">{user.accessCode || (T.roleNotApplicable || 'N/A')}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenEditUserDialog(user)} className="hover:text-primary transition-colors">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteUser(user.id, user.name)} className="hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">{T.noUsersFound || 'No system users found.'}</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-primary">{editingUser ? T.dialogEditUserTitle : T.dialogAddUserTitle}</DialogTitle>
            <DialogDescription>
              {editingUser ? T.dialogEditUserDescription : T.dialogAddUserDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userName" className="text-right">{T.formLabelName}</Label>
              <Input
                id="userName"
                value={formUser.name}
                onChange={(e) => setFormUser(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder={T.formPlaceholderName}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userRole" className="text-right">{T.formLabelRole}</Label>
              <Select 
                value={formUser.role || ''}
                onValueChange={(value) => setFormUser(prev => ({ ...prev, role: value as UserRole }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={T.formPlaceholderRole} />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map(role => (
                    <SelectItem key={role} value={role!}>{getRoleDisplayName(role)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formUser.role && ['doctor', 'pharmacist', 'laboratory'].includes(formUser.role) && (
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="userClinic" className="text-right">{T.formLabelClinic || 'Clinic'}</Label>
                    <Select
                        value={formUser.clinicId || ""}
                        onValueChange={(value) => setFormUser(prev => ({ ...prev, clinicId: value }))}
                    >
                        <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={T.formPlaceholderClinic || "Select clinic"} />
                        </SelectTrigger>
                        <SelectContent>
                        {clinics.map(clinic => (
                            <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                 </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accessCode" className="text-right">{T.formLabelAccessCode || 'Access Code'}</Label>
              <Input
                id="accessCode"
                value={formUser.accessCode || ''}
                onChange={(e) => setFormUser(prev => ({ ...prev, accessCode: e.target.value }))}
                className="col-span-3"
                placeholder={T.formPlaceholderAccessCode || 'Enter access code'}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accessPassword" className="text-right">{T.formLabelAccessPassword || 'Password'}</Label>
              <Input
                id="accessPassword"
                type="password"
                value={formUser.accessPassword || ''}
                onChange={(e) => setFormUser(prev => ({ ...prev, accessPassword: e.target.value }))}
                className="col-span-3"
                placeholder={editingUser ? (T.formPlaceholderEditPassword || "Leave blank to keep current") : (T.formPlaceholderAccessPassword || 'Enter password')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{T.dialogCancelButton}</Button>
            <Button onClick={handleSaveUser} className="transform hover:scale-105 transition-transform duration-300">
              {editingUser ? T.dialogSaveButton : T.dialogAddButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
