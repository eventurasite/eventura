// src/pages/EventDetail.jsx
import React, { useState, useEffect } from "react"; // NOVO: importado useState e useEffect
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "./../components/Header";
import "./../pages/UserProfile.css";
import "./EventDetail.css";
import Button from "../components/Button";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000";

// NOVO: Componente CommentBox atualizado para receber dados reais
const CommentBox = ({ author, text, photoUrl }) => (
  <div className="comment-box">
    <div className="comment-avatar">
      {/* Exibe a foto do usuário se ela existir, senão um placeholder */}
      {photoUrl ? (
        <img src={`${API_BASE_URL}${photoUrl}`} alt={author} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
      ) : (
        <i className="bi bi-person-fill" style={{fontSize: '24px', color: '#666'}}></i>
      )}
    </div>
    <div className="comment-content">
      <p className="comment-author">{author}</p>
      <p className="comment-text">{text}</p>
    </div>
  </div>
);

// Componente de Interação (MANTIDO IGUAL)
const InteractionButton = ({ type, label, count = 0, isActive, onClick, eventId }) => {
  // ... (lógica interna do botão de interação mantida) ...
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
  const { id } = useParams();
  const eventId = id;
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // NOVO: Estados para comentários
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Estados de interação (curtidas e interesses ainda mockados)
  const [isLiked, setIsLiked] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const staticCounts = { curtidas: 15, interesses: 20 }; // Contagem de comentários foi removida daqui

  const handleLikeToggle = () => { setIsLiked(prev => !prev); };
  const handleInterestToggle = () => { setIsInterested(prev => !prev); };
  const handleCommentClick = () => { document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' }); };

  // NOVO: Função para buscar os comentários da API
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events/${eventId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
      toast.error("Não foi possível carregar os comentários.");
    }
  };

  // Busca os dados do evento E os comentários
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Evento não encontrado");
        }
        const data = await response.json();
        setEvent(data);

        const loggedInUserId = localStorage.getItem('userId');
        if (loggedInUserId && data.organizador?.id_usuario == loggedInUserId) {
          setIsOwner(true);
        }
        
        // NOVO: Chama a busca de comentários
        fetchComments();

      } catch (error) {
        console.error("Erro ao buscar evento:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Formata a data (igual)
  const formatDate = (isoDate) => {
    if (!isoDate) return "Data indefinida";
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  // Função de exclusão (igual)
  const handleDelete = async () => {
    // ... (lógica de exclusão mantida) ...
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Você precisa estar logado para excluir um evento.");
      return;
    }

    const confirmAction = async () => {
      try {
        await axios.delete(`${API_BASE_URL}/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Evento excluído com sucesso!");
        setTimeout(() => navigate('/agenda'), 1500);
      } catch (error) {
        console.error("Erro ao excluir evento:", error);
        toast.error(error.response?.data?.message || "Não foi possível excluir o evento.");
      }
    };

    toast.warn(
      <ConfirmationToast
        message="Tem certeza de que deseja excluir este evento? Esta ação não pode ser desfeita."
        onConfirm={confirmAction}
      />, {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: "colored"
      }
    );
  };

  // NOVO: Função para enviar um novo comentário
  const handleSubmitComment = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Você precisa estar logado para comentar.");
      return;
    }
    if (newComment.trim() === "") {
      toast.warn("O comentário não pode estar vazio.");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/events/${eventId}/comments`,
        { texto: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Adiciona o novo comentário (retornado pela API) à lista local
      setComments(prevComments => [...prevComments, response.data]);
      setNewComment(""); // Limpa o campo de texto
      toast.success("Comentário adicionado!");

    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      toast.error(error.response?.data?.message || "Não foi possível enviar o comentário.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Estados de carregamento e erro (iguais)
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

  // Separa imagens (igual)
  const mainImage = event.imagemEvento?.[0];
  const thumbnails = event.imagemEvento?.slice(1, 4) || [];

  // Renderização principal
  return (
    <>
      <Header />
      <div className="user-profile-container">
        <div className="profile-wrapper">

          {/* Wrapper para Título e Botões de Ação do Dono (igual) */}
          <div className="event-header-actions-wrapper">
            <h1 className="event-title">{event.titulo}</h1>
            {isOwner && (
              <div className="owner-actions">
                <Button className="edit-event-btn" onClick={() => navigate(`/editar-evento/${eventId}`)}>
                  <i className="bi bi-pencil-fill"></i> Editar
                </Button>
                <Button className="delete-event-btn" onClick={handleDelete}>
                  <i className="bi bi-trash-fill"></i> Excluir
                </Button>
              </div>
            )}
          </div>

          {/* Seção de Imagens (igual) */}
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

          {/* Seção Descrição (igual) */}
          <section className="event-section description-section">
            <h2>Descrição do Evento</h2>
            <p>{event.descricao}</p>
          </section>

          {/* Seção Informações Gerais (igual) */}
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

          {/* Seção de Botões de Interação (NOVO: contagem de comentários dinâmica) */}
          <section className="event-section action-buttons">
              <div className="interactions-container">
                  <InteractionButton type="heart" label="Curtidas" count={staticCounts.curtidas} isActive={isLiked} onClick={handleLikeToggle} />
                  <InteractionButton type="like" label="Interesses" count={staticCounts.interesses} isActive={isInterested} onClick={handleInterestToggle} />
                  {/* NOVO: Usa comments.length para a contagem */}
                  <InteractionButton type="comment" label="Comentários" count={comments.length} onClick={handleCommentClick} />
                  <InteractionButton type="report" label="Denunciar" eventId={eventId} />
              </div>
          </section>

          {/* Seção Adicionar Comentário (NOVO: funcional) */}
          <section className="add-comment-section" id="comments-section">
            <h2>Adicionar Comentário</h2>
            <div className="comment-input-wrapper">
                <textarea 
                  placeholder="Escreva seu comentário aqui..." 
                  className="comment-input"
                  value={newComment} // NOVO: Controlado pelo estado
                  onChange={(e) => setNewComment(e.target.value)} // NOVO: Atualiza o estado
                  disabled={isSubmittingComment} // NOVO: Desativa enquanto envia
                />
                <button 
                  className="submit-comment-btn" 
                  onClick={handleSubmitComment} // NOVO: Chama a função de envio
                  disabled={isSubmittingComment} // NOVO: Desativa enquanto envia
                >
                  {isSubmittingComment ? "Enviando..." : "Comentar"}
                </button>
            </div>
          </section>

          {/* Seção Listagem de Comentários (NOVO: dados reais) */}
          <section className="event-section comments-section">
              <h2>Comentários:</h2>
              {/* NOVO: Verifica se há comentários */}
              {comments.length === 0 ? (
                <p>Ainda não há comentários. Seja o primeiro a comentar!</p>
              ) : (
                // NOVO: Faz um loop (map) nos comentários do estado
                comments.map((comment) => (
                  <CommentBox 
                    key={comment.id_comentario}
                    author={comment.usuario.nome} 
                    text={comment.texto}
                    photoUrl={comment.usuario.url_foto_perfil}
                  />
                ))
              )}
          </section>

        </div>
      </div>
    </>
  );
};

export default EventDetail;

// Definição do ConfirmationToast (igual)
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