// src/pages/EventDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./../components/Header";
import "./../pages/UserProfile.css"; // Reutiliza o estilo do container
import "./EventDetail.css";

// URL base da nossa API
const API_BASE_URL = "http://localhost:5000";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar o evento na API (com a URL correta)
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // CORREÇÃO: URL, porta e caminho ajustados para a nossa API
        const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
        if (!response.ok) {
          throw new Error("Evento não encontrado");
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Função para formatar data e hora
  const formatDate = (isoDate) => {
    if (!isoDate) return "Data indefinida";
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  // Tela de Carregamento
  if (loading) {
    return (
      <>
        <Header />
        <div className="user-profile-container" style={{ textAlign: 'center' }}>
          <p>Carregando detalhes do evento...</p>
        </div>
      </>
    );
  }

  // Tela de Evento não Encontrado
  if (!event) {
    return (
      <>
        <Header />
        <div className="user-profile-container" style={{ textAlign: 'center' }}>
          <h2>Evento Não Encontrado</h2>
          <p>O evento que você procura não existe ou foi removido.</p>
          <Link to="/agenda">Voltar para a Agenda</Link>
        </div>
      </>
    );
  }

  // Separa a imagem principal das miniaturas
  const mainImage = event.imagemEvento?.[0];
  const thumbnails = event.imagemEvento?.slice(1, 4) || [];

  return (
    <>
      <Header />
      <div className="user-profile-container">
        <div className="profile-wrapper">
          <h1 className="event-title">{event.titulo}</h1>

          <section className="event-images">
            <div className="main-image">
              {mainImage && <img src={`${API_BASE_URL}${mainImage.url}`} alt={event.titulo} />}
            </div>
            <div className="thumbnail-gallery">
              {thumbnails.map((img) => (
                <div key={img.id_imagem} className="thumbnail">
                  <img src={`${API_BASE_URL}${img.url}`} alt="Miniatura do evento" />
                </div>
              ))}
            </div>
          </section>

          <section className="event-section description-section">
            <h2>Descrição do Evento</h2>
            <p>{event.descricao}</p>
          </section>

          <section className="event-section info-section">
            <h2>Informações Gerais</h2>
            <div className="info-grid">
              <p><strong>Data e Hora:</strong> {formatDate(event.data)}</p>
              <p><strong>Local:</strong> {event.local}</p>
              <p><strong>Preço:</strong> {parseFloat(event.preco) > 0 ? `R$ ${parseFloat(event.preco).toFixed(2)}` : "Gratuito"}</p>
              <p><strong>Categoria:</strong> {event.categoria?.nome || "Não informada"}</p>
              <p><strong>Organizador:</strong> {event.organizador?.nome || "Não informado"}</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default EventDetail;