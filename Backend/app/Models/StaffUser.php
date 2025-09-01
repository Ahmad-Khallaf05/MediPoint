<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StaffUser extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'access_code',
        'access_password',
        'role',
        'clinic_id',
        'email',
        'phone',
        'specialization',
        'license_number',
        'is_active',
    ];

    protected $hidden = [
        'access_password',
        'remember_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
    ];

    /**
     * Get the clinic that this staff user belongs to.
     */
    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Get the user's ID as string for consistency with frontend.
     */
    public function getStringIdAttribute(): string
    {
        return (string) $this->id;
    }

    /**
     * Get the clinic ID as string for consistency with frontend.
     */
    public function getStringClinicIdAttribute(): ?string
    {
        return $this->clinic_id ? (string) $this->clinic_id : null;
    }
}
