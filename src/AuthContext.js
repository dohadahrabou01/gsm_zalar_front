import React, { createContext, useContext, useState } from 'react';

// Crée un contexte d'authentification
const AuthContext = createContext();

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (auth) => {
    setIsAuthenticated(auth);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useAuth = () => {
  return useContext(AuthContext);
};
