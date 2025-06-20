// client/src/pages/HistorialPage.tsx
import React from 'react';
import { FaHistory } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // <-- 1. Importamos useNavigate
import api from '../api';
import toast from 'react-hot-toast';

// Las variantes de animación se quedan igual, ¡quedarán geniales con el grid!
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function HistorialPage(): React.JSX.Element {
  const { history, setHistory } = useAuth();
  const navigate = useNavigate(); // <-- 2. Inicializamos el hook

  const handleClearHistory = async () => {
    // ... (esta función se queda igual)
  };

  // 3. Función para manejar el clic en una tarjeta
  const handleCardClick = (dni: string) => {
    navigate(`/buscar?dni=${dni}`);
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
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
        // 4. APLICAMOS EL GRID AQUÍ
        // Reemplazamos 'space-y-3' por las clases de grid y gap (espaciado)
        <motion.ul 
          variants={containerVariants} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {history.map((item) => (
            // 5. HACEMOS QUE CADA TARJETA SEA INTERACTIVA
            <motion.li
              key={item.id}
              variants={itemVariants}
              onClick={() => handleCardClick(item.dni_consultado)}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              title={`Volver a buscar DNI ${item.dni_consultado}`}
            >
              <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{item.nombre_completo}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">DNI: {item.dni_consultado}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
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