// src/App.tsx

// 1. Importamos 'lazy' y 'Suspense' de React
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Spinner from './components/Spinner'; // Importamos nuestro spinner para el fallback

// 2. Cambiamos los imports estáticos por 'lazy' imports
const Layout = lazy(() => import('./components/Layout'));
const HomePage = lazy(() => import('./pages/HomePage'));
const HistorialPage = lazy(() => import('./pages/HistorialPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute')); // <-- Corregimos el typo aquí
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// 3. Tipamos explícitamente el retorno de la función App
function App(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center pt-10 px-4">
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      {/* 4. Envolvemos Routes con Suspense para manejar la carga de los componentes lazy */}
      <Suspense 
        fallback={
          <div className="flex justify-center items-center h-screen">
            <Spinner />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="buscar" element={<HomePage />} />
              <Route path="historial" element={<HistorialPage />} />
              <Route path="favoritos" element={<FavoritesPage />} />
              <Route path="acerca-de" element={<AboutPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;