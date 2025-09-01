<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('staff_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('access_code')->unique();
            $table->string('access_password');
            $table->enum('role', ['doctor', 'pharmacist', 'laboratory', 'admin']);
            $table->foreignId('clinic_id')->nullable()->constrained('clinics')->onDelete('set null');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('specialization')->nullable(); // For doctors
            $table->text('license_number')->nullable(); // For medical professionals
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff_users');
    }
};
