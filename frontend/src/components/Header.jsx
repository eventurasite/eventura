import React from 'react';
import './Header.css';

function Header() {
  return (
    <header>
      <div className="header-container">
        {/* Logo */}
        <a href="#" className="header-logo">
          EVENTURA
        </a>

        {/* Links de navegação */}
        <nav className="header-nav">
          <a href="#" className="header-link">Sobre</a>
          <a href="#" className="header-link">Como anunciar</a>
          <a href="#" className="header-link">Agenda</a>
          <button className="header-button">
            Sua Conta
            <i className="bi bi-person-circle"></i>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;