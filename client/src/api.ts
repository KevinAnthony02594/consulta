// client/src/api.ts
import axios from 'axios';

const api = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
});

// Esto es un "interceptor". Es una función que se ejecuta ANTES de cada petición.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Si hay un token, lo añade a los headers de la petición.
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;