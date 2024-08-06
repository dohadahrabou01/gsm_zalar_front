import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

// Auth components
import SignIn from './Components1/Auth/Login';
import Forget from './Components1/Auth/Forget';
import Reset from './Components1/Auth/ResetPassword';
import Email from './Components1/Auth/Email';
import ValidateUpdate from './Components1/ADMIN/Validate';

// Admin components
import Admin from './Components1/ADMIN/Admin';
import Comptes from './Components1/ADMIN/Compte';
import Profil from './Components1/ADMIN/Profil';
import Numeros from './Components1/ADMIN/Numero';
import Notification from './Components1/ADMIN/Notification';
import Terminals from './Components1/ADMIN/Terminal';
import Beneficiares from './Components1/ADMIN/Beneficiaire';

// Other components
import BeneficiaresTab from './Components1/Beneficiares/Beneficiare';
import SidebarAdmin from './Components1/Global/sidebar';
import SidebarDSI from './Components1/Global/sidebarDSI';
import SidebarSI from './Components1/Global/sidebarSI';
import SidebarRSI from './Components1/Global/sidebarRSI';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const [theme, colorMode] = useMode();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const expirationTime = localStorage.getItem('expirationTime');
    const currentTime = new Date().getTime();
    

    if (token && expirationTime && storedRole && currentTime < expirationTime) {
      setIsLoggedIn(true);
      setRole(storedRole);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      localStorage.removeItem('expirationTime');
      setIsLoggedIn(false);
      setRole(null);
      
    }
  }, [navigate]);

  const handleLogin = (tokenData) => {
    const currentTime = new Date().getTime();
    const expirationTime = currentTime + 60 * 60 * 1000; // 1 hour in milliseconds

    localStorage.setItem('token', tokenData.token);
    localStorage.setItem('role', tokenData.role);
    localStorage.setItem('email', tokenData.email);
    localStorage.setItem('expirationTime', expirationTime);

    setIsLoggedIn(true);
    setRole(tokenData.role);

    navigate(`/${tokenData.role.toLowerCase()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('expirationTime');
    setIsLoggedIn(false);
    setRole(null);
    navigate('/'); // Redirect to login page after logout
  };

  const renderSidebar = () => {
    switch (role) {
      case 'ADMIN':
        return <SidebarAdmin onLogout={handleLogout} />;
      case 'DSI':
        return <SidebarDSI onLogout={handleLogout} />;
      case 'SI':
        return <SidebarSI onLogout={handleLogout} />;
      case 'RSI':
        return <SidebarRSI onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  const renderRoutes = () => {
    switch (role) {
      case 'ADMIN':
        return (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/comptes" element={<Comptes />} />
            <Route path="/admin/beneficiaire" element={<Beneficiares />} />
            <Route path="/admin/numero" element={<Numeros />} />
            <Route path="/admin/terminal" element={<Terminals />} />
          </>
        );
      case 'DSI':
        return (
          <>
            <Route path="/dsi" element={<Admin />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/dsi/comptes" element={<Comptes />} />
            <Route path="/dsi/beneficiaire" element={<Beneficiares />} />
            <Route path="/dsi/numero" element={<Numeros />} />
            <Route path="/dsi/terminal" element={<Terminals />} />
          </>
        );
      case 'SI':
        return (
          <>
            <Route path="/profil" element={<Profil />} />
            <Route path="/si" element={<Beneficiares />} />
            <Route path="/si/numero" element={<Numeros />} />
            <Route path="/si/terminal" element={<Terminals />} />
          </>
        );
      case 'RSI':
        return (
          <>
            <Route path="/profil" element={<Profil />} />
            <Route path="/rsi/beneficiaire" element={<Beneficiares />} />
            <Route path="/rsi" element={<Comptes />} />
            <Route path="/rsi/numero" element={<Numeros />} />
            <Route path="/rsi/terminal" element={<Terminals />} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isLoggedIn && role && !window.location.pathname.startsWith('/reset') && !window.location.pathname.startsWith('/validateUpdate') && renderSidebar()}
          <main className="content">
            <Routes>
              {!isLoggedIn ? (
                <>
                  <Route path="/validateUpdate/:id" element={<ValidateUpdate />} />
                  <Route path="/" element={<SignIn onLogin={handleLogin} />} />
                  <Route path="/forget" element={<Forget />} />
                  <Route path="/beneficiaire" element={<BeneficiaresTab />} />
                  <Route path="/email" element={<Email />} />
                  <Route path="/reset/*" element={<Reset />} /> {/* Handle /reset/token */}
                </>
              ) : (
                renderRoutes()
              )}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
