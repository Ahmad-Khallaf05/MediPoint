<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed clinics first
        $this->call([
            ClinicSeeder::class,
            PatientSeeder::class,
            StaffUserSeeder::class,
        ]);
    }
}
