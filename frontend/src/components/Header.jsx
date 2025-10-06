// frontend/src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import "./Dropdown.css";

const API_BASE_URL = "http://localhost:5000";

function Header() {
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isAuthenticated = !!localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  const isAdmin = userType === "administrador";
  const userPhotoUrl = localStorage.getItem("userPhotoUrl");

  const handleLogout = () => {
    localStorage.clear();
    setIsDropdownOpen(false);
    navigate("/");
    window.location.reload();
  };

  // Esta função agora apenas ativa o dropdown ou redireciona para o login
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
        <nav className="header-nav">
          <Link to="/sobre" className="header-link">
            Sobre
          </Link>
          <Link to="/agenda" className="header-link">
            Agenda
          </Link>

          {isAdmin && (
            <Link to="/admin" className="header-link">
              Painel Admin
            </Link>
          )}

          <div
            className="dropdown-container"
            onMouseEnter={() => isAuthenticated && setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            {/* --- O BOTÃO AGORA SEMPRE EXISTE, SÓ O CONTEÚDO MUDA --- */}
            <button onClick={handleAccountClick} className="header-button">
              <span>Sua Conta</span>

              {isAuthenticated && userPhotoUrl ? (
                // Se logado e com foto, mostra a <img>
                <img
                  src={`${API_BASE_URL}${userPhotoUrl}`}
                  alt="Avatar"
                  className="header-avatar-in-button"
                />
              ) : (
                // Caso contrário (logado sem foto ou deslogado), mostra o ícone
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
    </header>
  );
}

export default Header;
