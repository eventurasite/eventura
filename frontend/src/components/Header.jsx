// frontend/src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import "./Dropdown.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Header() {
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // NOVO: Estado do menu lateral

  const isAuthenticated = !!localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  const isAdmin = userType === "administrador";
  const userPhotoUrl = localStorage.getItem("userPhotoUrl");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  
  const handleMobileNavigation = (path) => {
    setIsMobileMenuOpen(false); // Fecha o menu
    navigate(path);
  };
  
  const handleLogout = () => {
    localStorage.clear();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false); // Fecha o menu mobile
    navigate("/");
    window.location.reload();
  };

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  };

  return (
    <header>
      <div className="header-container">
        <Link to="/" className="header-logo">
          EVENTURA
        </Link>
        
        {/* HAMBURGER ICON - VISÍVEL APENAS EM MOBILE */}
        <button className="hamburger-icon" onClick={toggleMobileMenu} aria-label="Abrir Menu">
            <i className="bi bi-list"></i>
        </button>

        <nav className="header-nav">
          {/* DESKTOP LINKS - OCULTOS EM MOBILE */}
          <Link to="/sobre" className="header-link desktop-link">
            Sobre
          </Link>
          <Link to="/agenda" className="header-link desktop-link">
            Agenda
          </Link>

          {isAdmin && (
            <Link to="/admin" className="header-link desktop-link">
              Painel Admin
            </Link>
          )}

          <div
            className="dropdown-container"
            onMouseEnter={() => isAuthenticated && setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button onClick={handleAccountClick} className="header-button">
              <span>Sua Conta</span>

              {isAuthenticated && userPhotoUrl ? (
                <img
                  src={`${API_BASE_URL}${userPhotoUrl}`}
                  alt="Avatar"
                  className="header-avatar-in-button"
                />
              ) : (
                <i className="bi bi-person-circle"></i>
              )}
            </button>

            {isAuthenticated && (
              <div
                className={`dropdown-menu ${isDropdownOpen ? "active" : ""}`}
              >
                <Link to="/profile" className="dropdown-item">
                  Perfil
                </Link>
                <Link to="/meuseventos" className="dropdown-item">
                  Meus Eventos
                </Link>
                <Link to="/meus-interesses" className="dropdown-item">
                  Meus Interesses
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item">
                  Sair
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* MENU MOBILE LATERAL (OFF-CANVAS) */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <button className="mobile-close-btn" onClick={toggleMobileMenu} aria-label="Fechar Menu">
          <i className="bi bi-x-lg"></i>
        </button>
        
        <div className="menu-links">
            <Link to="/sobre" onClick={() => handleMobileNavigation("/sobre")} className="mobile-menu-item">
                Sobre
            </Link>
            <Link to="/agenda" onClick={() => handleMobileNavigation("/agenda")} className="mobile-menu-item">
                Agenda
            </Link>
            {isAdmin && (
                <Link to="/admin" onClick={() => handleMobileNavigation("/admin")} className="mobile-menu-item">
                    Painel Admin
                </Link>
            )}
        </div>

        <div className="menu-links-auth">
            <h4 className="auth-title">Minha Conta</h4>
            {isAuthenticated ? (
                <>
                    <Link to="/profile" onClick={() => handleMobileNavigation("/profile")} className="mobile-menu-item">Perfil</Link>
                    <Link to="/meuseventos" onClick={() => handleMobileNavigation("/meuseventos")} className="mobile-menu-item">Meus Eventos</Link>
                    <Link to="/meus-interesses" onClick={() => handleMobileNavigation("/meus-interesses")} className="mobile-menu-item">Meus Interesses</Link>
                    <button onClick={handleLogout} className="mobile-menu-item logout-btn">Sair</button>
                </>
            ) : (
                <>
                    <button onClick={() => handleMobileNavigation("/login")} className="mobile-menu-item login-btn">
                        <i className="bi bi-box-arrow-in-right"></i> Entrar
                    </button>
                    <button onClick={() => handleMobileNavigation("/register")} className="mobile-menu-item register-btn">
                        <i className="bi bi-person-plus-fill"></i> Cadastrar
                    </button>
                </>
            )}
        </div>
      </div>
      {/* Overlay para fechar ao clicar fora */}
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>}
    </header>
  );
}

export default Header;