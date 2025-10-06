// src/pages/EventDetail.jsx
import React, { useState, useEffect } from "react";
//usar id como parametro
import { useParams } from "react-router-dom";
import Header from "./../components/Header";
// IMPORTAÇÃO CHAVE: Puxando o fundo que comprovadamente funciona
import "./../pages/Login.css";
import "./EventDetail.css";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar o evento na API
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/eventos/${id}`);
        if (!response.ok) throw new Error("Erro ao carregar evento");

        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Função auxiliar para formatar a data
  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  // Componente de Comentário (com avatar)
  const CommentBox = ({ author, text }) => (
    <div className="comment-box">
      <div className="comment-avatar"></div>
      <div className="comment-content">
        <p className="comment-author">{author}</p>
        <p className="comment-text">{text}</p>
      </div>
    </div>
  );

  // Componente de interação (curtidas, comentários etc.)
  const InteractionButton = ({ type, label }) => {
    const [isHovered, setIsHovered] = useState(false);

    const icons = {
      heart: ["bi bi-heart", "bi bi-heart-fill"],
      like: ["bi bi-hand-thumbs-up", "bi bi-hand-thumbs-up-fill"],
      comment: ["bi bi-chat-dots", "bi bi-chat-dots-fill"],
    };

    const [baseIconClass, hoverIconClass] = icons[type] || [];

    return (
      <div
        className="interaction-item"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <i className={isHovered ? hoverIconClass : baseIconClass}></i>
        <span className="interaction-label">{label}</span>
      </div>
    );
  };

  if (loading) return <p>Carregando evento...</p>;
  if (!event) return <p>Evento não encontrado.</p>;

  return (
    <>
      <Header />

      <div className="page-container">
        <h1 className="event-title">{event.titulo}</h1>

        <section className="event-images">
          <div className="main-image"></div>
          <div className="thumbnail-gallery">
            <div className="thumbnail"></div>
            <div className="thumbnail"></div>
            <div className="thumbnail"></div>
          </div>
        </section>

        <section className="event-section description-section">
          <h2>Descrição:</h2>
          <p>{event.descricao}</p>
        </section>

        <section className="event-section info-section">
          <h2>Informações Gerais:</h2>
          <div className="info-grid">
            <div className="info-column">
              <p>
                <strong>Data:</strong> {formatDate(event.data)}
              </p>
              <p>
                <strong>Local:</strong> {event.local}
              </p>
            </div>
            <div className="info-column">
              <p>
                <strong>Preço:</strong> R$ {event.preco}
              </p>
              <p>
                <strong>Categoria:</strong> {event.categoria?.nome || "—"}
              </p>
            </div>
          </div>
        </section>

        <section className="event-section action-buttons">
          <div className="interactions-container">
            <InteractionButton type="heart" label="Curtidas" />
            <InteractionButton type="like" label="Interesses" />
            <InteractionButton type="comment" label="Comentários" />
          </div>
        </section>

        <section className="add-comment-section">
          <h2>Adicionar Comentário</h2>
          <div className="comment-input-wrapper">
            <textarea
              placeholder="Escreva seu comentário aqui..."
              className="comment-input"
            ></textarea>
            <button className="submit-comment-btn">Comentar</button>
          </div>
        </section>

        <section className="event-section comments-section">
          <h2>Comentários:</h2>

          <CommentBox
            author="Ana Maria"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
          />

          <CommentBox
            author="João"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
          />
        </section>
      </div>
    </>
  );
};

export default EventDetail;
