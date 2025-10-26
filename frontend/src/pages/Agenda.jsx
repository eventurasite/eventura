// frontend/src/pages/Agenda.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { groupEventsByMonth, sortMonths } from "../utils/eventUtils";
import EventCard from "../components/EventCard";
import axios from "axios";
import { toast } from "react-toastify";
import "./Agenda.css";

const API_BASE_URL = "http://localhost:5000";

// Lista de categorias fixa (pode substituir por fetch se quiser dinamicamente)
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

  // Estados temporários para filtros
  const [tempCategory, setTempCategory] = useState("");
  const [tempMonth, setTempMonth] = useState("");
  const [tempTicket, setTempTicket] = useState("");
  const [tempShowPastEvents, setTempShowPastEvents] = useState(false);

  // Estados definitivos exibidos na UI
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTicket, setSelectedTicket] = useState("");
  const [showPastEvents, setShowPastEvents] = useState(false);

  // --- ALTERAÇÃO 1: Modificamos a função applyFilters para aceitar dados ---
  // Ela usará os 'dadosRecebidos' se eles forem passados (no carregamento da página),
  // ou usará o estado 'allEvents' se for chamada pelo botão (sem argumentos).
  const applyFilters = (dadosRecebidos) => {
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

    // Filtrar por ingresso
    if (tempTicket) {
      filtered = filtered.filter((e) => {
        const precoNum = Number(e.preco);
        return tempTicket === "gratuito" ? precoNum === 0 : precoNum > 0;
      });
    }

    // Atualiza os filtros na UI e a lista de eventos exibida
    setSelectedCategory(tempCategory);
    setSelectedMonth(tempMonth);
    setSelectedTicket(tempTicket);
    setShowPastEvents(tempShowPastEvents);
    setEvents(filtered);
  };

  // --- ALTERAÇÃO 2: Chamamos applyFilters() dentro do useEffect ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/events`);
        setAllEvents(response.data);
        
        // ADICIONADO: Aplica o filtro inicial (para mostrar eventos futuros)
        // assim que os dados são carregados.
        applyFilters(response.data); 

      } catch (err) {
        console.error("Erro ao carregar eventos:", err);
        setError("Não foi possível carregar os eventos.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // A dependência [] está correta, só executa uma vez.


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

          {/* Filtros + Botão Pesquisar */}
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

            {/* Botão Pesquisar na mesma linha */}
            <div className="filter-group" style={{ alignSelf: "flex-end" }}>
              {/* --- ALTERAÇÃO 3: Garantir que o botão chame applyFilters sem argumentos --- */}
              <button className="search-button" onClick={() => applyFilters()}>
                <i className="bi bi-search"></i> Pesquisar
              </button>
            </div>
          </div>

          {/* Checkbox em linha separada */}
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

          {/* Listagem */}
          {/* Agora, 'events.length' será > 0 se a API retornar eventos
            e o filtro inicial (de eventos futuros) encontrar algo.
          */}
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