// client/src/pages/HistorialPage.tsx
import React from 'react';
import { FaHistory } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

// Reutilizamos las mismas variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

function HistorialPage(): React.JSX.Element {
  // 1. Obtenemos el historial y su actualizador directamente del contexto.
  const { history, setHistory } = useAuth();

  // Ya no necesitamos 'isLoading' ni 'useEffect' en esta página. ¡Más simple!

  const handleClearHistory = async () => {
    try {
      await api.delete('/history'); // Usamos nuestro cliente 'api'
      setHistory([]); // Actualizamos el estado global
      toast.success('Historial eliminado con éxito.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No se pudo eliminar el historial.');
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <FaHistory className="mr-3 text-blue-600" />
          Historial de Búsquedas
        </h2>
        {history.length > 0 && (
          <button onClick={handleClearHistory} className="text-sm text-red-500 hover:underline">
            Limpiar historial
          </button>
        )}
      </motion.div>

      {history.length > 0 ? (
        <motion.ul variants={containerVariants} className="space-y-3">
          {history.map((item) => (
            <motion.li
              key={item.id}
              variants={itemVariants}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <p className="font-semibold text-gray-700 dark:text-gray-200">{item.nombre_completo}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">DNI: {item.dni_consultado}</p>
              <p className="text-xs text-gray-400 mt-1">
                {/* Damos formato a la fecha para que sea más legible */}
                {new Date(item.search_timestamp).toLocaleDateString('es-ES', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <motion.p variants={itemVariants} className="text-center text-gray-500 dark:text-gray-400 py-8">
          No hay búsquedas en el historial.
        </motion.p>
      )}
    </motion.div>
  );
}

export default HistorialPage;