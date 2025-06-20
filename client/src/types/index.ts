// client/src/types/index.ts

export interface PersonData {
  numero: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: string;
  sexo: string;
  direccion_completa: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Favorite {
  id: number;
  user_id: number;
  dni_consultado: string;
  nombre_completo: string;
  created_at: string;
}

export interface HistoryItem {
  id: number;
  user_id: number;
  dni_consultado: string;
  nombre_completo: string;
  search_timestamp: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// --- 1. AÑADIMOS EL NUEVO TIPO PARA EL FORMULARIO DE REGISTRO ---
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ResultsCardProps {
  data: PersonData;
}

export interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  className?: string;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  favorites: Favorite[];
  setFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>;
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  registerAction: (data: RegisterData) => Promise<boolean>; 
  loginAction: (data: LoginData) => Promise<void>;
  logOut: () => void;
}