// frontend/src/pages/DenouncePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/Header";
import BackLink from "../components/BackLink";
import Button from "../components/Button";
// Reutiliza o estilo de contêiner (e o fundo)
import "./UserProfile.css";
import "./EventRegistration.css"; // Reutiliza estilos de input/botão

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL_DENOUNCE = `${API_BASE_URL}/api/events/denounce`; 
const API_URL_EVENT = `${API_BASE_URL}/api/events`; 

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

  // Armazenar o título do evento
  const [eventTitle, setEventTitle] = useState("Carregando Evento...");

  const eventId = id; // String do useParams()

  // Buscar o nome do evento
  useEffect(() => {
    const fetchEventTitle = async () => {
      try {
        const response = await axios.get(`${API_URL_EVENT}/${eventId}`);
        setEventTitle(response.data.titulo);
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
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Você precisa estar logado para fazer uma denúncia.");
      return;
    }

    // 1. Concatena e valida o motivo (Regra baseada na lógica do Zod, ex: min 10)
    const denunciaText = motivoSelecionado
      ? `Motivo: ${motivoSelecionado} - Detalhes: ${mensagemDetalhe}`
      : mensagemDetalhe.trim();

    if (denunciaText.length < 10) { 
        toast.error("A descrição da denúncia é muito curta (mínimo 10 caracteres).");
        return;
    }

    // 2. CORREÇÃO CRÍTICA: Converte o ID do evento para número
    const eventIdNumber = parseInt(eventId, 10);
    if (isNaN(eventIdNumber)) {
        toast.error("ID do evento inválido para denúncia.");
        return;
    }


    setLoading(true);

    try {
      // Envio da Denúncia
      const response = await axios.post(
        API_URL_DENOUNCE,
        {
          id_evento: eventIdNumber, // <<< ENVIADO COMO NÚMERO
          motivo: denunciaText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        response.data.message ||
          "Denúncia enviada com sucesso! Analisaremos em breve."
      );
      setTimeout(() => navigate(`/event/${eventId}`), 2000);
    } catch (error) {
      console.error("Erro ao enviar denúncia:", error);
      
      // >>> TRATAMENTO ROBUSTO DE ERROS ZOD (400) <<<
      let errorMessage = "Erro ao enviar denúncia.";

      if (error.response?.data?.status === 400 && error.response.data.errors) {
        // Pega a mensagem do primeiro campo inválido
        const firstField = Object.keys(error.response.data.errors)[0];
        const firstMessage = error.response.data.errors[firstField];
        
        // Formata a mensagem para o usuário
        errorMessage = `Falha na validação: ${firstField.toUpperCase()} - ${firstMessage}`;
      } else if (error.response?.data?.message) {
        // Usa a mensagem principal (pode ser erro de permissão ou outra exceção)
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
      // >>> FIM DO TRATAMENTO <<<
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
          {/* Exibe o nome do evento */}
          <h1 className="registration-title">Denunciar: {eventTitle}</h1>
          <h3 className="registration-subtitle">
            Selecione o motivo ou descreva o problema abaixo.
          </h3>

          <form
            onSubmit={handleSubmit}
            className="event-form"
            style={{ padding: "0 50px" }}
          >
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
            <div className="description-field" style={{ marginTop: "20px" }}>
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

            <div
              className="form-actions"
              style={{ justifyContent: "center", marginTop: "40px" }}
            >
              <Button type="submit" className="full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Denúncia"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}