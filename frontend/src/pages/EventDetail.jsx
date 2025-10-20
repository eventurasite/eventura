// src/pages/EventDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Adicionado useNavigate
import Header from "./../components/Header";
import "./../pages/UserProfile.css"; // Reutiliza o estilo do container (e o fundo)
import "./EventDetail.css";
import Button from "../components/Button"; // Importa o componente Button
import axios from "axios"; // Importar axios
import { toast } from "react-toastify"; // Importar toast

// URL base da nossa API
const API_BASE_URL = "http://localhost:5000";

// Componente de Comentário (com avatar) - MANTIDO IGUAL
const CommentBox = ({ author, text }) => (
  <div className="comment-box">
    <div className="comment-avatar"></div>
    <div className="comment-content">
      <p className="comment-author">{author}</p>
      <p className="comment-text">{text}</p>
    </div>
  </div>
);

// Componente de Interação - MANTIDO IGUAL
const InteractionButton = ({ type, label, count = 0, isActive, onClick, eventId }) => {
  const [isHovered, setIsHovered] = useState(false);
  let baseIconClass, hoverIconClass, element;

  if (type === 'heart') { baseIconClass = "bi bi-heart"; hoverIconClass = "bi bi-heart-fill"; }
  else if (type === 'like') { baseIconClass = "bi bi-hand-thumbs-up"; hoverIconClass = "bi bi-hand-thumbs-up-fill"; }
  else if (type === 'comment') { baseIconClass = "bi bi-chat-dots"; hoverIconClass = "bi bi-chat-dots-fill"; }
  else if (type === 'report') { baseIconClass = "bi bi-exclamation-triangle"; hoverIconClass = "bi bi-exclamation-triangle-fill"; }

  const iconClass = isActive || isHovered ? hoverIconClass : baseIconClass;
  const activeClass = isActive ? "is-active-purple" : "";

  element = (
    <div
      className={`interaction-item ${activeClass} ${type === 'report' ? 'report-button' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <i className={iconClass}></i>
      {count > 0 && <span className="interaction-count">{count}</span>}
      <span className="interaction-label">{label}</span>
    </div>
  );

  if (type === 'report') {
    return (
        <Link to={`/denuncia-evento/${eventId}`} style={{ textDecoration: 'none' }}>
            {element}
        </Link>
    );
  }
  return element;
};


const EventDetail = () => {
  const { id } = useParams(); // Pega o ID da URL
  const eventId = id; // Renomeia para clareza no onClick do botão Editar
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // Estados de interação (mantidos)
  const [isLiked, setIsLiked] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const staticCounts = { curtidas: 15, interesses: 20, comentarios: 2 }; // Contagens mockadas

  // Funções de interação (mantidas)
  const handleCommentClick = () => { document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' }); };
  const handleLikeToggle = () => { setIsLiked(prev => !prev); };
  const handleInterestToggle = () => { setIsInterested(prev => !prev); };

  // Busca os dados do evento
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`); // Usa eventId
        if (!response.ok) {
          throw new Error("Evento não encontrado");
        }
        const data = await response.json();
        setEvent(data);

        // Verifica se o usuário logado é o dono do evento
        const loggedInUserId = localStorage.getItem('userId');
        if (loggedInUserId && data.organizador?.id_usuario == loggedInUserId) {
          setIsOwner(true);
        }

      } catch (error) {
        console.error("Erro ao buscar evento:", error);
        setEvent(null); // Define evento como null em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]); // Dependência: eventId

  // Formata a data
  const formatDate = (isoDate) => {
    if (!isoDate) return "Data indefinida";
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };


  // --- FUNÇÃO PARA LIDAR COM A EXCLUSÃO ---
  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Você precisa estar logado para excluir um evento.");
      return;
    }

    // Ação a ser executada se o usuário confirmar no toast
    const confirmAction = async () => {
      try {
        await axios.delete(`${API_BASE_URL}/api/events/${eventId}`, { // Usa eventId
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Evento excluído com sucesso!");
        // Redireciona para a agenda após um pequeno delay
        setTimeout(() => navigate('/agenda'), 1500);
      } catch (error) {
        console.error("Erro ao excluir evento:", error);
        toast.error(error.response?.data?.message || "Não foi possível excluir o evento.");
      }
    };

    // Exibe o toast de confirmação
    toast.warn(
      <ConfirmationToast
        message="Tem certeza de que deseja excluir este evento? Esta ação não pode ser desfeita."
        onConfirm={confirmAction} // Passa a função de exclusão como callback
      />, {
        position: "top-center",
        autoClose: false, // Não fecha automaticamente
        closeOnClick: false, // Não fecha ao clicar fora
        draggable: false,
        theme: "colored" // Usa tema colorido para destaque
      }
    );
  };
  // --- FIM DA FUNÇÃO DE EXCLUSÃO ---


  // Estados de carregamento e erro
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

  // Separa imagens
  const mainImage = event.imagemEvento?.[0];
  const thumbnails = event.imagemEvento?.slice(1, 4) || [];

  // Renderização principal
  return (
    <>
      <Header />
      <div className="user-profile-container">
        <div className="profile-wrapper">

          {/* Wrapper para Título e Botões de Ação do Dono */}
          <div className="event-header-actions-wrapper">
            <h1 className="event-title">{event.titulo}</h1>

            {/* Botões de Editar e Excluir (visíveis apenas para o dono) */}
            {isOwner && (
              <div className="owner-actions">
                {/* Botão Editar agora navega para a página de edição */}
                <Button className="edit-event-btn" onClick={() => navigate(`/editar-evento/${eventId}`)}>
                  <i className="bi bi-pencil-fill"></i> Editar
                </Button>
                {/* Botão Excluir chama handleDelete */}
                <Button className="delete-event-btn" onClick={handleDelete}>
                  <i className="bi bi-trash-fill"></i> Excluir
                </Button>
              </div>
            )}
          </div>

          {/* Seção de Imagens */}
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

          {/* Seção Descrição */}
          <section className="event-section description-section">
            <h2>Descrição do Evento</h2>
            <p>{event.descricao}</p>
          </section>

          {/* Seção Informações Gerais */}
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

          {/* Seção de Botões de Interação */}
          <section className="event-section action-buttons">
              <div className="interactions-container">
                  <InteractionButton type="heart" label="Curtidas" count={staticCounts.curtidas} isActive={isLiked} onClick={handleLikeToggle} />
                  <InteractionButton type="like" label="Interesses" count={staticCounts.interesses} isActive={isInterested} onClick={handleInterestToggle} />
                  <InteractionButton type="comment" label="Comentários" count={staticCounts.comentarios} onClick={handleCommentClick} />
                  <InteractionButton type="report" label="Denunciar" eventId={eventId} /> {/* Usa eventId */}
              </div>
          </section>

          {/* Seção Adicionar Comentário */}
          <section className="add-comment-section" id="comments-section">
            <h2>Adicionar Comentário</h2>
            <div className="comment-input-wrapper">
                <textarea placeholder="Escreva seu comentário aqui..." className="comment-input"></textarea>
                <button className="submit-comment-btn">Comentar</button>
            </div>
          </section>

          {/* Seção Listagem de Comentários */}
          <section className="event-section comments-section">
              <h2>Comentários:</h2>
              {/* Comentários Mockados */}
              <CommentBox author="Ana Maria" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit..." />
              <CommentBox author="João Silva" text="Ótima dica! Ansioso por este evento na cidade." />
          </section>

        </div>
      </div>
    </>
  );
};

export default EventDetail;


// --- Definição do ConfirmationToast (COMENTE OU REMOVA SE JÁ ESTIVER IMPORTANDO DE UserProfile.jsx) ---

const ConfirmationToast = ({ closeToast, message, onConfirm }) => (
  <div className="toast-confirmation-body">
    <p>{message}</p>
    <div className="toast-confirmation-buttons">
      <button className="toast-btn toast-btn-cancel" onClick={closeToast}>
        Cancelar
      </button>
      <button
        className="toast-btn toast-btn-confirm"
        onClick={() => { onConfirm(); closeToast(); }}
      >
        Confirmar
      </button>
    </div>
  </div>
);
