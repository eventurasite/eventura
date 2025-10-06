// frontend/src/components/MainContent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Importe o useNavigate
import axios from 'axios';
import './MainContent.css';

function MainContent() {
  const [latestEvents, setLatestEvents] = useState([]);
  const navigate = useNavigate(); // <-- Instancie o hook

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
            {/* O botão agora usa o navigate para redirecionar */}
            <button className="main-button divulgar" onClick={() => navigate('/event-registration')}>
              Divulgar
            </button>
            <button className="main-button encontre">
              Encontre
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
        <div className="main-right">
          {latestEvents.length > 0 && (
            <>
              <div className="image-container large-image">
                <img 
                  src={`http://localhost:5000${firstEvent?.imagemEvento[0]?.url}`} 
                  alt={firstEvent?.titulo} 
                />
              </div>
              <div className="main-right-column">
                <div className="image-container small-image">
                  <img 
                    src={`http://localhost:5000${secondEvent?.imagemEvento[0]?.url}`} 
                    alt={secondEvent?.titulo}
                  />
                </div>
                <div className="image-container smallest-image">
                  <img 
                    src={`http://localhost:5000${thirdEvent?.imagemEvento[0]?.url}`} 
                    alt={thirdEvent?.titulo}
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