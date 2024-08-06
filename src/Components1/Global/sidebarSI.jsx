import React, { useEffect, useState } from 'react';
import './sidebar.css';
import { useLocation } from 'react-router-dom'; 
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname); // Initialisez avec l'URL actuelle

  useEffect(() => {
    setActiveLink(location.pathname); // Mettez à jour activeLink à chaque changement d'URL
  }, [location]);

  const handleLinkClick = (path) => {
    setActiveLink(path); // Changez activeLink
  };
  useEffect(() => {
    const toggle = document.getElementById('header-toggle');
    const nav = document.getElementById('nav-bar');
    const bodypd = document.getElementById('body-pd');
    const headerpd = document.getElementById('header');

    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('show');
        toggle.classList.toggle('bx-x');
        bodypd.classList.toggle('body-pd');
        headerpd.classList.toggle('body-pd');
      });
    }

    return () => {
      toggle.removeEventListener('click', () => {});
    };
  }, []);
  const handleIconClick = () => {
    navigate('/profil');
  };

  return (
    <div id="body-pd">
      <header className="header" id="header">
        <div className="header_toggle">
          <i className='bx bx-menu' id="header-toggle"></i>
        </div>
        <div className="header_img" onClick={handleIconClick} style={{ cursor: 'pointer' }}>
      <AccountCircleIcon sx={{ color: "white", marginTop: "5px" }} className="nav_icon" />
    </div>
      </header>
      <div className="l-navbar" id="nav-bar">
        <nav className="nav">
          <div>
            <a href="/si" className="nav_logo" style={{ color: "#B22222", textDecoration: "none" }}>
              <i className='bx bx-layer nav_logo-icon' style={{ color: "#B22222" }}></i>
              <img
                src={process.env.PUBLIC_URL + '/Assets/LOGO.png'}
                alt="Logo"
                style={{ width: "30%", height: "auto", objectFit: 'cover' }}
              />
            </a>
            <div className="nav_list">
            
           
            <a 
                href="/si" 
                className={`nav_link ${activeLink === '/si' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/si')}
              >
                <PeopleOutlineIcon className="nav_icon" />
                <span className="nav_name">Bénéficiaires</span>
              </a>
              <a 
                href="/si/numero" 
                className={`nav_link ${activeLink === '/si/numero' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/si/numero')}
              >
                <i className='bx bx-phone nav_icon'></i>
                <span className="nav_name">Numéros</span>
              </a>
              <a 
                href="/si/terminal" 
                className={`nav_link ${activeLink === '/si/terminal' ? 'active' : ''}`} 
                onClick={() => setActiveLink('/si/terminal')}
              >
                <i className='bx bx-mobile nav_icon'></i>
                <span className="nav_name">Terminaux</span>
              </a>
             
              <a href="#" className="nav_link" onClick={onLogout}>
                <i className='bx bx-log-out nav_icon'></i>
                <span className="nav_name">SignOut</span>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
