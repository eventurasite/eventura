// frontend/src/pages/AdminDenounces.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import BackLink from "../components/BackLink";
import axios from "axios";
import { toast } from "react-toastify";
import "../pages/UserProfile.css"; 
import "./EventRegistration.css"; 

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL_DENOUNCES = `${API_BASE_URL}/api/events/admin/denounces`;


function DenounceItem({ denounce, onAction }) {
  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="denounce-card">
      <div className="denounce-header">
        <span className="denounce-id">#D{denounce.id_denuncia}</span>
        <span className={`denounce-status status-${denounce.status}`}>{denounce.status.toUpperCase()}</span>
        <span className="denounce-date">{formatDate(denounce.data_criacao)}</span>
      </div>

      <div className="denounce-content">
        <h3>Motivo:</h3>
        <p className="motivo-text">{denounce.motivo}</p>
        
        <h3>Evento Denunciado:</h3>
        <p>
          {/* Link para o evento em uma nova aba para o admin checar */}
          <Link to={`/event/${denounce.evento.id_evento}`} target="_blank" className="event-link">
            <strong>{denounce.evento.titulo}</strong>
            <i className="bi bi-box-arrow-up-right" style={{marginLeft: '5px'}}></i>
          </Link>
          <br/>
          Em: {denounce.evento.local}
        </p>

        <h3>Denunciante:</h3>
        <p>
          {denounce.usuario.nome} (<a href={`mailto:${denounce.usuario.email}`}>{denounce.usuario.email}</a>)
        </p>
      </div>

      <div className="denounce-actions">
        <button
          className="action-btn-danger"
          onClick={() => onAction(denounce.id_denuncia, 'delete')}
        >
          Excluir Denúncia
        </button>
        {/*
        OPÇÕES REMOVIDAS:
        <button
          className="action-btn-secondary"
          onClick={() => onAction(denounce.id_denuncia, 'rejeitada')}
        >
          Rejeitar
        </button>
        <button
          className="action-btn-primary"
          onClick={() => onAction(denounce.id_denuncia, 'revisada')}
        >
          Marcar como Revisada
        </button>
        */}
      </div>
    </div>
  );
}

export default function AdminDenounces() {
  const [denounces, setDenounces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDenounces = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/login");

    try {
      const response = await axios.get(API_URL_DENOUNCES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDenounces(response.data);
    } catch (error) {
      console.error("Erro ao buscar denúncias:", error);
      toast.error(
        error.response?.data?.message || "Não foi possível carregar as denúncias."
      );
      // Se for 403 (Acesso negado), redireciona para a home
      if (error.response?.status === 403) navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDenounces();
  }, []);

  // Handler para ações do administrador
  const handleDenounceAction = async (id, action) => {
    const token = localStorage.getItem("authToken");

    let endpoint = `${API_URL_DENOUNCES}/${id}`;
    let method = 'PUT';
    let data = {};
    let successMessage = '';
    
    if (action === 'delete') {
      method = 'DELETE';
      successMessage = 'Denúncia excluída com sucesso.';
    } else if (action === 'revisada' || action === 'rejeitada') {
      data = { status: action };
      method = 'PUT';
      successMessage = `Denúncia marcada como ${action}.`;
    } else {
        return;
    }

    try {
      await axios({
          method,
          url: endpoint,
          data: method === 'PUT' ? data : undefined,
          headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success(successMessage);
      // Remove a denúncia da lista após a ação
      setDenounces(prev => prev.filter(d => d.id_denuncia !== id));

    } catch (error) {
      console.error(`Erro ao realizar ação ${action}:`, error);
      toast.error(
        error.response?.data?.message || `Não foi possível completar a ação: ${action}.`
      );
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="user-profile-container" style={{ textAlign: "center" }}>
          <p>Carregando denúncias...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {/* Reutiliza o contêiner de perfil para manter o layout */}
      <div className="user-profile-container"> 
        <div className="profile-wrapper">
          <div className="profile-header-section">
            <h1 className="profile-title">Gestão de Denúncias</h1>
            <BackLink to="/admin" />
          </div>
          
          <p className="muted" style={{marginBottom: '20px', fontSize: '1em'}}>
            Lista de denúncias de eventos pendentes de revisão.
          </p>

          {denounces.length === 0 ? (
            <p style={{textAlign: 'center', margin: '40px 0'}}>
                🎉 Nenhuma denúncia pendente!
            </p>
          ) : (
            <div className="denounce-list">
              {denounces.map((denounce) => (
                <DenounceItem 
                    key={denounce.id_denuncia} 
                    denounce={denounce} 
                    onAction={handleDenounceAction}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}