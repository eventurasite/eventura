// frontend/src/pages/Agenda.jsx
import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

// Importa apenas o CSS da Agenda, que agora contém as regras de fundo e centralização.
import './Agenda.css'; 

// --- Dados Mockados para Simulação --- 
const MOCKED_EVENTS = [
    {
        id_evento: 1,
        titulo: "Noite Astronômica no Parque",
        data: "2025-10-06T19:00:00Z",
        categoria: "Tecnologia",
        url_imagem: "/assets/imagens/foto_evento - noite astronomica.jpg" 
    },
    {
        id_evento: 2,
        titulo: "Festival do Queijo & Zebu",
        data: "2025-10-20T11:00:00Z",
        categoria: "Gastronomia",
        url_imagem: "/assets/imagens/foto_evento - festival de queijo.jpeg"
    },
    {
        id_evento: 3,
        titulo: "Peirópolis - Dinossauros",
        data: "2025-10-28T09:00:00Z",
        categoria: "Arte e Cultura",
        url_imagem: "/assets/imagens/foto_3 - dinossauros.jpg"
    },
    {
        id_evento: 4,
        titulo: "Show de Rock Local",
        data: "2025-11-12T20:00:00Z",
        categoria: "Música",
        url_imagem: "/assets/imagens/foto_2 - show.jpg"
    },
    {
        id_evento: 5,
        titulo: "Caminhada Ecológica",
        data: "2025-11-16T07:30:00Z",
        categoria: "Esportes",
        url_imagem: "/assets/imagens/foto_evento - ipe.jpg"
    },
    {
        id_evento: 6,
        titulo: "Feira de Livros Raros",
        data: "2025-12-05T10:00:00Z",
        categoria: "Arte e Cultura",
        url_imagem: "/assets/imagens/foto_1 - cidade.jpg" 
    },
    {
        id_evento: 7,
        titulo: "Torneio de E-sports",
        data: "2025-10-15T14:00:00Z",
        categoria: "Tecnologia",
        url_imagem: "/assets/imagens/foto_evento - games.webp" 
    },
];

const CATEGORIAS = ["Música", "Esportes", "Tecnologia", "Arte e Cultura", "Gastronomia", "Comédia"];

// Função utilitária para formatar a data
const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    const dateOptions = { day: '2-digit', month: '2-digit' };
    return date.toLocaleDateString('pt-BR', dateOptions);
};

// Função para agrupar eventos por Mês/Ano
const groupEventsByMonth = (events) => {
    const grouped = {};
    events.forEach(event => {
        const date = new Date(event.data);
        const year = date.getFullYear();
        const monthName = date.toLocaleDateString('pt-BR', { month: 'long' });
        
        const key = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
        
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(event);
    });
    return grouped;
};


// Componente Card de Evento
const EventCard = ({ event }) => (
    <div className="agenda-event-card">
        <div className="agenda-image-container">
            <img 
                src={event.url_imagem} 
                alt={event.titulo} 
                onError={(e) => { e.target.onerror = null; e.target.src = '/assets/imagens/default.jpg'; }}
            />
        </div>
        <h4>{event.titulo}</h4>
        <p className="event-detail">
            <strong>Data:</strong> {formatDateTime(event.data)} 
        </p>
        <p className="event-detail">
            <strong>Categoria:</strong> {event.categoria} 
        </p>
        <Link to={`/evento/${event.id_evento}`} className="agenda-button">
            Veja Mais
        </Link>
    </div>
);

export default function Agenda() {
    
    // Para simulação, agrupamos os eventos mockados.
    const groupedEvents = groupEventsByMonth(MOCKED_EVENTS); 
    
    // Lógica para ordenar os meses corretamente
    const monthsOrder = Object.keys(groupedEvents).sort((a, b) => {
        const findDate = (groupKey) => MOCKED_EVENTS.find(e => {
            const date = new Date(e.data);
            const monthName = date.toLocaleDateString('pt-BR', { month: 'long' });
            return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${date.getFullYear()}` === groupKey;
        })?.data;

        const dateA = new Date(findDate(a));
        const dateB = new Date(findDate(b));
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <>
            <Header />
            {/* NOVO: Usa a classe agenda-page-wrapper para o fundo e centralização */}
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
                            <select id="categoria" className="filter-select">
                                <option value="">Selecione</option>
                                {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
                    
                    {/* Lista de Eventos Agrupados por Mês */}
                    <div className="agenda-list">
                        {monthsOrder.map((monthYear, index) => {
                            const [month, year] = monthYear.split(' ');

                            return (
                                <React.Fragment key={monthYear}>
                                    {/* Separador de Mês: Aparece ANTES de cada mês, exceto o primeiro */}
                                    {index > 0 && <hr className="agenda-divider" />} 

                                    <div className="month-group">
                                        <h1 className="month-title">{month}</h1>
                                        <h2 className="year-subtitle">{year}</h2>
                                        <div className="events-grid">
                                            {groupedEvents[monthYear].map(event => (
                                                <EventCard key={event.id_evento} event={event} />
                                            ))}
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}