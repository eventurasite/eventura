// frontend/src/components/MainContent.jsx
import React from 'react';
import './MainContent.css';

function MainContent() {
  return (
    <main className="main-container">
      <div className="main-container-fixed">
        <div className="main-left">
          <h1>Cada Evento Uma Nova Aventura!</h1>
          <p>Encontre e Divulgue os seus eventos na cidade de Uberaba!</p>
          <div className="main-buttons">
            <button className="main-button divulgar">Divulgar</button>
            <button className="main-button encontre">
              Encontre
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
        <div className="main-right">
          <div className="image-container large-image">
            <img src="/assets/imagens/foto_1 - cidade.jpg" alt="Cidade de Uberaba" />
          </div>
          <div className="main-right-column">
            <div className="image-container small-image">
              <img src="/assets/imagens/foto_2 - show.jpg" alt="Pessoas num show" />
            </div>
            <div className="image-container smallest-image">
              <img src="/assets/imagens/foto_3 - dinossauros.jpg" alt="Dinossauro no parque" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainContent;