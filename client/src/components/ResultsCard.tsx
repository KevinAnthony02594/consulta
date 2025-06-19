// client/src/components/ResultsCard.tsx
import React from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { PersonData } from '../types';
import { FaUser, FaIdCard, FaBirthdayCake, FaUserCheck, FaMapMarkerAlt, FaGlobeAmericas, FaCity, FaBuilding, FaRegAddressCard, FaStar, FaRegStar, FaCopy } from "react-icons/fa";

interface ResultsCardProps {
  data: PersonData;
}

// Tipamos las props del InfoField para mayor seguridad
interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  className?: string; // Hacemos className opcional
}

const InfoField = ({ icon, label, value, className = '' }: InfoFieldProps) => {
  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success(`'${label}' copiado al portapapeles`);
  };

  return (
    <div>
      <p className="text-sm text-gray-500 flex items-center">{icon}<span className="ml-2">{label}</span></p>
      <div className="flex items-center justify-between">
        <p className={`font-medium text-gray-800 dark:text-gray-200 mt-1 ${className}`}>{value || 'No registrado'}</p>
        {value && (<button onClick={handleCopy} className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full"><FaCopy /></button>)}
      </div>
    </div>
  );
};

const calcularEdad = (fechaStr: string): number | null => {
  if (!fechaStr || !fechaStr.includes('/')) return null;
  const [dia, mes, anio] = fechaStr.split('/');
  const nacimiento = new Date(`${anio}-${mes}-${dia}T00:00:00`);
  if (isNaN(nacimiento)) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

function ResultsCard({ data }: ResultsCardProps): React.JSX.Element {
  const { favorites, setFavorites } = useAuth();
  const isFavorite = favorites.some(fav => fav.dni_consultado === data.numero);

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('token');
    
    try {
      if (isFavorite) {
        const response = await fetch(`http://localhost:4000/api/favorites/${data.numero}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('No se pudo quitar de favoritos.');
        setFavorites(favorites.filter(fav => fav.dni_consultado !== data.numero));
        toast.error('Quitado de favoritos');
      } else {
        const favoriteRecord = {
          dni_consultado: data.numero,
          nombre_completo: `${data.nombres} ${data.apellido_paterno} ${data.apellido_materno}`,
        };
        const response = await fetch('http://localhost:4000/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
          body: JSON.stringify(favoriteRecord),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'No se pudo añadir a favoritos.');
        }
        const newFavoriteFromServer = await response.json();
        setFavorites([newFavoriteFromServer, ...favorites]);
        toast.success('¡Añadido a favoritos!');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const edad = calcularEdad(data.fecha_nacimiento);
  const edadClassName = edad !== null && edad < 18 ? 'text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-300 px-2 py-1 rounded-md inline-block' : '';

  // Corregimos y restauramos el array de fields
  const fields = [
    { icon: <FaUser />, label: 'Nombre Completo', value: `${data.nombres} ${data.apellido_paterno} ${data.apellido_materno}`, fullWidth: true },
    { icon: <FaIdCard />, label: 'DNI', value: data.numero },
    { icon: <FaBirthdayCake />, label: 'Fecha de Nacimiento', value: data.fecha_nacimiento },
    { icon: <FaUserCheck />, label: 'Edad', value: edad !== null ? `${edad} años` : 'N/A', className: edadClassName },
    { icon: <FaMapMarkerAlt />, label: 'Dirección', value: data.direccion_completa, fullWidth: true },
    { icon: <FaGlobeAmericas />, label: 'Departamento', value: data.departamento },
    { icon: <FaCity />, label: 'Provincia', value: data.provincia },
    { icon: <FaBuilding />, label: 'Distrito', value: data.distrito },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-fade-in-down">
      <div className="bg-blue-600 text-white p-4 text-lg font-semibold flex items-center justify-between">
        <div className='flex items-center'>
          <FaRegAddressCard className="mr-3" />
          Resultados de la Búsqueda
        </div>
        <button 
          onClick={handleToggleFavorite} 
          className="text-2xl hover:scale-125 transition-transform"
          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          {isFavorite ? <FaStar className="text-yellow-300" /> : <FaRegStar />}
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {fields.map((field) => (
          <div key={field.label} className={field.fullWidth ? 'md:col-span-2' : ''}>
            <InfoField
              icon={field.icon}
              label={field.label}
              value={field.value}
              className={field.className}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsCard;