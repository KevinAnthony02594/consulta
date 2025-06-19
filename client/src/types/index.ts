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

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  favorites: Favorite[]; // <-- AÑADIDO: Un array de favoritos
  setFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>; // <-- AÑADIDO: La función para actualizarlo
  history: HistoryItem[]; // <-- AÑADIDO
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  registerAction: (data: any) => Promise<boolean>; // <-- AÑADIDO: Devuelve true si fue exitoso
  loginAction: (data: LoginData) => Promise<void>;
  logOut: () => void;
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