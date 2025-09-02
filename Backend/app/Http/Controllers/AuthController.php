<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\StaffUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Patient login with phone and password
     */
    public function patientLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $patient = Patient::where('phone', $request->phone)
            ->where('is_active', true)
            ->first();

        if (!$patient || !Hash::check($request->password, $patient->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid phone number or password'
            ], 401);
        }

        $token = $patient->createToken('patient-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => [
                    'id' => (string) $patient->id,
                    'name' => $patient->name,
                    'role' => 'patient',
                    'phone' => $patient->phone,
                ],
                'token' => $token,
            ]
        ]);
    }

    /**
     * Staff login with access code and password
     */
    public function staffLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'access_code' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $staff = StaffUser::where('access_code', $request->access_code)
            ->where('is_active', true)
            ->first();

        if (!$staff || !Hash::check($request->password, $staff->access_password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid access code or password'
            ], 401);
        }

        // Update last login time
        $staff->update(['last_login_at' => now()]);

        $token = $staff->createToken('staff-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => [
                    'id' => (string) $staff->id,
                    'name' => $staff->name,
                    'role' => $staff->role,
                    'access_code' => $staff->access_code,
                    'clinic_id' => $staff->string_clinic_id,
                    'specialization' => $staff->specialization,
                    'license_number' => $staff->license_number,
                ],
                'token' => $token,
            ]
        ]);
    }

    /**
     * Patient registration
     */
    public function patientRegister(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:patients,phone',
            'password' => 'required|string|min:6',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $patient = Patient::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'address' => $request->address,
            'emergency_contact' => $request->emergency_contact,
            'medical_history' => $request->medical_history,
            'allergies' => $request->allergies,
            'is_active' => true,
        ]);

        $token = $patient->createToken('patient-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'data' => [
                'user' => [
                    'id' => (string) $patient->id,
                    'name' => $patient->name,
                    'role' => 'patient',
                    'phone' => $patient->phone,
                ],
                'token' => $token,
            ]
        ], 201);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get current user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        if ($user instanceof Patient) {
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => (string) $user->id,
                    'name' => $user->name,
                    'role' => 'patient',
                    'phone' => $user->phone,
                    'date_of_birth' => $user->date_of_birth,
                    'gender' => $user->gender,
                    'address' => $user->address,
                    'emergency_contact' => $user->emergency_contact,
                    'medical_history' => $user->medical_history,
                    'allergies' => $user->allergies,
                ]
            ]);
        }

        if ($user instanceof StaffUser) {
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => (string) $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'access_code' => $user->access_code,
                    'clinic_id' => $user->string_clinic_id,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'specialization' => $user->specialization,
                    'license_number' => $user->license_number,
                    'clinic' => $user->clinic,
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unknown user type'
        ], 400);
    }
}
