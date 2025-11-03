// frontend/src/components/MainContent.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MainContent.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- INÍCIO DA CORREÇÃO ---
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
  // Retorna um fallback ou imagem transparente se não houver URL
  // (para não quebrar o layout se o evento não tiver imagem)
  return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
};
// --- FIM DA CORREÇÃO ---

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
          <h1>
            Cada evento,
            <br />
            uma nova ventura!
          </h1>
          <p>Encontre e divulgue eventos na cidade de Uberaba!</p>
          <div className="main-buttons">
            <button
              className="main-button divulgar"
              onClick={() => navigate("/registrarevento")}
            >
              Divulgar
            </button>
            <button
              className="main-button encontre"
              onClick={() => navigate("/agenda")}
            >
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
                  // --- CORREÇÃO APLICADA AQUI ---
                  src={resolveImageUrl(firstEvent?.imagemEvento[0]?.url)}
                  alt={firstEvent?.titulo || "Evento"}
                />
              </div>
              <div className="main-right-column">
                <div className="image-container small-image">
                  <img
                    // --- CORREÇÃO APLICADA AQUI ---
                    src={resolveImageUrl(secondEvent?.imagemEvento[0]?.url)}
                    alt={secondEvent?.titulo || "Evento"}
                  />
                </div>
                <div className="image-container smallest-image">
                  <img
                    // --- CORREÇÃO APLICADA AQUI ---
                    src={resolveImageUrl(thirdEvent?.imagemEvento[0]?.url)}
                    alt={thirdEvent?.titulo || "Evento"}
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
