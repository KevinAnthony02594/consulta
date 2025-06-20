// client/src/context/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, AuthContextType, Favorite, HistoryItem, LoginData, RegisterData } from '../types'; // Asegúrate de tener RegisterData en tus tipos
import api from '../api'; // Ya lo tenías, pero confirmamos que está importado

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      if (token) {
        try {
          // --- CORREGIDO: Usamos nuestro cliente 'api' para todas las peticiones ---
          const [userRes, favsRes, historyRes] = await Promise.all([
            api.get('/users/me'),
            api.get('/favorites'),
            api.get('/history')
          ]);

          setUser(userRes.data);
          setFavorites(favsRes.data);
          setHistory(historyRes.data);

        } catch (error) {
          console.error("Error al inicializar sesión, probablemente el token expiró.", error);
          logOut(); // Limpiamos la sesión si el token es inválido
        }
      }
      setIsLoading(false);
    };
    fetchInitialData();
  }, [token]);

  const loginAction = async (data: LoginData): Promise<void> => {
    try {
      const response = await api.post('/users/login', data);
      const token = response.data.token;
      if (!token) throw new Error('No se recibió token del servidor.');
      
      setToken(token);
      localStorage.setItem('token', token);
      toast.success('¡Bienvenido de vuelta!');
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error en el inicio de sesión.';
      toast.error(errorMessage);
    }
  };
  
  // --- CORREGIDO: registerAction ahora usa el cliente 'api' ---
  const registerAction = async (data: RegisterData): Promise<boolean> => {
    const loadingToast = toast.loading('Registrando...');
    try {
      // Reemplazamos 'fetch' con 'api.post'
      await api.post('/users/register', data);

      toast.dismiss(loadingToast);
      toast.success('¡Registro exitoso! Ahora inicia sesión.');
      return true;

    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.message || 'Error en el registro.';
      toast.error(errorMessage);
      return false;
    }
  };
  
  const logOut = () => {
    setToken(null);
    setUser(null);
    setFavorites([]);
    setHistory([]);
    localStorage.removeItem('token');
    navigate('/login');
    toast.success('Has cerrado sesión.');
  };

  const contextValue: AuthContextType = {
    token,
    user,
    isLoading,
    isAuthenticated: !!token,
    favorites,
    setFavorites,
    history,
    setHistory,
    loginAction,
    registerAction,
    logOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};