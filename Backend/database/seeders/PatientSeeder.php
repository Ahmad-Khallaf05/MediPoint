<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;
use Illuminate\Support\Facades\Hash;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Patient::create([
            'name' => 'John Doe',
            'phone' => '+15551234567',
            'password' => Hash::make('password123'),
            'date_of_birth' => '1990-05-15',
            'gender' => 'male',
            'address' => '123 Main St, Anytown, USA',
            'emergency_contact' => '+15559876543',
            'medical_history' => 'No significant medical history',
            'allergies' => 'None known',
            'is_active' => true,
        ]);

        Patient::create([
            'name' => 'Jane Smith',
            'phone' => '+15551234568',
            'password' => Hash::make('password123'),
            'date_of_birth' => '1985-08-22',
            'gender' => 'female',
            'address' => '456 Oak Ave, Somewhere, USA',
            'emergency_contact' => '+15559876544',
            'medical_history' => 'Asthma, controlled with medication',
            'allergies' => 'Penicillin',
            'is_active' => true,
        ]);

        Patient::create([
            'name' => 'Mike Johnson',
            'phone' => '+15551234569',
            'password' => Hash::make('password123'),
            'date_of_birth' => '1978-12-10',
            'gender' => 'male',
            'address' => '789 Pine Rd, Elsewhere, USA',
            'emergency_contact' => '+15559876545',
            'medical_history' => 'Hypertension, managed with medication',
            'allergies' => 'None known',
            'is_active' => true,
        ]);

        Patient::create([
            'name' => 'Sarah Wilson',
            'phone' => '+15551234570',
            'password' => Hash::make('password123'),
            'date_of_birth' => '1992-03-28',
            'gender' => 'female',
            'address' => '321 Elm St, Nowhere, USA',
            'emergency_contact' => '+15559876546',
            'medical_history' => 'Diabetes type 2, well controlled',
            'allergies' => 'Sulfa drugs',
            'is_active' => true,
        ]);
    }
}
