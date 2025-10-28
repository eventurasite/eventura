// src/pages/EventDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "./../components/Header";
import "./../pages/UserProfile.css";
import "./EventDetail.css";
import Button from "../components/Button";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000";

// --- INÍCIO DA CORREÇÃO ---
/**
 * Verifica se uma URL é externa (absoluta)
 * @param {string} url
 * @returns {boolean}
 */
const isExternalUrl = (url) => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Monta a URL correta para a imagem
 * @param {string | undefined} url
 * @returns {string}
 */
const resolveImageUrl = (url) => {
  if (isExternalUrl(url)) {
    return url; // URL já é absoluta (ex: Cloudinary)
  }
  if (url) {
    return `${API_BASE_URL}${url}`; // URL relativa (ex: /uploads/)
  }
  return "/assets/imagens/default-event.jpg"; // Fallback
};
// --- FIM DA CORREÇÃO ---


// Componente CommentBox (igual)
const CommentBox = ({ author, text, photoUrl }) => (
  // ... (código mantido)
  <div className="comment-box">
    <div className="comment-avatar">
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
  // ... (lógica interna mantida)
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

  // Estados de comentários
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Estados de Curtidas
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // NOVO: Estados de Interesses (substituindo o mock)
  const [isInterested, setIsInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(0); // Substitui staticCounts.interesses

  // Handle de Comentário
  const handleCommentClick = () => { document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' }); };

  // --- Funções de busca de dados ---
  const fetchComments = async () => {
    // ... (lógica mantida)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events/${eventId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  };

  const fetchLikeData = async () => {
    // ... (lógica mantida)
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events/${eventId}/likes`);
      setLikeCount(response.data.totalLikes);
    } catch (error) {
      console.error("Erro ao buscar total de curtidas:", error);
    }
    if (token) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/events/${eventId}/my-like`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLiked(response.data.userHasLiked);
      } catch (error) {
        console.error("Erro ao buscar status da curtida:", error);
      }
    }
  };

  // NOVO: Função para buscar dados de Interesses (Total e status do usuário)
  const fetchInterestData = async () => {
    const token = localStorage.getItem('authToken');
    
    // 1. Busca o total de interesses (público)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events/${eventId}/interests`);
      setInterestCount(response.data.totalInterests);
    } catch (error) {
      console.error("Erro ao buscar total de interesses:", error);
    }

    // 2. Se estiver logado, busca se o usuário tem interesse
    if (token) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/events/${eventId}/my-interest`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsInterested(response.data.userHasInterested);
      } catch (error) {
        console.error("Erro ao buscar status de interesse:", error);
      }
    }
  };

  // Busca TODOS os dados ao carregar
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
        if (!response.ok) throw new Error("Evento não encontrado");
        
        const data = await response.json();
        setEvent(data);

        const loggedInUserId = localStorage.getItem('userId');
        if (loggedInUserId && data.organizador?.id_usuario == loggedInUserId) {
          setIsOwner(true);
        }
        
        // Chama as buscas de dados secundários
        fetchComments();
        fetchLikeData();
        fetchInterestData(); // NOVO

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
    // ... (lógica mantida)
    if (!isoDate) return "Data indefinida";
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  // Função de exclusão (igual)
  const handleDelete = async () => {
    // ... (lógica de exclusão mantida)
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

  // Função de Comentário (igual)
  const handleSubmitComment = async () => {
    // ... (lógica de comentário mantida)
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
      setComments(prevComments => [...prevComments, response.data]);
      setNewComment("");
      toast.success("Comentário adicionado!");
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      toast.error(error.response?.data?.message || "Não foi possível enviar o comentário.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Função de Curtida (igual)
  const handleLikeToggle = async () => {
    // ... (lógica de curtida mantida)
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Você precisa estar logado para curtir um evento.");
      return;
    }
    const originalLikeState = isLiked;
    const originalLikeCount = likeCount;
    setIsLiked(prev => !prev);
    setLikeCount(prev => originalLikeState ? prev - 1 : prev + 1);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/events/${eventId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsLiked(response.data.userHasLiked);
      setLikeCount(response.data.totalLikes);
    } catch (error) {
      console.error("Erro ao curtir evento:", error);
      toast.error(error.response?.data?.message || "Não foi possível registrar sua curtida.");
      setIsLiked(originalLikeState);
      setLikeCount(originalLikeCount);
    }
  };

  // NOVO: Função para adicionar/remover Interesse (lógica idêntica ao handleLikeToggle)
  const handleInterestToggle = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Você precisa estar logado para marcar interesse.");
      return;
    }
    
    // Atualização otimista
    const originalInterestState = isInterested;
    const originalInterestCount = interestCount;
    
    setIsInterested(prev => !prev);
    setInterestCount(prev => originalInterestState ? prev - 1 : prev + 1);

    try {
      // Envia a requisição para a nova rota
      const response = await axios.post(
        `${API_BASE_URL}/api/events/${eventId}/interest`, // Rota de interesse
        {}, // Corpo vazio
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Sincroniza o estado com a resposta final
      setIsInterested(response.data.userHasInterested);
      setInterestCount(response.data.totalInterests);

    } catch (error) {
      console.error("Erro ao marcar interesse:", error);
      toast.error(error.response?.data?.message || "Não foi possível registrar seu interesse.");
      // Reverte a mudança em caso de erro
      setIsInterested(originalInterestState);
      setInterestCount(originalInterestCount);
    }
  };


  // Estados de carregamento e erro (iguais)
  if (loading) {
    // ... (código mantido)
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
    // ... (código mantido)
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

          {/* Wrapper Título e Ações (igual) */}
          <div className="event-header-actions-wrapper">
            {/* ... (código mantido) ... */}
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

          {/* Seção Imagens (MODIFICADA) */}
          <section className="event-images">
            <div className="main-image">
              {/* --- CORREÇÃO APLICADA AQUI --- */}
              <img src={resolveImageUrl(mainImage?.url)} alt={event.titulo} />
            </div>
            <div className="thumbnail-gallery">
              {thumbnails.map((img) => (
                <div key={img.id_imagem} className="thumbnail">
                  {/* --- CORREÇÃO APLICADA AQUI --- */}
                  <img src={resolveImageUrl(img.url)} alt="Miniatura do evento" />
                </div>
              ))}
            </div>
          </section>

          {/* Seção Descrição (igual) */}
          <section className="event-section description-section">
            {/* ... (código mantido) ... */}
            <h2>Descrição do Evento</h2>
            <p>{event.descricao}</p>
          </section>

          {/* Seção Informações Gerais (igual) */}
          <section className="event-section info-section">
            {/* ... (código mantido) ... */}
            <h2>Informações Gerais</h2>
            <div className="info-grid">
              <p><strong>Data e Hora:</strong> {formatDate(event.data)}</p>
              <p><strong>Local:</strong> {event.local}</p>
              <p><strong>Preço:</strong> {parseFloat(event.preco) > 0 ? `R$ ${parseFloat(event.preco).toFixed(2)}` : "Gratuito"}</p>
              <p><strong>Categoria:</strong> {event.categoria?.nome || "Não informada"}</p>
              <p><strong>Organizador:</strong> {event.organizador?.nome || "Não informado"}</p>
            </div>
          </section>

          {/* Seção de Botões de Interação (NOVO: Interesses dinâmicos) */}
          <section className="event-section action-buttons">
              <div className="interactions-container">
                  {/* Curtidas (do passo anterior) */}
                  <InteractionButton type="heart" label="Curtidas" count={likeCount} isActive={isLiked} onClick={handleLikeToggle} />
                  
                  {/* NOVO: interestCount e isInterested agora vêm do estado dinâmico */}
                  <InteractionButton type="like" label="Interesses" count={interestCount} isActive={isInterested} onClick={handleInterestToggle} />
                  
                  {/* Comentários (do primeiro passo) */}
                  <InteractionButton type="comment" label="Comentários" count={comments.length} onClick={handleCommentClick} />
                  <InteractionButton type="report" label="Denunciar" eventId={eventId} />
              </div>
          </section>

          {/* Seção Adicionar Comentário (igual) */}
          <section className="add-comment-section" id="comments-section">
            {/* ... (código mantido) ... */}
            <h2>Adicionar Comentário</h2>
            <div className="comment-input-wrapper">
                <textarea 
                  placeholder="Escreva seu comentário aqui..." 
                  className="comment-input"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isSubmittingComment}
                />
                <button 
                  className="submit-comment-btn" 
                  onClick={handleSubmitComment}
                  disabled={isSubmittingComment}
                >
                  {isSubmittingComment ? "Enviando..." : "Comentar"}
                </button>
            </div>
          </section>

          {/* Seção Listagem de Comentários (igual) */}
          <section className="event-section comments-section">
            {/* ... (código mantido) ... */}
            <h2>Comentários:</h2>
              {comments.length === 0 ? (
                <p>Ainda não há comentários. Seja o primeiro a comentar!</p>
              ) : (
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

// ConfirmationToast (igual)
const ConfirmationToast = ({ closeToast, message, onConfirm }) => (
  // ... (código mantido)
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