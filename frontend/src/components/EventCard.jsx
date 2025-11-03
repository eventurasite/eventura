// frontend/src/components/EventCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./EventCard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Verifica se uma URL é externa (absoluta)
 * @param {string} url
 * @returns {boolean}
 */
const isExternalUrl = (url) => {
  return url.startsWith("http://") || url.startsWith("https://");
};

const EventCard = ({ id, title, date, location, category, imageUrl }) => {
  const formatDate = (isoDate) => {
    if (!isoDate) return "Data não definida";
    return new Date(isoDate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // --- ALTERAÇÃO PRINCIPAL AQUI ---
  // Agora verificamos se a URL já é absoluta.
  // Se for, usamos como está. Se não for, adicionamos a API_BASE_URL.
  const fullImageUrl = imageUrl
    ? isExternalUrl(imageUrl)
      ? imageUrl // A URL já é completa (ex: Cloudinary), usa-a diretamente
      : `${API_BASE_URL}${imageUrl}` // A URL é relativa (ex: /uploads/..), adiciona o prefixo
    : "/assets/imagens/default-event.jpg"; // Fallback se não houver imagem

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
