// client/src/pages/FavoritesPage.tsx
import React from 'react';
import toast from 'react-hot-toast';
import { FaStar, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // <-- 1. Importamos useNavigate

import { useAuth } from '../context/AuthContext';
import api from '../api';

// Las variantes de animación se quedan igual
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function FavoritesPage(): React.JSX.Element {
  const { favorites, setFavorites } = useAuth();
  const navigate = useNavigate(); // <-- 2. Inicializamos el hook

  const handleRemoveFavorite = async (dniToRemove: string) => {
    // ... (esta función se queda igual)
  };

  const handleClearFavorites = async () => {
    // ... (esta función se queda igual)
  };

  // 3. Nueva función para manejar el clic en una tarjeta de favorito
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
          <FaStar className="mr-3 text-yellow-400" />
          Mis DNI Favoritos
        </h2>
        {favorites.length > 0 && (
          <button onClick={handleClearFavorites} className="text-sm text-red-500 hover:underline">
            Limpiar todo
          </button>
        )}
      </motion.div>

     {favorites.length > 0 ? (
        <motion.ul variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <motion.li
              key={fav.id}
              variants={itemVariants}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg group transition-shadow hover:shadow-lg"
            >
              {/* Este es el contenedor que vamos a corregir */}
              <div className="flex justify-between items-start gap-2">

                {/* --- CAMBIO PRINCIPAL AQUÍ --- */}
                <div 
                  className="flex-1 min-w-0 cursor-pointer" // Reemplazamos 'w-full' por 'flex-1' y 'min-w-0'
                  onClick={() => handleCardClick(fav.dni_consultado)}
                  title={`Volver a buscar DNI ${fav.dni_consultado}`}
                >
                  <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{fav.nombre_completo}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">DNI: {fav.dni_consultado}</p>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Esto sigue siendo crucial
                    handleRemoveFavorite(fav.dni_consultado);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Eliminar favorito"
                >
                  <FaTrash />
                </button>

              </div>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <motion.p variants={itemVariants} className="text-center text-gray-500 dark:text-gray-400 py-8">
          Aún no has guardado ningún favorito.
        </motion.p>
      )}
    </motion.div>
  );
}

export default FavoritesPage;