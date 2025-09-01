<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinic;

class ClinicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Clinic::create([
            'name' => 'Main Medical Center',
            'address' => '123 Healthcare Ave, Medical District',
            'phone' => '+1-555-123-4567',
            'email' => 'info@mainmedical.com',
            'description' => 'Primary healthcare facility providing comprehensive medical services',
            'is_active' => true,
        ]);

        Clinic::create([
            'name' => 'Downtown Clinic',
            'address' => '456 Business Blvd, Downtown',
            'phone' => '+1-555-987-6543',
            'email' => 'contact@downtownclinic.com',
            'description' => 'Specialized clinic serving the downtown community',
            'is_active' => true,
        ]);

        Clinic::create([
            'name' => 'Community Health Center',
            'address' => '789 Community St, Suburbia',
            'phone' => '+1-555-456-7890',
            'email' => 'hello@communityhealth.com',
            'description' => 'Community-focused healthcare center',
            'is_active' => true,
        ]);
    }
}
