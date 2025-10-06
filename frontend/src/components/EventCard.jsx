import React from "react";
import { Link } from "react-router-dom";
import "./EventCard.css"; // opcional, pra estilizar

const EventCard = ({ id, title, date, location, category, imageUrl }) => {
  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <div className="event-card">
      <div
        className="event-card-image"
        style={{ backgroundImage: `url(${imageUrl || "/default.jpg"})` }}
      ></div>

      <div className="event-card-content">
        <h3 className="event-card-title">{title}</h3>
        <p className="event-card-info">
          <strong>Data:</strong> {formatDate(date)} <br />
          <strong>Local:</strong> {location} <br />
          <strong>Categoria:</strong> {category}
        </p>

        {/* Linka para a página de detalhes */}
        <Link to={`/event/${id}`} className="event-card-button">
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
