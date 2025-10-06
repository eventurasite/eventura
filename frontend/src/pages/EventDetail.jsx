// src/pages/EventDetail.jsx

import React, { useState } from 'react'; 
import Header from './../components/Header'; 
// IMPORTAÇÃO CHAVE: Puxando o fundo que comprovadamente funciona
import './../pages/Login.css'; 
import './EventDetail.css'; 


// 1. Dados Fixos (Mockados) do Evento para Teste
const MOCKED_EVENT = {
  id: 1,
  title: 'Evento Aleatório',
  date: '2026-01-01T10:00:00.000Z', 
  location: 'Rua Principal, nº 1, Bairro: Centro, Uberaba/MG',
  ingressType: 'Entrada Gratuita',
  category: 'Aleatório',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam odio magna, laoreet eu urna tincidunt, suscipit vestibulum nulla. Nam a massa dui. Ut posuere nunc ac sollicitudin rutrum. Maecenas volutpat eu nibh ut auctor. Aliquam vel dapibus nisi, condimentum finibus nibh. Curabitur ut nibh sagittis, ornare ipsum ac maximus nisl. Curabitur eu ipsum vulputate, bibendum ipsum in, fermentum nisl. Nulla facilisis.',
};

const EventDetail = () => {
  
  const event = MOCKED_EVENT;

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
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

  // Componente de Interação (com hover)
  const InteractionButton = ({ type, label }) => {
    const [isHovered, setIsHovered] = useState(false);

    let baseIconClass;
    let hoverIconClass;

    if (type === 'heart') {
      baseIconClass = "bi bi-heart";
      hoverIconClass = "bi bi-heart-fill";
    } else if (type === 'like') {
      baseIconClass = "bi bi-hand-thumbs-up";
      hoverIconClass = "bi bi-hand-thumbs-up-fill";
    } else if (type === 'comment') {
      baseIconClass = "bi bi-chat-dots";
      hoverIconClass = "bi bi-chat-dots-fill";
    }

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


  return (
    <>
      <Header /> 
      
      <div className="page-container">
          
          <h1 className="event-title">{event.title}</h1>

          {/* ... (O restante da estrutura da página) ... */}

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
              <p>{event.description}</p>
          </section>

          <section className="event-section info-section">
              <h2>Informações Gerais:</h2>
              <div className="info-grid">
                  <div className="info-column">
                      <p><strong>Data:</strong> {formatDate(event.date)}</p>
                      <p><strong>Local:</strong> {event.location}</p>
                  </div>
                  <div className="info-column">
                      <p><strong>Ingresso:</strong> {event.ingressType}</p>
                      <p><strong>Categoria:</strong> {event.category}</p>
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