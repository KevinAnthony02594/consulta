// client/src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaHistory, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { HistoryItem } from '../types'; // <-- Importamos el nuevo tipo
import api from '../api'; // <-- Importamos nuestro cliente de API centralizado

// Definimos las variantes de animación como en AboutPage
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};


function DashboardPage(): React.JSX.Element {
  // 1. Obtenemos el usuario y los favoritos DIRECTAMENTE del contexto. ¡No más peticiones redundantes!
  const { user, favorites } = useAuth();
  
  // 2. Solo necesitamos un estado para el historial y la carga.
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 3. El useEffect ahora es mucho más simple: solo pide el historial.
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        // Usamos nuestro cliente 'api' que ya incluye el token
        const response = await api.get('/history?limit=5');
        setHistory(response.data);
      } catch (error) {
        toast.error('No se pudo cargar el historial reciente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Solo necesitamos cargar el historial, ya que el usuario y los favoritos ya están en el contexto.
    fetchHistory();
  }, []); // Se ejecuta solo una vez.

  if (isLoading) {
    return <p className="text-center dark:text-gray-300">Cargando dashboard...</p>;
  }

  return (
    // 4. Aplicamos las animaciones de Framer Motion
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">¡Bienvenido de vuelta, {user?.name}!</h1>
        <p className="text-gray-500 dark:text-gray-400">Aquí tienes un resumen de tu actividad.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna de Historial Reciente */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center dark:text-white"><FaHistory className="mr-2 text-blue-500"/> Historial Reciente</h3>
          {history.length > 0 ? (
            <ul className="space-y-2">{history.map(item => <li key={item.id} className="text-sm dark:text-gray-300 truncate">{item.nombre_completo}</li>)}</ul>
          ) : <p className="text-sm text-gray-500 dark:text-gray-400">No hay búsquedas recientes.</p>}
          <Link to="/historial" className="text-blue-500 hover:underline mt-4 inline-block text-sm font-semibold">Ver todo</Link>
        </div>

        {/* Columna de Favoritos Recientes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center dark:text-white"><FaStar className="mr-2 text-yellow-400"/> Favoritos Recientes</h3>
          {/* Usamos la lista de favoritos del contexto global */}
          {favorites.length > 0 ? (
            <ul className="space-y-2">{favorites.slice(0, 5).map(item => <li key={item.id} className="text-sm dark:text-gray-300 truncate">{item.nombre_completo}</li>)}</ul>
          ) : <p className="text-sm text-gray-500 dark:text-gray-400">No tienes favoritos.</p>}
          <Link to="/favoritos" className="text-blue-500 hover:underline mt-4 inline-block text-sm font-semibold">Ver todos</Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DashboardPage;