// API service for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    role: string;
    phone?: string;
    access_code?: string;
    clinic_id?: string;
    specialization?: string;
    license_number?: string;
  };
  token: string;
}

interface RegisterResponse {
  user: {
    id: string;
    name: string;
    role: string;
    phone: string;
  };
  token: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Patient login
  async patientLogin(phone: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/patient/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Login failed');
    }
    
    return response.data;
  }

  // Staff login
  async staffLogin(accessCode: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/staff/login', {
      method: 'POST',
      body: JSON.stringify({ access_code: accessCode, password }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Login failed');
    }
    
    return response.data;
  }

  // Patient registration
  async patientRegister(userData: {
    name: string;
    phone: string;
    password: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    emergency_contact?: string;
    medical_history?: string;
    allergies?: string;
  }): Promise<RegisterResponse> {
    const response = await this.request<RegisterResponse>('/auth/patient/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Registration failed');
    }
    
    return response.data;
  }

  // Logout
  async logout(token: string): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Get user profile
  async getProfile(token: string): Promise<any> {
    const response = await this.request('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get profile');
    }
    
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
