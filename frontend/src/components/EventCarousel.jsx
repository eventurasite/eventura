// frontend/src/components/EventCarousel.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./EventCarousel.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Verifica se uma URL é externa (absoluta)
 * @param {string} url
 * @returns {boolean}
 */
const isExternalUrl = (url) => {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
};

/**
 * Monta a URL correta para a imagem
 * @param {string | undefined} url
 * @returns {string}
 */
const resolveImageUrl = (url) => {
  if (isExternalUrl(url)) {
    return url; // URL já é absoluta (ex: Cloudinary)
  }
  if (url) {
    return `${API_BASE_URL}${url}`; // URL relativa (ex: /uploads/)
  }
  return "/assets/imagens/default-event.jpg"; // Fallback
};

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // ESTADO DINÂMICO: 3 para desktop, 1 para mobile
  const [cardsPerPage, setCardsPerPage] = useState(3); 

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
  
  // NOVO EFEITO: Calcula cardsPerPage baseado no tamanho da tela
  useEffect(() => {
    const updateCardsPerPage = () => {
        // Breakpoint para mostrar apenas 1 card
        if (window.innerWidth <= 768) { 
            setCardsPerPage(1); 
        } else {
            setCardsPerPage(3); 
        }
    };

    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

  // FUNÇÕES DE NAVEGAÇÃO AJUSTADAS PARA PULAR PELO NUMERO DE CARDS VISÍVEIS
  const handleNext = () => {
    if (currentIndex < events.length - cardsPerPage) {
      setCurrentIndex((prevIndex) => Math.min(events.length - cardsPerPage, prevIndex + cardsPerPage));
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => Math.max(0, prevIndex - cardsPerPage));
    }
  };

  const visibleEvents = events.slice(currentIndex, currentIndex + cardsPerPage);

  return (
    <div className="carousel-section">
      <div className="carousel-container-fixed">
        <div className="carousel-header">
          <h1 id="titulo">Confira os Próximos Eventos:</h1>
        </div>
        <div className="carousel-content">
          {visibleEvents.map((event) => (
            <div key={event.id_evento} className="event-card">
              <div className="image-container">
                <img
                  src={resolveImageUrl(event.imagemEvento[0]?.url)}
                  alt={event.titulo}
                />
              </div>
              <h4>{event.titulo}</h4>
              <Link
                to={`/event/${event.id_evento}`}
                className="carousel-button"
              >
                Veja Mais
              </Link>
            </div>
          ))}
        </div>
        <div className="carousel-navigation">
          <button onClick={handlePrevious} disabled={currentIndex === 0}>
            <i className="bi bi-arrow-left"></i> Anterior
          </button>
          <button
            onClick={handleNext}
            // A lógica disabled agora usa o cardsPerPage correto
            disabled={currentIndex >= events.length - cardsPerPage} 
          >
            Próximo <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCarousel;