import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

function Layout(): React.JSX.Element {
  const { logOut } = useAuth();
  
  // Tipamos el parámetro de la función para que TypeScript sepa qué es 'isActive'
  const getLinkClassName = ({ isActive }: { isActive: boolean }): string => {
    const baseClasses = "transition-colors hover:text-blue-500";
    const activeClasses = "text-blue-600 dark:text-blue-400 font-bold underline";
    const inactiveClasses = "text-gray-600 dark:text-gray-300 font-semibold";
    
    return isActive ? `${baseClasses} ${activeClasses}` : `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <div className="w-full max-w-2xl">
      <nav className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg mb-6 flex justify-between items-center">
        <ul className="flex justify-center gap-x-4 sm:gap-x-6 text-sm sm:text-base">
          <li><NavLink to="/" className={getLinkClassName}>Dashboard</NavLink></li>
          <li><NavLink to="/buscar" className={getLinkClassName}>Búsqueda</NavLink></li>
          <li><NavLink to="/historial" className={getLinkClassName}>Historial</NavLink></li>
          <li><NavLink to="/favoritos" className={getLinkClassName}>Favoritos</NavLink></li>
          <li><NavLink to="/acerca-de" className={getLinkClassName}>Acerca de</NavLink></li>
        </ul>
        
        <div className="flex items-center gap-x-4">
          <button onClick={logOut} className="text-sm font-semibold text-red-500 hover:text-red-700">Logout</button>
          <ThemeToggle />
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;