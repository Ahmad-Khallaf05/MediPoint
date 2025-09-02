<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication routes
Route::post('/auth/patient/login', [App\Http\Controllers\AuthController::class, 'patientLogin']);
Route::post('/auth/staff/login', [App\Http\Controllers\AuthController::class, 'staffLogin']);
Route::post('/auth/patient/register', [App\Http\Controllers\AuthController::class, 'patientRegister']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('/auth/profile', [App\Http\Controllers\AuthController::class, 'profile']);
});
