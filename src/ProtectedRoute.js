import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adapter selon votre structure
 // Assurez-vous que le chemin est correct

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <div style={{ display: 'flex' }}>
     
      <div style={{ marginLeft: '250px', padding: '20px' }}>
        {children}
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
