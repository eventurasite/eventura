import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { groupEventsByMonth, sortMonths } from "../utils/eventUtils";
import EventCard from "../components/EventCard";
import axios from "axios";
import { toast } from "react-toastify";
import "./Agenda.css";

const API_BASE_URL = "http://localhost:5000";

// EXPORTAÇÃO DA LISTA DE CATEGORIAS
export const CATEGORIAS = [
  "Música",
  "Esportes",
  "Tecnologia",
  "Arte e Cultura",
  "Gastronomia",
  "Comédia",
];

export default function Agenda() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados dos filtros
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTicket, setSelectedTicket] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // CHAMAR O BACKEND COM FILTROS
  const fetchFilteredEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("categoria", selectedCategory);
      if (selectedMonth) params.append("mes", selectedMonth);
      if (selectedTicket) params.append("preco", selectedTicket);
      if (searchTerm) params.append("busca", searchTerm);

      const response = await axios.get(`${API_BASE_URL}/api/events/filter?${params.toString()}`);
      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao buscar eventos filtrados:", error);
      toast.error("Erro ao buscar eventos filtrados.");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events`);
        if (!response.ok) throw new Error("Erro ao carregar eventos");
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Carregando eventos...</p>;
  if (error) return <p>Erro: {error}</p>;

  const groupedEvents = groupEventsByMonth(events);
  const monthsOrder = sortMonths(groupedEvents);

  return (
    <>
      <Header />
      <div className="agenda-page-wrapper">
        <div className="agenda-content-wrapper">
          {/* Cabeçalho */}
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)} // ✅ adiciona controle
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
                onChange={(e) => setSelectedMonth(e.target.value)} // ✅ adiciona controle
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
                value={selectedTicket}
                onChange={(e) => setSelectedTicket(e.target.value)} // ✅ adiciona controle
              >
                <option value="">Selecione</option>
                <option value="gratuito">Gratuito</option>
                <option value="pago">Pago</option>
              </select>
            </div>

            <button
              className="search-button"
              title="Pesquisar"
              onClick={fetchFilteredEvents}
            >
              <i className="bi bi-search"></i> Pesquisar
            </button>
          </div>

          {/* --- Listagem --- */}
          {loading ? (
            <p>Carregando eventos...</p>
          ) : events.length === 0 ? (
            <p>Não há eventos cadastrados que correspondam aos filtros.</p>
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
