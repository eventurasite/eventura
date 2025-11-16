// frontend/src/pages/EventEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import TextField from "../components/TextField";
import BackLink from "../components/BackLink";
import { toast } from "react-toastify";
import axios from "axios";

// Reutiliza o CSS da página de registro
import "./EventRegistration.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function EventEdit() {
  const navigate = useNavigate();
  const { id: eventId } = useParams(); // Pega o ID do evento da URL
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    data: "",
    local: "",
    preco: "", // Inicializa como string vazia
    id_categoria: "",
    descricao: "",
    url_link_externo: "", // Campo para Link Oficial
  });
  const [loading, setLoading] = useState(true); // Estado para carregamento inicial
  const [submitting, setSubmitting] = useState(false); // Estado para o envio do form

  // --- Efeito para buscar categorias (igual ao registro) ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/events/categories`
        );
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        toast.error("Não foi possível carregar as categorias.");
      }
    };
    fetchCategories();
  }, []);

  // --- NOVO EFEITO: Buscar dados do evento para preencher o form ---
  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/events/${eventId}`
        );
        const eventData = response.data;

        // Formata a data para o input datetime-local (YYYY-MM-DDTHH:mm)
        const formattedDate = eventData.data
          ? new Date(
              new Date(eventData.data).getTime() -
                new Date().getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16)
          : "";

        setFormData({
          titulo: eventData.titulo || "",
          data: formattedDate,
          local: eventData.local || "",
          preco:
            eventData.preco !== null && eventData.preco !== undefined
              ? String(eventData.preco)
              : "0", // Garante que seja string
          id_categoria: eventData.id_categoria || "",
          descricao: eventData.descricao || "",
          url_link_externo: eventData.url_link_externo || "", // CORREÇÃO: LÊ O DADO DA API
        });
      } catch (error) {
        console.error("Erro ao buscar dados do evento:", error);
        toast.error(
          "Não foi possível carregar os dados do evento para edição."
        );
        navigate("/meuseventos"); // Volta se não conseguir carregar
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId, navigate]);
  // --- FIM DO NOVO EFEITO ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- handleSubmit MODIFICADO para usar PUT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      navigate("/login");
      return;
    }

    setSubmitting(true);

    // Converte preço para número antes de enviar
    const dataToSend = {
      ...formData,
      preco: parseFloat(formData.preco) || 0, // Garante que seja número
      // O campo url_link_externo é incluído aqui automaticamente
    };

    try {
      await axios.put(`${API_BASE_URL}/api/events/${eventId}`, dataToSend, {
        headers: {
          // Como não estamos enviando arquivos por enquanto, usamos JSON
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Evento atualizado com sucesso!");
      // Redireciona de volta para a página de detalhes do evento
      setTimeout(() => navigate(`/event/${eventId}`), 1500);
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      toast.error(
        error.response?.data?.message || "Erro ao atualizar o evento."
      );
      setSubmitting(false);
    }
    // Não limpa o formulário, pois o usuário será redirecionado
  };
  // --- FIM DO handleSubmit MODIFICADO ---

  if (loading) {
    return (
      <>
        <Header />
        <div className="registration-container" style={{ textAlign: "center" }}>
          Carregando dados do evento...
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="registration-container">
        <div className="registration-wrapper">
          {/* Link de volta para a página do evento */}
          <BackLink to={`/event/${eventId}`} />
          <h1 className="registration-title">Editar Evento</h1>
          <h3 className="registration-subtitle">
            Atualize as informações do seu evento abaixo.
          </h3>

          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-grid">
              {/* COLUNA 1 */}
              <div className="form-column">
                <TextField
                  id="titulo"
                  label="Nome do Evento *"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  isEditable={true}
                />

                <TextField
                  id="data"
                  label="Data e Hora *"
                  name="data"
                  type="datetime-local"
                  value={formData.data}
                  onChange={handleChange}
                  required
                  isEditable={true}
                />

                <div className="tf">
                  <label htmlFor="id_categoria">Categoria *</label>
                  <select
                    id="id_categoria"
                    name="id_categoria"
                    value={formData.id_categoria}
                    onChange={handleChange}
                    required
                    className="custom-select"
                  >
                    <option value="" disabled>
                      Selecione uma categoria
                    </option>
                    {categorias.map((cat) => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* COLUNA 2 */}
              <div className="form-column">
                <TextField
                  id="local"
                  label="Endereço *"
                  name="local"
                  value={formData.local}
                  onChange={handleChange}
                  required
                  isEditable={true}
                />

                <TextField
                  id="preco"
                  label="Preço do Ingresso (R$)"
                  name="preco"
                  type="number"
                  value={formData.preco}
                  onChange={handleChange}
                  placeholder="0.00 para gratuito"
                  isEditable={true}
                />

                <TextField
                  id="url_link_externo"
                  label="Link Oficial do Evento (Opcional)"
                  name="url_link_externo"
                  value={formData.url_link_externo}
                  onChange={handleChange}
                  placeholder="https://siteoficial.com/ingressos"
                  isEditable={true}
                />
              </div>
            </div>

            <div className="tf" style={{ marginTop: '5px' }}>
              <label htmlFor="imagens">Anexar Novas Imagens (opcional)</label>
              <input id="imagens" type="file" name="imagens" multiple accept="image/*" className="file-input" />
              <p style={{fontSize: '0.8em', color: '#666'}}>Novas imagens substituirão as antigas.</p>
            </div>

            {/* Descrição */}
            <div className="description-field">
              <label htmlFor="descricao">Descrição do Evento *</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
              />
            </div>

            {/* Botão de Submissão */}
            <div className="form-actions">
              <Button type="submit" className="full" disabled={submitting}>
                {submitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}