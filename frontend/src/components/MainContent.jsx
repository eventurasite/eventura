// frontend/src/components/MainContent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainContent.css';

const API_BASE_URL = "http://localhost:5000";

function MainContent() {
  const [latestEvents, setLatestEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/events/latest`);
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
            <button className="main-button divulgar" onClick={() => navigate('/registrarevento')}>
              Divulgar
            </button>
            <button className="main-button encontre" onClick={() => navigate('/agenda')}>
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
                  src={`${API_BASE_URL}${firstEvent?.imagemEvento[0]?.url}`} 
                  alt={firstEvent?.titulo || 'Evento'} 
                />
              </div>
              <div className="main-right-column">
                <div className="image-container small-image">
                  <img 
                    src={`${API_BASE_URL}${secondEvent?.imagemEvento[0]?.url}`} 
                    alt={secondEvent?.titulo || 'Evento'} 
                  />
                </div>
                <div className="image-container smallest-image">
                  <img 
                    src={`${API_BASE_URL}${thirdEvent?.imagemEvento[0]?.url}`} 
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