// client/src/pages/AboutPage.tsx

// Ya no necesitamos 'import React'
import { FaInfoCircle } from 'react-icons/fa';
// 1. Importamos el componente 'motion' de Framer Motion
import { motion } from 'framer-motion';

// --- Definimos nuestras variantes de animación ---

// Variante para el contenedor principal. Orquestará la animación de sus hijos.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // 'staggerChildren' hace que cada hijo anime con un pequeño retraso
      staggerChildren: 0.1,
    },
  },
};

// Variante para cada elemento individual (título, párrafo, etc.)
const itemVariants = {
  hidden: { y: 20, opacity: 0 }, // Empieza 20px abajo y transparente
  visible: {
    y: 0,
    opacity: 1, // Termina en su posición original y opaco
    transition: {
      duration: 0.5
    }
  },
};

// Añadimos el tipo de retorno explícito
function AboutPage(): React.JSX.Element {
  return (
    // 2. Reemplazamos 'div' por 'motion.div' y aplicamos las variantes
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      variants={containerVariants}
      initial="hidden" // El estado inicial de la animación
      animate="visible" // El estado final de la animación
    >
      {/* 3. Cada hijo ahora también es un componente 'motion' y usará las variantes 'item' */}
      <motion.h2 
        variants={itemVariants} 
        className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center mb-4"
      >
        <FaInfoCircle className="mr-3 text-blue-600" />
        Acerca de la Aplicación
      </motion.h2>

      <motion.div variants={itemVariants} className="space-y-4 text-gray-600 dark:text-gray-300">
        <p>
          Esta aplicación fue desarrollada como una herramienta moderna y eficiente para realizar consultas de DNI utilizando la última tecnología del ecosistema de React.
        </p>
        
        <motion.p variants={itemVariants}>
          <strong>Tecnologías utilizadas:</strong>
        </motion.p>
        
        <motion.ul variants={itemVariants} className="list-disc list-inside ml-4 space-y-1">
          {/* También podemos animar cada 'li' individualmente si quisiéramos */}
          <li>React 19</li>
          <li>Vite como empaquetador</li>
          <li>Tailwind CSS para el diseño de la interfaz</li>
          <li>React Router para la navegación</li>
          <li>React Icons para la iconografía</li>
          <li>React Hot Toast para notificaciones</li>
        </motion.ul>

        <motion.p variants={itemVariants}>
          El objetivo es proporcionar una experiencia de usuario rápida, segura y agradable.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default AboutPage;