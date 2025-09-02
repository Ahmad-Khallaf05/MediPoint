<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StaffUser;
use App\Models\Clinic;
use Illuminate\Support\Facades\Hash;

class StaffUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mainClinic = Clinic::where('name', 'Main Medical Center')->first();
        $downtownClinic = Clinic::where('name', 'Downtown Clinic')->first();
        $communityClinic = Clinic::where('name', 'Community Health Center')->first();

        // Admin users
        StaffUser::create([
            'name' => 'Admin User',
            'access_code' => 'ADMIN123',
            'access_password' => Hash::make('adminpass'),
            'role' => 'admin',
            'clinic_id' => $mainClinic->id,
            'email' => 'admin@mainmedical.com',
            'phone' => '+15551111111',
            'is_active' => true,
        ]);

        // Doctor users
        StaffUser::create([
            'name' => 'Dr. Sarah Johnson',
            'access_code' => 'DOCTOR123',
            'access_password' => Hash::make('password123'),
            'role' => 'doctor',
            'clinic_id' => $mainClinic->id,
            'email' => 'dr.johnson@mainmedical.com',
            'phone' => '+15552222222',
            'specialization' => 'Internal Medicine',
            'license_number' => 'MD123456',
            'is_active' => true,
        ]);

        StaffUser::create([
            'name' => 'Dr. Michael Chen',
            'access_code' => 'DOCTOR456',
            'access_password' => Hash::make('password123'),
            'role' => 'doctor',
            'clinic_id' => $downtownClinic->id,
            'email' => 'dr.chen@downtownclinic.com',
            'phone' => '+15553333333',
            'specialization' => 'Cardiology',
            'license_number' => 'MD789012',
            'is_active' => true,
        ]);

        // Pharmacist users
        StaffUser::create([
            'name' => 'Pharm. Lisa Rodriguez',
            'access_code' => 'PHARM123',
            'access_password' => Hash::make('password123'),
            'role' => 'pharmacist',
            'clinic_id' => $mainClinic->id,
            'email' => 'pharm.rodriguez@mainmedical.com',
            'phone' => '+15554444444',
            'license_number' => 'PH123456',
            'is_active' => true,
        ]);

        StaffUser::create([
            'name' => 'Pharm. David Kim',
            'access_code' => 'PHARM456',
            'access_password' => Hash::make('password123'),
            'role' => 'pharmacist',
            'clinic_id' => $communityClinic->id,
            'email' => 'pharm.kim@communityhealth.com',
            'phone' => '+15555555555',
            'license_number' => 'PH789012',
            'is_active' => true,
        ]);

        // Laboratory users
        StaffUser::create([
            'name' => 'Lab Tech. Emily Brown',
            'access_code' => 'LAB123',
            'access_password' => Hash::make('password123'),
            'role' => 'laboratory',
            'clinic_id' => $mainClinic->id,
            'email' => 'lab.brown@mainmedical.com',
            'phone' => '+15556666666',
            'license_number' => 'LT123456',
            'is_active' => true,
        ]);

        StaffUser::create([
            'name' => 'Lab Tech. Robert Wilson',
            'access_code' => 'LAB456',
            'access_password' => Hash::make('password123'),
            'role' => 'laboratory',
            'clinic_id' => $downtownClinic->id,
            'email' => 'lab.wilson@downtownclinic.com',
            'phone' => '+15557777777',
            'license_number' => 'LT789012',
            'is_active' => true,
        ]);
    }
}
