// client/src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // <-- 1. Importamos para leer la URL
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { FcBusinessman } from "react-icons/fc";
import { PersonData } from '../types';
import SearchForm from '../components/SearchForm';
import ResultsCard from '../components/ResultsCard';
import { useAuth } from '../context/AuthContext'; // <-- 2. Importamos useAuth para actualizar el historial
import api from '../api'; // <-- 3. Importamos nuestro cliente de API centralizado

// Reutilizamos las variantes de animación
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function HomePage(): React.JSX.Element {
  const [personData, setPersonData] = useState<PersonData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { setHistory } = useAuth(); // <-- 4. Obtenemos la función para actualizar el historial global
  const [searchParams, setSearchParams] = useSearchParams();

  // 5. EFECTO PARA BÚSQUEDA AUTOMÁTICA DESDE URL
  useEffect(() => {
    const dniFromUrl = searchParams.get('dni');
    if (dniFromUrl) {
      handleSearch(dniFromUrl);
      // Opcional: limpiar el parámetro de la URL después de la búsqueda
      setSearchParams({});
    }
  }, []); // Se ejecuta solo una vez al cargar la página

  const handleSearch = async (dni: string) => {
    setIsLoading(true);
    setPersonData(null);
    setError(null);

    try {
      // 6. Usamos nuestro cliente 'api'. Ya no necesitamos pasar el token manualmente.
      const response = await api.get(`/dni/${dni}`);
      
      if (response.data.success) {
        const foundData = response.data.data;
        setPersonData(foundData);
        toast.success('DNI encontrado con éxito');

        // 7. Guardamos en el historial usando nuestro cliente 'api'
        const historyRecord = {
          dni_consultado: foundData.numero,
          nombre_completo: `${foundData.nombres} ${foundData.apellido_paterno}`
        };
        
        // Hacemos la llamada POST para guardar en la BD
        const historyResponse = await api.post('/history', historyRecord);

        // 8. Actualizamos el estado GLOBAL del historial para que toda la app se entere
        if (historyResponse.status === 201) {
            // Suponiendo que el backend devuelve el nuevo registro, lo añadimos
            // Si no, podríamos volver a pedir el historial completo.
            // Por simplicidad, añadimos el que ya tenemos y luego el backend lo confirmará en la próxima recarga.
            setHistory(currentHistory => [historyResponse.data, ...currentHistory]);
        }
        
      } else {
        throw new Error(response.data.message || 'No se encontraron datos.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Ocurrió un error.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 9. Aplicamos las animaciones
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-8 flex flex-col items-center">
        <FcBusinessman size={60} />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-2">Verificador de DNI</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Ingresa un DNI para iniciar la consulta.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </motion.div>
      
      {/* El ResultsCard ya tiene su propia animación, así que no necesita el motion.div */}
      {personData && <ResultsCard data={personData} />}
      
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </motion.div>
  );
}

export default HomePage;