// frontend/src/components/EventCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./EventCard.css";

const API_BASE_URL = "http://localhost:5000";

const EventCard = ({ id, title, date, location, category, imageUrl }) => {
  const formatDate = (isoDate) => {
    if (!isoDate) return "Data não definida";
    return new Date(isoDate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // SOLUÇÃO DEFINITIVA: Monta a URL completa, apontando para o backend
  const fullImageUrl = imageUrl ? `${API_BASE_URL}${imageUrl}` : "/assets/imagens/default-event.jpg";

  return (
    <div className="event-card-container">
      <Link to={`/event/${id}`} className="event-card-link">
        <div className="event-card-image-wrapper">
          <img src={fullImageUrl} alt={title} className="event-card-image" />
        </div>
        <div className="event-card-content">
          <h3 className="event-card-title">{title}</h3>
          <p className="event-card-info">
            <strong>Data:</strong> {formatDate(date)} <br />
            <strong>Local:</strong> {location}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;