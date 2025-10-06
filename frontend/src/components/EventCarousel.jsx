// frontend/src/components/EventCarousel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './EventCarousel.css';

const API_BASE_URL = "http://localhost:5000";

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/events`);
        setEvents(response.data);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleNext = () => {
    if (currentIndex < events.length - cardsPerPage) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const visibleEvents = events.slice(currentIndex, currentIndex + cardsPerPage);

  return (
    <div className="carousel-section">
      <div className="carousel-container-fixed">
        <div className="carousel-header">
          <h1>Confira os Próximos Eventos!</h1>
          <p>Confira abaixo os principais eventos em Uberaba:</p>
        </div>
        <div className="carousel-content">
          {visibleEvents.map(event => (
            <div key={event.id_evento} className="event-card">
              <div className="image-container">
                <img 
                  src={`${API_BASE_URL}${event.imagemEvento[0]?.url}`} 
                  alt={event.titulo} 
                />
              </div>
              <h4>{event.titulo}</h4>
              <Link to={`/event/${event.id_evento}`} className="carousel-button">
                Veja Mais
              </Link>
            </div>
          ))}
        </div>
        <div className="carousel-navigation">
          <button onClick={handlePrevious} disabled={currentIndex === 0}>
            <i className="bi bi-arrow-left"></i> Anterior
          </button>
          <button onClick={handleNext} disabled={currentIndex >= events.length - cardsPerPage}>
            Próximo <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCarousel;