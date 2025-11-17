// frontend/src/pages/MyInterests.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import EventCard from "../components/EventCard";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { groupEventsByMonth, sortMonths } from "../utils/eventUtils";
import "./Agenda.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL_MY_INTERESTS = `${API_BASE_URL}/api/events/my-interests`;

export default function MyInterests() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [filteredEventsState, setFilteredEventsState] = useState([]);
  
  // NOVO ESTADO PARA O COLLAPSIBLE
  const [isFilterOpen, setIsFilterOpen] = useState(false); 

  // Estados temporários dos filtros
  const [tempCategory, setTempCategory] = useState("");
  const [tempMonth, setTempMonth] = useState("");
  const [tempYear, setTempYear] = useState("");
  const [tempTicket, setTempTicket] = useState("");
  const [tempShowPastEvents, setTempShowPastEvents] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState({
    category: "",
    month: "",
    year: "",
    ticket: "",
    showPastEvents: false,
  });

  // 🔹 Carregar categorias e eventos de interesse simultaneamente
  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setEvents([]);
        setIsLoading(false);
        return;
      }

      try {
        const [catsResponse, interestsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/events/categories`),
          axios.get(API_URL_MY_INTERESTS, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCategorias(catsResponse.data);
        setEvents(interestsResponse.data);
        handleApplyFilters(interestsResponse.data);
      } catch (error) {
        console.error("Erro ao carregar Meus Interesses:", error);
        toast.error(
          error.response?.data?.message ||
            "Não foi possível carregar seus eventos de interesse."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  // 🔹 Atualiza automaticamente quando o usuário volta para a aba
  useEffect(() => {
    const handleFocus = () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      axios
        .get(API_URL_MY_INTERESTS, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setEvents(res.data))
        .catch(() => {});
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // 🔹 Lógica de filtros
  const applyFilters = (eventsToFilter = events) => {
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
    if (tempYear) {
      filtered = filtered.filter(
        (e) => new Date(e.data).getFullYear() === parseInt(tempYear)
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
      year: tempYear,
      ticket: tempTicket,
      showPastEvents: tempShowPastEvents,
    });

    return filtered;
  };

  const handleApplyFilters = (initialEvents = events) => {
    const finalFiltered = applyFilters(initialEvents);
    setFilteredEventsState(finalFiltered);
  };

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
            <p>
              Gerencie todos os eventos nos quais você demonstrou interesse.
            </p>
          </div>

          <hr className="agenda-divider" />
          
          {/* --- NOVO: BOTÃO DE FILTRO COLAPSÁVEL (Mobile Only, visível via CSS) --- */}
          <div 
            className="filter-toggle-header" 
            onClick={() => setIsFilterOpen(prev => !prev)}
          >
              <h2>Filtros <i className={`bi bi-chevron-${isFilterOpen ? 'up' : 'down'}`}></i></h2>
          </div>

          {/* CONTEÚDO DO FILTRO COLAPSÁVEL (ou permanentemente visível no desktop) */}
          <div className={`filter-collapsible-content ${isFilterOpen ? 'open' : ''}`}>

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
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.nome}>
                      {cat.nome}
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
              <label htmlFor="ano">Ano</label>
              <select
                id="ano"
                className="filter-select"
                value={tempYear}
                onChange={(e) => setTempYear(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
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

            {/* Checkbox de Eventos Passados */}
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
            
          </div>
          {/* --- FIM DO NOVO BLOCO --- */}

          {/* --- Listagem --- */}
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