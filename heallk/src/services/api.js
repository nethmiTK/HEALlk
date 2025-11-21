// API configuration and service functions for HEALlk frontend

const API_BASE_URL = 'http://localhost:5000/api';

// API utility functions
class ApiService {
  // Helper method to make API requests
  static async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('heallk_token');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, finalOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  static async register(userData) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  static async login(credentials) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  static async getProfile() {
    return this.makeRequest('/auth/profile');
  }

  static async updateProfile(profileData) {
    return this.makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  static async changePassword(passwordData) {
    return this.makeRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }

  static async logout() {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
    }
  }

  // Health check
  static async checkHealth() {
    return this.makeRequest('/auth/health');
  }

  static async checkServerHealth() {
    return this.makeRequest('/health');
  }

  // Token management
  static saveToken(token) {
    localStorage.setItem('heallk_token', token);
  }

  static getToken() {
    return localStorage.getItem('heallk_token');
  }

  static removeToken() {
    localStorage.removeItem('heallk_token');
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

export default ApiService;