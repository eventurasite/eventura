// frontend/src/components/MainContent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainContent.css';

function MainContent() {
  const [latestEvents, setLatestEvents] = useState([]);

  useEffect(() => {
    const fetchLatestEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events/latest');
        setLatestEvents(response.data);
      } catch (error) {
        console.error("Erro ao buscar os últimos eventos:", error);
      }
    };

    fetchLatestEvents();
  }, []);

  const [firstEvent, secondEvent, thirdEvent] = latestEvents;

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
          {/* Renderiza as imagens apenas se os dados já tiverem sido carregados */}
          {latestEvents.length > 0 && (
            <>
              <div className="image-container large-image">
                <img 
                  src={firstEvent?.imagemEvento[0]?.url || ''} 
                  alt={firstEvent?.titulo || 'Evento'} 
                />
              </div>
              <div className="main-right-column">
                <div className="image-container small-image">
                  <img 
                    src={secondEvent?.imagemEvento[0]?.url || ''} 
                    alt={secondEvent?.titulo || 'Evento'} 
                  />
                </div>
                <div className="image-container smallest-image">
                  <img 
                    src={thirdEvent?.imagemEvento[0]?.url || ''} 
                    alt={thirdEvent?.titulo || 'Evento'} 
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default MainContent;