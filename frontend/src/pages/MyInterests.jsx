// frontend/src/pages/MyInterests.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { groupEventsByMonth, sortMonths } from "../utils/eventUtils";
// REMOVIDA A IMPORTAÇÃO da constante CATEGORIAS
import "./Agenda.css";

const API_BASE_URL = "http://localhost:5000";
const API_URL_MY_INTERESTS = `${API_BASE_URL}/api/events/my-interests`; 

export default function MyInterests() {
  const [events, setEvents] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  
  // --- ALTERAÇÃO 1: Novo estado para categorias dinâmicas ---
  const [categorias, setCategorias] = useState([]);

  // Estados temporários para os selects
  const [tempCategory, setTempCategory] = useState("");
  const [tempMonth, setTempMonth] = useState("");
  const [tempTicket, setTempTicket] = useState("");
  const [tempShowPastEvents, setTempShowPastEvents] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState({
    category: "",
    month: "",
    ticket: "",
    showPastEvents: false,
  });

  // Buscar eventos de interesse do usuário
  useEffect(() => {
    const fetchMyInterests = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return setIsLoading(false);

      try {
        const response = await axios.get(API_URL_MY_INTERESTS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
        handleApplyFilters(response.data);
      } catch (error) {
        console.error("Erro ao buscar Meus Interesses:", error);
        toast.error(
          error.response?.data?.message ||
            "Não foi possível carregar seus eventos de interesse."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyInterests();
  }, []);

  // --- ALTERAÇÃO 2: Novo useEffect para buscar as categorias ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/events/categories`);
        setCategorias(response.data);
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
        toast.error("Não foi possível carregar as categorias.");
      }
    };
    fetchCategories();
  }, []); // Executa apenas uma vez

  // LÓGICA DE FILTRAGEM UNIFICADA (Não muda)
  const applyFilters = (eventsToFilter = events) => {
    // ... (lógica de filtro não muda) ...
    const now = new Date().setHours(0, 0, 0, 0);
    let filtered = eventsToFilter;

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
      filtered = filtered.filter((e) => {
        const precoNum = Number(e.preco);
        return tempTicket === "gratuito" ? precoNum === 0 : precoNum > 0;
      });
    }
    setAppliedFilters({
      category: tempCategory,
      month: tempMonth,
      ticket: tempTicket,
      showPastEvents: tempShowPastEvents,
    });
    return filtered;
  };
  
  const handleApplyFilters = (initialEvents = events) => {
    const finalFiltered = applyFilters(initialEvents);
    setFilteredEventsState(finalFiltered); 
  };
  
  const [filteredEventsState, setFilteredEventsState] = useState([]);
  
  const eventsToDisplay = filteredEventsState; 
  const groupedEvents = groupEventsByMonth(eventsToDisplay);
  const monthsOrder = sortMonths(groupedEvents);

  return (
    <>
      <Header />
      <div className="agenda-page-wrapper">
        <div className="agenda-content-wrapper">
          <div className="agenda-header">
            <h1>Meus Interesses</h1>
            <p>Gerencie todos os eventos nos quais você demonstrou interesse.</p>
          </div>
          
          <hr className="agenda-divider" />
          
          {/* --- Filtros --- */}
          <div className="agenda-filters">
            <div className="filter-group">
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                className="filter-select"
                value={tempCategory}
                onChange={(e) => setTempCategory(e.target.value)}
              >
                <option value="">Todas</option>
                {/* --- ALTERAÇÃO 3: Mapeia o estado dinâmico --- */}
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.nome}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* ... (Restante dos filtros não muda) ... */}
            <div className="filter-group">
              <label htmlFor="mes">Mês</label>
              <select
                id="mes"
                className="filter-select"
                value={tempMonth}
                onChange={(e) => setTempMonth(e.target.value)}
              >
                <option value="">Todos</option>
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
                <option value="">Todos</option>
                <option value="gratuito">Gratuito</option>
                <option value="pago">Pago</option>
              </select>
            </div>

            <div className="filter-group" style={{ alignSelf: "flex-end" }}>
              <button
                className="search-button"
                title="Pesquisar"
                onClick={() => handleApplyFilters()}
              >
                <i className="bi bi-search"></i> Pesquisar
              </button>
            </div>
          </div>

          {/* ... (Restante do JSX não muda) ... */}
          <div className="agenda-filters" style={{ marginTop: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={tempShowPastEvents}
                onChange={(e) => setTempShowPastEvents(e.target.checked)}
              />{" "}
              Mostrar eventos passados
            </label>
          </div>
          
          {isLoading ? (
            <p>Carregando seus eventos de interesse...</p>
          ) : eventsToDisplay.length === 0 ? (
            <p>Você não marcou nenhum evento como de interesse.</p>
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
        </div>
      </div>
    </>
  );
}