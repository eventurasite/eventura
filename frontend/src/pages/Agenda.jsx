import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { groupEventsByMonth, sortMonths } from "../utils/eventUtils";
import EventCard from "../components/EventCard";
import "./Agenda.css";

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
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

          {/* Filtros (ainda visuais, podem ser implementados posteriormente) */}
          <div className="agenda-filters">
            <div className="filter-group">
              <label htmlFor="categoria">Categoria</label>
              <select id="categoria" className="filter-select">
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
              <select id="mes" className="filter-select">
                <option value="">Selecione</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="ingresso">Ingresso</label>
              <select id="ingresso" className="filter-select">
                <option value="">Selecione</option>
                <option value="gratuito">Gratuito</option>
                <option value="pago">Pago</option>
              </select>
            </div>
            <button className="search-button" title="Pesquisar">
              <i className="bi bi-search"></i> Pesquisar
            </button>
          </div>

          {/* Listagem de eventos agrupados por mês */}
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
                        title={event.titulo} // O título já estava correto
                        date={event.data}
                        location={event.local}
                        category={event.categoria?.nome || "Sem categoria"}
                        // CORREÇÃO AQUI: Passando a URL da primeira imagem do array
                        imageUrl={event.imagemEvento[0]?.url} 
                      />
                    ))}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}