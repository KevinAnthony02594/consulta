// client/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner'; // Importamos el spinner
import { FcLock } from 'react-icons/fc';

// 1. Definimos un tipo para la data de nuestro formulario
type LoginFormData = {
  email: string;
  password: string;
}

// Reutilizamos variantes de animación similares a las de otras páginas
const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};


function LoginPage(): React.JSX.Element {
  // 2. Tipamos nuestro estado del formulario
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  // 3. Añadimos un estado de carga local para el formulario
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { loginAction } = useAuth();

  // 4. Tipamos el evento 'e' del input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 5. Tipamos el evento 'e' del formulario y manejamos el estado de carga
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return; // Evita envíos múltiples

    setIsLoading(true);
    await loginAction(formData); // loginAction ya maneja los toasts
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center mb-6">
          <FcLock size={50} />
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mt-2">Iniciar Sesión</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Correo Electrónico</label>
            <input type="email" name="email" value={formData.email} placeholder="tu@correo.com" onChange={handleChange} className="w-full mt-1 px-4 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Contraseña</label>
            <input type="password" name="password" value={formData.password} placeholder="••••••••" onChange={handleChange} className="w-full mt-1 px-4 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white" required />
          </div>
          
          {/* 6. El botón ahora muestra un spinner y se deshabilita durante la carga */}
          <button 
            type="submit" 
            className="w-full flex justify-center items-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : 'Entrar'}
          </button>
        </form>
        { /*<p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          ¿No tienes una cuenta? <Link to="/register" className="text-blue-600 hover:underline font-medium">Regístrate</Link>
        </p> */} 
      </motion.div>
    </div>
  );
}
export default LoginPage;