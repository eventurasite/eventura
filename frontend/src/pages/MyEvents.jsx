// frontend/src/pages/MyEvents.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { groupEventsByMonth, sortMonths } from "../utils/eventUtils";
import { CATEGORIAS } from "./Agenda.jsx"; // Importa CATEGORIAS da Agenda
import "./Agenda.css";

const API_BASE_URL = "http://localhost:5000";
const API_URL_MY_EVENTS = `${API_BASE_URL}/api/events/my-events`;

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // ESTADOS PARA OS FILTROS
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTicket, setSelectedTicket] = useState("");

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

  // LÓGICA DE FILTRAGEM
  const filteredEvents = events.filter(event => {
    let match = true;

    // Filtrar por Categoria
    if (selectedCategory && event.categoria?.nome !== selectedCategory) {
      match = false;
    }

    // Filtrar por Mês (usando a data)
    if (selectedMonth) {
      const eventMonth = new Date(event.data).getMonth() + 1; // getMonth() é 0-base
      if (eventMonth.toString() !== selectedMonth) {
        match = false;
      }
    }

    // Filtrar por Ingresso (Gratuito/Pago)
    if (selectedTicket) {
      const isFree = parseFloat(event.preco) === 0;
      if (selectedTicket === 'gratuito' && !isFree) {
        match = false;
      } else if (selectedTicket === 'pago' && isFree) {
        match = false;
      }
    }

    return match;
  });

  const groupedEvents = groupEventsByMonth(filteredEvents); // Agrupa os eventos filtrados
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
          
          {/* --- Filtros (Com Lógica de Estado) --- */}
          <div className="agenda-filters">
            <div className="filter-group">
              <label htmlFor="categoria">Categoria</label>
              <select 
                id="categoria" 
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Selecione</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="mes">Mês</label>
              <select 
                id="mes" 
                className="filter-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Selecione</option>
                {/* Meses representados por seus números (1=Janeiro, 12=Dezembro) */}
                <option value="1">Janeiro</option>
                <option value="2">Fevereiro</option>
                <option value="3">Março</option>
                <option value="4">Abril</option>
                <option value="5">Maio</option>
                <option value="6">Junho</option>
                <option value="7">Julho</option>
                <option value="8">Agosto</option>
                <option value="9">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="ingresso">Ingresso</label>
              <select 
                id="ingresso" 
                className="filter-select"
                value={selectedTicket}
                onChange={(e) => setSelectedTicket(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="gratuito">Gratuito</option>
                <option value="pago">Pago</option>
              </select>
            </div>
            {/* O botão de pesquisa não precisa de onClick se o filtro for reativo */}
            <button className="search-button" title="Pesquisar">
              <i className="bi bi-search"></i> Pesquisar
            </button>
          </div>
          {/* Fim da seção de Filtros */}

          {isLoading ? (
            <p>Carregando seus eventos...</p>
          ) : filteredEvents.length === 0 ? (
            <p>Não há eventos cadastrados que correspondam aos filtros.</p>
          ) : (
            <div className="agenda-list">
              {monthsOrder.map((monthYear, index) => (
                <React.Fragment key={monthYear}>
                    {/* Linha divisória antes de cada mês, exceto o primeiro */}
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