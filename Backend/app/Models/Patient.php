<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Patient extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'phone',
        'password',
        'date_of_birth',
        'gender',
        'address',
        'emergency_contact',
        'medical_history',
        'allergies',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_active' => 'boolean',
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the user's role.
     */
    public function getRoleAttribute(): string
    {
        return 'patient';
    }

    /**
     * Get the user's ID as string for consistency with frontend.
     */
    public function getStringIdAttribute(): string
    {
        return (string) $this->id;
    }
}
