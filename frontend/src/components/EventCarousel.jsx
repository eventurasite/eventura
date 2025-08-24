// frontend/src/components/EventCarousel.jsx
import React, { useState } from 'react';
import './EventCarousel.css';

// Dados de exemplo para o carrossel
const events = [
  { id: 1, title: 'Noite Astronômica no Parque', image: '/assets/imagens/foto_evento - noite astronomica.jpg' },
  { id: 2, title: 'Festival do Queijo & Zebu', image: '/assets/imagens/foto_evento - festival de queijo.jpeg' },
  { id: 3, title: 'Festival Uberaba Games', image: '/assets/imagens/foto_evento - games.webp' },
  { id: 4, title: 'Feira de Artesanato Local', image: '/assets/imagens/eventos-4.jpg' },
  { id: 5, title: 'Encontro de Carros Antigos', image: '/assets/imagens/eventos-5.jpg' },
  { id: 6, title: 'Caminhada Ecológica', image: '/assets/imagens/eventos-6.jpg' },
];

const EventCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 3;

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
            <div key={event.id} className="event-card">
              <div className="image-container">
                <img src={event.image} alt={event.title} />
              </div>
              <h4>{event.title}</h4>
              <button className="carousel-button">Veja Mais</button>
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