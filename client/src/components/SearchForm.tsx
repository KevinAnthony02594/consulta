import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from './Spinner';
import { FaSearch } from "react-icons/fa";

// Definimos la forma de las props que este componente recibe
interface SearchFormProps {
  onSearch: (dni: string) => void; // onSearch es una función que recibe un string y no devuelve nada
  isLoading: boolean;
}

function SearchForm({ onSearch, isLoading }: SearchFormProps): React.JSX.Element {
  const [dni, setDni] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (dni.length === 8) {
      onSearch(dni);
    } else {
      toast.error('Por favor, ingresa un DNI de 8 dígitos.');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    setDni(value);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg mb-6">
      <div className="flex items-center">
        <input
          type="text"
          className="w-full h-12 px-4 text-lg border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
          placeholder="Ingresa los 8 dígitos del DNI"
          maxLength={8}
          value={dni}
          onChange={handleChange}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="flex items-center justify-center w-36 h-12 px-6 text-white font-semibold bg-blue-600 rounded-r-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : (
            <>
              <FaSearch className="mr-2" />
              Buscar
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default SearchForm;