# Medical Management System - Frontend

This is the frontend application for the Medical Management System, built with Next.js and TypeScript.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory with:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Start the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Backend Setup

Make sure the Laravel backend is running on `http://localhost:8000` with the database migrations and seeders applied.

### Backend Setup Steps:
1. Navigate to the `Backend` directory
2. Run `composer install`
3. Copy `.env.example` to `.env` and configure your database
4. Run `php artisan migrate:fresh --seed`
5. Start the server with `php artisan serve`

## Authentication

The system supports two types of authentication:

### Patient Login

### Staff Login
 

## Features

- Patient registration and login
- Staff authentication with role-based access
- Multi-language support
- Responsive design
- Real-time API communication with Laravel backend
