import apiService from './api.service';

class AuthService {
  constructor() {
    this.baseUrl = '/api/medschool/external/user/auth';
  }

  async signup(userData) {
    const response = await apiService.post(`${this.baseUrl}/signup`, userData);
    return response.data;
  }

  async signin(email, password, ipAddress = null) {
    // Get IP address if not provided
    if (!ipAddress) {
      try {
        // This is a fallback method if the IP isn't passed as a parameter
        // The backend will capture the real IP from request headers, this is just for backup
        ipAddress = sessionStorage.getItem('userIp') || 'unknown';
      } catch (error) {
        console.warn('Unable to retrieve IP address:', error);
      }
    }
    
    const response = await apiService.post(`${this.baseUrl}/signin`, { 
      email, 
      password,
      ipAddress // Send IP address to backend
    });
    
    if (response.data.accessToken) {
      apiService.setToken(response.data.accessToken);
      
      // Store additional user information
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  }

  async forgotPassword(email) {
    const response = await apiService.post(`${this.baseUrl}/forgot-password`, { 
      email 
    });
    return response.data;
  }

  async resetPassword(token, password) {
    const response = await apiService.post(`${this.baseUrl}/reset-password`, { 
      token, 
      password 
    });
    return response.data;
  }

  async verifyEmail(token) {
    const response = await apiService.get(`${this.baseUrl}/verify-email`, { 
      params: { token } 
    });
    return response.data;
  }

  async resendVerificationEmail(email) {
    const response = await apiService.post(`${this.baseUrl}/resend-verification-email`, { 
      email 
    });
    return response.data;
  }

  async enable2FA(token) {
    const response = await apiService.post(`${this.baseUrl}/enable-2fa`, { 
      token 
    });
    return response.data;
  }

  async verifyPhoneNumber(token, phoneNumber) {
    const response = await apiService.post(`${this.baseUrl}/verify-phone`, {
      token,
      phoneNumber
    });
    return response.data;
  }

  async oauthLogin(provider, token, email, ipAddress = null) {
    // Get IP address if not provided
    if (!ipAddress) {
      try {
        ipAddress = sessionStorage.getItem('userIp') || 'unknown';
      } catch (error) {
        console.warn('Unable to retrieve IP address:', error);
      }
    }
    
    const response = await apiService.post(`${this.baseUrl}/oauth-login`, { 
      provider, 
      token, 
      email,
      ipAddress // Send IP address to backend
    });
    
    if (response.data.accessToken) {
      apiService.setToken(response.data.accessToken);
      
      // Store additional user information
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  }

  async refreshToken(refreshToken) {
    const response = await apiService.post(`${this.baseUrl}/refresh-token`, { 
      refreshToken 
    });
    
    if (response.data.accessToken) {
      apiService.setToken(response.data.accessToken);
    }
    
    return response.data;
  }

  logout() {
    apiService.clearToken();
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/signin';
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get current user from JWT token
  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      // Decode JWT token (payload part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  // Check if user has a configured profile
  hasConfiguredProfile() {
    const userData = localStorage.getItem('user');
    if (!userData) return false;
    
    try {
      const user = JSON.parse(userData);
      // Check if profile contains necessary information
      // You should adapt this logic based on your data structure
      return user.profile && user.profile.firstName && user.profile.lastName;
    } catch {
      return false;
    }
  }

  // Get user's IP address from external service
  async fetchUserIp() {
    try {
      // Using ipify API to get client IP
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      
      if (data && data.ip) {
        // Store IP in session storage for later use
        sessionStorage.setItem('userIp', data.ip);
        return data.ip;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user IP:', error);
      return null;
    }
  }
}

export default new AuthService(); 