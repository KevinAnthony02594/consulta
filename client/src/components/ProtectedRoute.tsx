import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner'; // Asegúrate de importar tu Spinner

function ProtectedRoute(): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Mientras se verifica el token, mostramos un spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  // 2. Si no está autenticado, lo redirigimos a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 3. Si está autenticado, mostramos la página solicitada
  return <Outlet />;
}

export default ProtectedRoute;