// frontend/src/pages/MyEvents.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { groupEventsByMonth, sortMonths } from "../utils/eventUtils";
import "./Agenda.css";

const API_BASE_URL = "http://localhost:5000";
const API_URL_MY_EVENTS = `${API_BASE_URL}/api/events/my-events`;

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return setIsLoading(false);

      try {
        const response = await axios.get(API_URL_MY_EVENTS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Erro ao buscar Meus Eventos:", error);
        toast.error(
          error.response?.data?.message ||
            "Não foi possível carregar seus eventos."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  const groupedEvents = groupEventsByMonth(events);
  const monthsOrder = sortMonths(groupedEvents);

  return (
    <>
      <Header />
      <div className="agenda-page-wrapper">
        <div className="agenda-content-wrapper">
          <div className="agenda-header">
            <h1>Meus Eventos</h1>
            <p>Aqui você gerencia todos os eventos que você cadastrou.</p>
          </div>
          
          {/* Divisor após o cabeçalho */}
          <hr className="agenda-divider" />
          
          {/* A seção de filtros foi removida daqui */}

          {isLoading ? (
            <p>Carregando seus eventos...</p>
          ) : events.length === 0 ? (
            <p>Você não possui eventos cadastrados.</p>
          ) : (
            <div className="agenda-list">
              {monthsOrder.map((monthYear, index) => (
                <React.Fragment key={monthYear}>
                    {index > 0 && <hr className="agenda-divider" />} 
                    <div className="month-group">
                      <h1 className="month-title">{monthYear.split(" ")[0]}</h1>
                      <h2 className="year-subtitle">{monthYear.split(" ")[1]}</h2>
                      <div className="events-grid">
                        {groupedEvents[monthYear].map((event) => (
                        <EventCard
                          key={event.id_evento}
                          id={event.id_evento}
                          title={event.titulo}
                          date={event.data}
                          location={event.local}
                          category={event.categoria?.nome || "N/A"}
                          imageUrl={event.imagemEvento[0]?.url}
                        />
                      ))}
                      </div>
                    </div>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* --- Botão Novo Evento (Bem Espaçado no Final) --- */}
          <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
            <Link 
              to="/registrarevento" 
              className="agenda-button" 
              style={{ 
                borderRadius: '8px', 
                padding: '12px 30px', 
                fontSize: '16px'
              }}
            >
              <i className="bi bi-plus-circle-fill" style={{ marginRight: '8px' }}></i> Cadastrar Novo Evento
            </Link>
          </div>
          {/* ------------------------------------------- */}

        </div>
      </div>
    </>
  );
}