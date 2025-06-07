import axios from 'axios';

// Utilisation de variables d'environnement pour l'URL de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
    
    // Création d'une instance axios avec config par défaut
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // Timeout de 10 secondes
    });
    
    // Ajout d'un intercepteur pour inclure le token à chaque requête
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Intercepteur pour gérer les erreurs et les réponses
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Gérer les erreurs d'authentification (token expiré, etc.)
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          // Rediriger vers la page de connexion si nécessaire
          // window.location.href = '/signin';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async get(endpoint, params = {}) {
    return this.axiosInstance.get(endpoint, { params });
  }

  async post(endpoint, data = {}) {
    return this.axiosInstance.post(endpoint, data);
  }

  async put(endpoint, data = {}) {
    return this.axiosInstance.put(endpoint, data);
  }

  async delete(endpoint) {
    return this.axiosInstance.delete(endpoint);
  }
}

// Exporter une instance unique du service
export default new ApiService(); 