// frontend/src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import './Dropdown.css';

function Header() {
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const isAuthenticated = !!localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType');
  const isAdmin = userType === 'administrador';

  const handleLogout = () => {
    localStorage.clear();
    setIsDropdownOpen(false);
    navigate('/');
    window.location.reload(); 
  };

  // Esta função agora só serve para redirecionar para o login se não estiver autenticado
  const handleAccountClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  };

  return (
    <header>
      <div className="header-container">
        <Link to="/" className="header-logo">EVENTURA</Link>
        <nav className="header-nav">
          <Link to="/sobre" className="header-link">Sobre</Link>
          <Link to="/agenda" className="header-link">Agenda</Link>

          {isAdmin && <Link to="/admin" className="header-link">Painel Admin</Link>}

          {/* Container que vai escutar os eventos de mouse */}
          <div 
            className="dropdown-container"
            onMouseEnter={() => isAuthenticated && setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button onClick={handleAccountClick} className="header-button">
              Sua Conta
              <i className="bi bi-person-circle"></i>
            </button>

            {isAuthenticated && (
              <div className={`dropdown-menu ${isDropdownOpen ? 'active' : ''}`}>
                <Link to="/perfil" className="dropdown-item">Perfil</Link>
                <Link to="/meus-eventos" className="dropdown-item">Meus Eventos</Link>
                <Link to="/meus-interesses" className="dropdown-item">Meus Interesses</Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item">
                  Sair
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;