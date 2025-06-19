// client/src/context/ThemeContext.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// --- 1. Definimos los tipos ---

// El tema solo puede ser uno de estos dos strings.
type Theme = 'light' | 'dark';

// Definimos la "forma" que tendrá el valor de nuestro contexto.
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// --- 2. Tipamos el createContext ---
// Le decimos que el contexto puede ser de tipo ThemeContextType o null al inicio.
const ThemeContext = createContext<ThemeContextType | null>(null);

// --- 3. Hacemos nuestro hook 'useTheme' más inteligente y seguro ---
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Si intentamos usar este hook fuera del Provider, lanzará un error claro.
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

// --- 4. Tipamos las props del ThemeProvider ---
interface ThemeProviderProps {
  children: ReactNode; // 'ReactNode' es el tipo correcto para 'children' en React.
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // 5. Tipamos el estado para que solo acepte 'light' o 'dark'.
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    return 'light'; // Valor por defecto
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};