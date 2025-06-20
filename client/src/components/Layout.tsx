// client/src/components/Layout.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa'; // Iconos para el menú móvil

import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

function Layout(): React.JSX.Element {
  const { logOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Hook para detectar cambios de ruta

  // Efecto para cerrar el menú móvil automáticamente al cambiar de página
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const getLinkClassName = ({ isActive }: { isActive: boolean }): string => {
    const baseClasses = "transition-colors hover:text-blue-500";
    const activeClasses = "text-blue-600 dark:text-blue-400 font-bold";
    const inactiveClasses = "text-gray-600 dark:text-gray-300 font-semibold";
    
    return isActive ? `${baseClasses} ${activeClasses}` : `${baseClasses} ${inactiveClasses}`;
  };

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/buscar", label: "Búsqueda" },
    { to: "/historial", label: "Historial" },
    { to: "/favoritos", label: "Favoritos" },
    { to: "/acerca-de", label: "Acerca de" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <nav className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-4 rounded-xl shadow-lg mb-6 flex justify-between items-center sticky top-4 z-50">
        <div className="text-xl font-bold text-gray-800 dark:text-white">
          <Link to="/">DNI App</Link> {/* Un logo o título */}
        </div>

        {/* --- NAVEGACIÓN PARA ESCRITORIO --- */}
        <ul className="hidden md:flex items-center gap-x-4 sm:gap-x-6 text-sm">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink to={link.to} className={getLinkClassName}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-x-4">
          <button onClick={logOut} className="text-sm font-semibold text-red-500 hover:text-red-700">Cerrar Sesión</button>
          <ThemeToggle />
        </div>

        {/* --- BOTÓN DE HAMBURGUESA PARA MÓVIL --- */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl text-gray-800 dark:text-white">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* --- PANEL DE MENÚ MÓVIL --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
          >
            <ul className="flex flex-col items-center gap-y-4">
              {navLinks.map(link => (
                <li key={link.to}>
                  <NavLink to={link.to} className={getLinkClassName}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li><hr className="my-4 w-32 border-gray-200 dark:border-gray-700"/></li>
              <li className="flex items-center justify-between w-full">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Tema</span>
                <ThemeToggle />
              </li>
              <li>
                <button onClick={logOut} className="w-full text-center mt-4 text-red-500 font-bold">
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

// Necesitas importar 'Link' también
import { Link } from 'react-router-dom';
export default Layout;