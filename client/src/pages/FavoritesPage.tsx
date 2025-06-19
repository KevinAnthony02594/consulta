// client/src/pages/FavoritesPage.tsx
import React from 'react'; // <-- Ya no necesitamos useState ni useEffect aquí
import toast from 'react-hot-toast';
import { FaStar, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext'; // <-- El hook para obtener el estado global
import api from '../api'; // <-- Nuestro cliente de API centralizado

// Definimos las variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }, // Un stagger más rápido para listas
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};


function FavoritesPage(): React.JSX.Element {
  // 1. Obtenemos los favoritos y la función para actualizarlos DIRECTAMENTE del contexto.
  // ¡No más isLoading ni fetchFavorites en esta página!
  const { favorites, setFavorites } = useAuth();

  // 2. La función de eliminar ahora usa nuestro cliente 'api' y actualiza el estado global.
  const handleRemoveFavorite = async (dniToRemove: string) => {
    try {
      await api.delete(`/favorites/${dniToRemove}`);
      
      // Actualizamos el estado global para que el cambio se refleje en toda la app.
      setFavorites(currentFavorites => 
        currentFavorites.filter(fav => fav.dni_consultado !== dniToRemove)
      );
      toast.error('Favorito eliminado');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No se pudo eliminar el favorito.');
    }
  };

  // 3. La función de limpiar todo también usa 'api' y actualiza el estado global.
  const handleClearFavorites = async () => {
    try {
      await api.delete('/favorites');
      setFavorites([]); // Limpiamos el estado global
      toast.success('Se han eliminado todos los favoritos');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No se pudieron eliminar los favoritos.');
    }
  };

  return (
    // 4. Aplicamos las animaciones de Framer Motion
    <motion.div 
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
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
        <motion.ul variants={containerVariants} className="space-y-3">
          {favorites.map((fav) => (
            <motion.li
              key={fav.id}
              variants={itemVariants}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center group"
            >
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-200">{fav.nombre_completo}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">DNI: {fav.dni_consultado}</p>
              </div>
              <button 
                onClick={() => handleRemoveFavorite(fav.dni_consultado)}
                className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Eliminar favorito"
              >
                <FaTrash />
              </button>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <motion.p variants={itemVariants} className="text-center text-gray-500 dark:text-gray-400 py-8">
          Aún no has guardado ningún favorito.
          <br />
          Busca un DNI y presiona la estrella para añadirlo.
        </motion.p>
      )}
    </motion.div>
  );
}

export default FavoritesPage;