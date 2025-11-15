// frontend/src/pages/Agenda.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { groupEventsByMonth, sortMonths } from "../utils/eventUtils";
import EventCard from "../components/EventCard";
import axios from "axios";
import { toast } from "react-toastify";
import "./Agenda.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// REMOVEMOS a constante estática 'CATEGORIAS' daqui

export default function Agenda() {
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- ALTERAÇÃO 1: Novo estado para categorias dinâmicas ---
  const [categorias, setCategorias] = useState([]);

  // Estados temporários para filtros
  const [tempCategory, setTempCategory] = useState("");
  const [tempMonth, setTempMonth] = useState("");
  const [tempYear, setTempYear] = useState("");
  const [tempTicket, setTempTicket] = useState("");
  const [tempShowPastEvents, setTempShowPastEvents] = useState(false);

  // Estados definitivos exibidos na UI
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTicket, setSelectedTicket] = useState("");
  const [showPastEvents, setShowPastEvents] = useState(false);

  const applyFilters = (dadosRecebidos) => {
    // ... (A lógica interna desta função não muda) ...
    const eventosParaFiltrar = dadosRecebidos || allEvents;

    const now = new Date().setHours(0, 0, 0, 0);
    let filtered = eventosParaFiltrar;

    // Filtrar eventos futuros se checkbox não marcado
    if (!tempShowPastEvents) {
      filtered = filtered.filter((e) => new Date(e.data) >= now);
    }

    // Filtrar por categoria
    if (tempCategory) {
      filtered = filtered.filter((e) => e.categoria?.nome === tempCategory);
    }

    // Filtrar por mês
    if (tempMonth) {
      filtered = filtered.filter(
        (e) => new Date(e.data).getMonth() + 1 === parseInt(tempMonth)
      );
    }

    // Filtrar por ano
    if (tempYear) {
      filtered = filtered.filter(
        (e) => new Date(e.data).getFullYear() === parseInt(tempYear)
      );
    }

    // Filtrar por ingresso
    if (tempTicket) {
      filtered = filtered.filter((e) => {
        const precoNum = Number(e.preco);
        return tempTicket === "gratuito" ? precoNum === 0 : precoNum > 0;
      });
    }

    setSelectedCategory(tempCategory);
    setSelectedMonth(tempMonth);
    setSelectedYear(tempYear);
    setSelectedTicket(tempTicket);
    setShowPastEvents(tempShowPastEvents);
    setEvents(filtered);
  };

  // useEffect principal (busca eventos)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/events`);
        setAllEvents(response.data);
        applyFilters(response.data);
      } catch (err) {
        console.error("Erro ao carregar eventos:", err);
        setError("Não foi possível carregar os eventos.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // --- ALTERAÇÃO 2: Novo useEffect para buscar as categorias ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/events/categories`
        );
        setCategorias(response.data); // Armazena a lista vinda do banco
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
        toast.error("Não foi possível carregar as categorias.");
      }
    };

    fetchCategories();
  }, []); // Executa apenas uma vez quando o componente é montado

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

            {/* ... (Restante dos filtros de Mês e Ingresso não mudam) ... */}
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
              <button className="search-button" onClick={() => applyFilters()}>
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

          {events.length === 0 ? (
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
