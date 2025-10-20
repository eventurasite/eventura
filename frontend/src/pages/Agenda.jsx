import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { groupEventsByMonth, sortMonths } from "../utils/eventUtils";
import EventCard from "../components/EventCard";
import axios from "axios";
import { toast } from "react-toastify";
import "./Agenda.css";

const API_BASE_URL = "http://localhost:5000";

export const CATEGORIAS = [
  "Música",
  "Esportes",
  "Tecnologia",
  "Arte e Cultura",
  "Gastronomia",
  "Comédia",
];

export default function Agenda() {
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros principais (só atualizam ao clicar em Pesquisar)
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTicket, setSelectedTicket] = useState("");
  const [showPastEvents, setShowPastEvents] = useState(false);

  // Filtros temporários (ligados aos selects/checkbox)
  const [tempCategory, setTempCategory] = useState("");
  const [tempMonth, setTempMonth] = useState("");
  const [tempTicket, setTempTicket] = useState("");
  const [tempShowPastEvents, setTempShowPastEvents] = useState(false);

  // Buscar eventos do backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`);
      setAllEvents(response.data);
      setEvents(
        response.data.filter(
          (e) => new Date(e.data) >= new Date().setHours(0, 0, 0, 0)
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Função para aplicar os filtros ao clicar em Pesquisar
  const applyFilters = () => {
    const now = new Date().setHours(0, 0, 0, 0);
    let filtered = allEvents;

    if (!tempShowPastEvents) {
      filtered = filtered.filter((e) => new Date(e.data) >= now);
    }

    if (tempCategory) {
      filtered = filtered.filter((e) => e.categoria?.nome === tempCategory);
    }

    if (tempMonth) {
      filtered = filtered.filter(
        (e) => new Date(e.data).getMonth() + 1 === parseInt(tempMonth)
      );
    }

    if (tempTicket) {
      filtered = filtered.filter((e) =>
        tempTicket === "gratuito" ? e.preco === 0 : e.preco > 0
      );
    }

    setSelectedCategory(tempCategory);
    setSelectedMonth(tempMonth);
    setSelectedTicket(tempTicket);
    setShowPastEvents(tempShowPastEvents);
    setEvents(filtered);
  };

  if (loading) return <p>Carregando eventos...</p>;
  if (error) return <p>Erro: {error}</p>;

  const groupedEvents = groupEventsByMonth(events);
  const monthsOrder = sortMonths(groupedEvents);

  return (
    <>
      <Header />
      <div className="agenda-page-wrapper">
        <div className="agenda-content-wrapper">
          <div className="agenda-header">
            <h1>Agenda</h1>
            <p>Confira todos os eventos!</p>
          </div>

          {/* Filtros */}
          <div className="agenda-filters">
            <div className="filter-group">
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                className="filter-select"
                value={tempCategory}
                onChange={(e) => setTempCategory(e.target.value)}
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
                value={tempMonth}
                onChange={(e) => setTempMonth(e.target.value)}
              >
                <option value="">Selecione</option>
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
                value={tempTicket}
                onChange={(e) => setTempTicket(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="gratuito">Gratuito</option>
                <option value="pago">Pago</option>
              </select>
            </div>

            <button
              className="search-button"
              title="Pesquisar"
              onClick={applyFilters}
            >
              <i className="bi bi-search"></i> Pesquisar
            </button>
          </div>

          {/* Checkbox em linha separada */}
          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={tempShowPastEvents}
                onChange={(e) => setTempShowPastEvents(e.target.checked)}
              />
              Mostrar eventos passados
            </label>
          </div>

          {/* Lista de eventos */}
          {events.length === 0 ? (
            <p>Não há eventos que correspondam aos filtros.</p>
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
                          category={event.categoria?.nome || "Sem categoria"}
                          imageUrl={event.imagemEvento[0]?.url}
                        />
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
