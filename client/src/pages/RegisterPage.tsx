// client/src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { FcGraduationCap } from 'react-icons/fc';
import { RegisterData } from '../types'; // <-- 1. IMPORTAMOS el tipo global

// 2. ELIMINAMOS la 'interface' que estaba aquí. Ya no la necesitamos.

const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function RegisterPage(): React.JSX.Element {
  // 3. Usamos nuestro tipo 'RegisterData' importado
  const [formData, setFormData] = useState<RegisterData>({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { registerAction } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    // Le pasamos el formData, que TypeScript ya sabe que es del tipo 'RegisterData'
    const success = await registerAction(formData);
    setIsLoading(false);

    if (success) {
      navigate('/login');
    }
  };

  return (
    // El JSX se queda exactamente igual
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center mb-6">
          <FcGraduationCap size={50} />
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mt-2">Crear Cuenta</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Nombre Completo</label>
            <input type="text" name="name" value={formData.name} placeholder="Tu nombre" onChange={handleChange} className="w-full mt-1 px-4 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Correo Electrónico</label>
            <input type="email" name="email" value={formData.email} placeholder="tu@correo.com" onChange={handleChange} className="w-full mt-1 px-4 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Contraseña</label>
            <input type="password" name="password" value={formData.password} placeholder="••••••••" onChange={handleChange} className="w-full mt-1 px-4 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white" required />
          </div>
          <button 
            type="submit" 
            className="w-full flex justify-center items-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : 'Registrarse'} 
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:underline font-medium">Inicia Sesión</Link>
        </p>
      </motion.div>
    </div>
  );
}
export default RegisterPage;