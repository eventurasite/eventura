// frontend/src/pages/MyEvents.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Reutiliza o estilo da Agenda, pois a estrutura de cards e fundo é a mesma.
import './Agenda.css'; 

const API_BASE_URL = 'http://localhost:5000';
const API_URL_MY_EVENTS = `${API_BASE_URL}/api/events/my-events`;

// Função utilitária para formatar a data
const formatDateTime = (isoDate) => {
    if (!isoDate) return 'N/A';
    // O backend retorna um campo 'data' que é a data do evento (timestamp)
    const date = new Date(isoDate); 
    const dateOptions = { day: '2-digit', month: '2-digit' };
    return date.toLocaleDateString('pt-BR', dateOptions);
};

// Função para agrupar eventos por Mês/Ano (Idêntica à Agenda)
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

// Componente Card de Evento (Adaptado para mostrar status de evento)
const EventCard = ({ event }) => {
    // A URL da imagem vem como '/uploads/nome-do-arquivo.jpg', então precisamos do URL base
    const imageUrl = event.imagemEvento?.[0]?.url 
        ? `${API_BASE_URL}${event.imagemEvento[0].url}` 
        : '/assets/imagens/default.jpg';
        
    // Lógica para colorir o badge de status
    let statusColor;
    switch (event.status) {
        case 'ativo':
            statusColor = 'green';
            break;
        case 'encerrado':
            statusColor = 'gray';
            break;
        case 'cancelado':
            statusColor = 'red';
            break;
        default:
            statusColor = 'gray';
    }
        
    return (
        <div className="agenda-event-card">
            <div className="agenda-image-container">
                <img 
                    src={imageUrl} 
                    alt={event.titulo} 
                    onError={(e) => { e.target.onerror = null; e.target.src = '/assets/imagens/default.jpg'; }}
                />
            </div>
            <h4>{event.titulo}</h4>
            <p className="event-detail">
                <strong>Data:</strong> {formatDateTime(event.data)} 
            </p>
            <p className="event-detail">
                {/* O evento agora traz o objeto categoria com a propriedade nome */}
                <strong>Categoria:</strong> {event.categoria?.nome || 'N/A'} 
            </p>
            <Link to={`/evento/${event.id_evento}`} className="agenda-button">
                Ver/Editar
            </Link>
            {/* Badge de status */}
            <span style={{ 
                fontSize: '12px', 
                fontWeight: 'bold', 
                display: 'block',
                textAlign: 'right', 
                paddingRight: '15px',
                marginTop: '10px',
                color: statusColor
            }}>
                Status: {event.status.toUpperCase()}
            </span>
        </div>
    );
};

export default function MyEvents() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyEvents = async () => {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                // Embora o ProtectedRoute já proteja, esta verificação é de boa prática.
                setIsLoading(false);
                return; 
            }

            try {
                const response = await axios.get(API_URL_MY_EVENTS, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // O response.data deve ser um array de eventos
                setEvents(response.data); 
                
            } catch (error) {
                console.error("Erro ao buscar Meus Eventos:", error);
                toast.error(error.response?.data?.message || "Não foi possível carregar seus eventos.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyEvents();
    }, []);

    // 1. Agrupamento (usa a função utilitária)
    const groupedEvents = groupEventsByMonth(events); 
    
    // 2. Ordenação dos meses (baseada na data do primeiro evento do grupo)
    const monthsOrder = Object.keys(groupedEvents).sort((a, b) => {
        // Pega a data do primeiro evento de cada grupo para ordenar os meses
        const dateA = new Date(groupedEvents[a][0].data);
        const dateB = new Date(groupedEvents[b][0].data);
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <>
            <Header />
            {/* Usa a classe agenda-page-wrapper para o fundo e centralização */}
            <div className="agenda-page-wrapper"> 
                <div className="agenda-content-wrapper">
                    
                    {/* Cabeçalho */}
                    <div className="agenda-header">
                        <h1>Meus Eventos</h1>
                        <p>Aqui você gerencia todos os eventos que você cadastrou.</p>
                        <Link 
                            to="/cadastro-evento" 
                            className="agenda-button" 
                            style={{ 
                                margin: '20px 0', 
                                display: 'inline-block', 
                                borderRadius: '8px'
                            }}
                        >
                            <i className="bi bi-plus-circle-fill" style={{ marginRight: '5px' }}></i> Novo Evento
                        </Link>
                    </div>

                    {/* Divisor após o cabeçalho */}
                    <hr className="agenda-divider" />


                    {isLoading ? (
                        <p>Carregando seus eventos...</p>
                    ) : events.length === 0 ? (
                        <p>Você não possui eventos cadastrados. <Link to="/cadastro-evento" style={{ color: 'var(--cor_3-roxo_escuro)', fontWeight: 'bold' }}>Clique aqui para começar a divulgar um!</Link></p>
                    ) : (
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
                    )}
                    
                </div>
            </div>
        </>
    );
}