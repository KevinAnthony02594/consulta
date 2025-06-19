// client/src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, AuthContextType, Favorite, HistoryItem, LoginData } from '../types'; // <-- 1. Importamos los nuevos tipos
import api from '../api'; // <-- Importamos la instancia de axios configurada
// 2. Tipamos el createContext para que sepa qué tipo de valor va a tener
const AuthContext = createContext<AuthContextType | null>(null);

// 3. Creamos un hook de useAuth más seguro que evita valores nulos
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
  const [favorites, setFavorites] = useState<Favorite[]>([]); // <-- Estado para favoritos
  const [history, setHistory] = useState<HistoryItem[]>([]); // <-- Estado para historial
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      if (token) {
        try {
          const headers = { 'Authorization': `Bearer ${token}` };
          // Hacemos ambas peticiones en paralelo para más eficiencia
          const [userRes, favsRes, historyRes] = await Promise.all([
            fetch('http://localhost:4000/api/users/me', { headers }),
            fetch('http://localhost:4000/api/favorites', { headers }),
            fetch('http://localhost:4000/api/history', { headers })
          ]);

          if (!userRes.ok) throw new Error('Sesión inválida.');

          const userData = await userRes.json();
          const favsData = favsRes.ok ? await favsRes.json() : [];
          const historyData = historyRes.ok ? await historyRes.json() : [];

          setUser(userData);
          setFavorites(favsData); // Guardamos los favoritos en el estado global
          setHistory(historyData); // Guardamos el historial en el estado global
        } catch (error) {
          console.error(error);
          logOut();
        }
      }
      setIsLoading(false);
    };
    fetchInitialData();
  }, [token]);

  // loginAction y logOut se quedan igual...
  const loginAction = async (data: LoginData): Promise<void> => {
      try {
        // Usamos api.post. Es más limpio y ya está configurado.
        const response = await api.post('/users/login', data);
        
        const token = response.data.token;
        if (!token) {
          throw new Error('No se recibió token del servidor.');
        }
        
        // Al hacer setToken, se disparará el useEffect que carga los datos del usuario.
        setToken(token);
        localStorage.setItem('token', token);
        
        toast.success('¡Bienvenido de vuelta!');
        navigate('/'); // Redirige al dashboard
      } catch (error: any) {
        // Axios pone los errores de API en error.response.data
        const errorMessage = error.response?.data?.message || error.message || 'Error en el inicio de sesión.';
        toast.error(errorMessage);
      }
    };
  
   // --- NUEVA FUNCIÓN DE REGISTRO ---
    const registerAction = async (data: any): Promise<boolean> => {
        const loadingToast = toast.loading('Registrando...');
        try {
            const response = await fetch('http://localhost:4000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const resData = await response.json();
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(resData.message || 'Error en el registro');
            }

            toast.success('¡Registro exitoso! Ahora inicia sesión.');
            return true; // Devuelve true para indicar éxito

        } catch (error: any) {
            toast.dismiss(loadingToast);
            toast.error(error.message);
            return false; // Devuelve false para indicar fallo
        }
    };
  
  const logOut = () => {
    setToken(null);
    setUser(null);
    setFavorites([]); // <-- AÑADIDO: Limpiamos los favoritos
    setHistory([]);   // <-- AÑADIDO: Limpiamos el historial
    localStorage.removeItem('token');
    navigate('/login');
    toast.success('Has cerrado sesión.');
  };

  // 4. Añadimos 'favorites' y 'setFavorites' al valor del contexto
  const contextValue: AuthContextType = {
    token,
    user,
    isLoading,
    isAuthenticated: !!token,
    favorites, // <-- Lo pasamos aquí
    setFavorites, // <-- Y su actualizador también
    history,
    setHistory,
    loginAction,
    registerAction, // <-- Añadimos la nueva función de registro
    logOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};