// frontend/src/pages/DenouncePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/Header";
import BackLink from "../components/BackLink";
import Button from "../components/Button";
import TextField from "../components/TextField";
// Reutiliza o estilo de contêiner (e o fundo)
import "./UserProfile.css"; 
import "./EventRegistration.css"; // Reutiliza estilos de input/botão

const API_BASE_URL = "http://localhost:5000";
const API_URL_DENOUNCE = `${API_BASE_URL}/api/events/denounce`; // Rota fictícia de denúncia
const API_URL_EVENT = `${API_BASE_URL}/api/events`; // Base URL para buscar detalhes do evento

// Motivos de denúncia mockados
const MOTIVOS_DENUNCIA = [
  "Conteúdo inapropriado",
  "Informações falsas/enganosas",
  "Violação de direitos autorais",
  "Evento já ocorreu/cancelado",
  "Outro (escrever motivo abaixo)",
];

export default function DenouncePage() {
  const { id } = useParams(); // ID do evento
  const navigate = useNavigate();

  const [motivoSelecionado, setMotivoSelecionado] = useState("");
  const [mensagemDetalhe, setMensagemDetalhe] = useState("");
  const [loading, setLoading] = useState(false);
  
  // NOVO ESTADO: Armazenar o título do evento
  const [eventTitle, setEventTitle] = useState("Carregando Evento..."); 
  
  const eventId = id;
  
  // NOVO useEffect: Buscar o nome do evento
  useEffect(() => {
    const fetchEventTitle = async () => {
      try {
        // Chamada à API para buscar os detalhes do evento por ID
        const response = await axios.get(`${API_URL_EVENT}/${eventId}`);
        setEventTitle(response.data.titulo); // Assume que a API retorna 'titulo'
      } catch (error) {
        console.error("Erro ao buscar detalhes do evento:", error);
        setEventTitle("Evento Não Encontrado");
      }
    };
    
    if (eventId) {
      fetchEventTitle();
    }
  }, [eventId]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    if (!token) {
        toast.error("Você precisa estar logado para fazer uma denúncia.");
        return;
    }

    if (!motivoSelecionado && mensagemDetalhe.trim() === "") {
        toast.error("Por favor, selecione um motivo ou descreva sua denúncia.");
        return;
    }
    
    // Concatena o motivo selecionado (se houver) com a mensagem detalhada
    const denunciaText = motivoSelecionado 
        ? `Motivo: ${motivoSelecionado} - Detalhes: ${mensagemDetalhe}`
        : mensagemDetalhe.trim();

    setLoading(true);

    try {
        // A denúncia real aqui
        const response = await axios.post(API_URL_DENOUNCE, {
            id_evento: eventId,
            motivo: denunciaText,
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        toast.success(response.data.message || "Denúncia enviada com sucesso! Analisaremos em breve.");
        setTimeout(() => navigate(`/event/${eventId}`), 2000);

    } catch (error) {
        console.error("Erro ao enviar denúncia:", error);
        toast.error(error.response?.data?.message || "Erro ao enviar denúncia.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="registration-container">
        <div className="registration-wrapper">
          <BackLink to={`/event/${eventId}`} />
          {/* MODIFICADO AQUI: Exibe o nome do evento */}
          <h1 className="registration-title">Denunciar: {eventTitle}</h1> 
          <h3 className="registration-subtitle">
            Selecione o motivo ou descreva o problema abaixo.
          </h3>

          <form onSubmit={handleSubmit} className="event-form" style={{ padding: '0 50px' }}>
            
            {/* Campo de Motivo Padrão (Select) - Opcional */}
            <div className="tf">
              <label htmlFor="motivo">Motivo Padrão (Opcional)</label>
              <select
                id="motivo"
                name="motivo"
                value={motivoSelecionado}
                onChange={(e) => setMotivoSelecionado(e.target.value)}
                className="custom-select"
              >
                <option value="">Selecione um motivo...</option>
                {MOTIVOS_DENUNCIA.map((mot) => (
                  <option key={mot} value={mot}>
                    {mot}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Campo de Mensagem (Textarea) - Principal e Obrigatório */}
            <div className="description-field" style={{ marginTop: '20px' }}>
                <label htmlFor="mensagem">Detalhes/Descrição da Denúncia *</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={mensagemDetalhe}
                  onChange={(e) => setMensagemDetalhe(e.target.value)}
                  placeholder="Descreva o problema com o máximo de detalhes possível (obrigatório se não selecionar um motivo padrão)."
                  rows="5"
                />
            </div>

            <div className="form-actions" style={{ justifyContent: 'center', marginTop: '40px' }}>
                <Button type="submit" className="full" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Denúncia'}
                </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}