// frontend/src/pages/EventEdit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import TextField from "../components/TextField";
import BackLink from "../components/BackLink";
import { toast } from "react-toastify";
import axios from "axios";
import { resolveImageUrl } from "../utils/resolveImageUrl"; // Importar auxiliar de imagem

// Reutiliza o CSS da página de registro
import "./EventRegistration.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function EventEdit() {
  const navigate = useNavigate();
  const { id: eventId } = useParams();
  
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    titulo: "",
    data: "",
    local: "",
    preco: "",
    id_categoria: "",
    descricao: "",
    url_link_externo: "",
  });

  // Estados para gerenciamento de imagens
  const [existingImages, setExistingImages] = useState([]); // Imagens vindas do backend
  const [imagesToDelete, setImagesToDelete] = useState([]); // IDs das imagens para excluir
  const [newImages, setNewImages] = useState([]); // Novos arquivos (File objects)
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Previews dos novos arquivos

  // Busca categorias
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

  // Busca dados do evento
  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/events/${eventId}`
        );
        const eventData = response.data;

        // Formata data para datetime-local
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
              : "0",
          id_categoria: eventData.id_categoria || "",
          descricao: eventData.descricao || "",
          url_link_externo: eventData.url_link_externo || "",
        });

        // Carrega imagens existentes
        if (eventData.imagemEvento && Array.isArray(eventData.imagemEvento)) {
          setExistingImages(eventData.imagemEvento);
        }

      } catch (error) {
        console.error("Erro ao buscar dados do evento:", error);
        toast.error("Não foi possível carregar os dados do evento.");
        navigate("/meuseventos");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Lidar com seleção de NOVAS imagens
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar total de imagens (Existentes - Deletadas + Novas)
    const currentTotal = existingImages.length + files.length;
    if (currentTotal > 5) {
        toast.warn(`O limite é de 5 imagens. Você já tem ${existingImages.length}.`);
        // Opcional: impedir adição ou cortar o array
    }

    setNewImages(files);

    // Gerar previews para as novas imagens
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  // Lidar com remoção de imagens JÁ EXISTENTES (Banco de dados)
  const handleRemoveExisting = (imgId) => {
    // Adiciona o ID na lista de exclusão
    setImagesToDelete((prev) => [...prev, imgId]);
    // Remove visualmente da lista de existentes
    setExistingImages((prev) => prev.filter((img) => img.id_imagem !== imgId));
  };

  // Envio do Formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Sessão expirada. Faça login novamente.");
      navigate("/login");
      return;
    }

    setSubmitting(true);

    // Usamos FormData para enviar Arquivos + Dados
    const dataToSend = new FormData();

    // Campos de texto
    dataToSend.append("titulo", formData.titulo);
    dataToSend.append("descricao", formData.descricao);
    dataToSend.append("data", formData.data);
    dataToSend.append("local", formData.local);
    dataToSend.append("preco", formData.preco);
    dataToSend.append("id_categoria", formData.id_categoria);
    if (formData.url_link_externo) {
        dataToSend.append("url_link_externo", formData.url_link_externo);
    }

    // Lista de IDs para deletar (envia como array ou múltiplos campos com mesmo nome)
    imagesToDelete.forEach((id) => {
        dataToSend.append("imgIdsToDelete", id);
    });

    // Novos arquivos
    newImages.forEach((file) => {
        dataToSend.append("imagens", file);
    });

    try {
      // Nota: O Axios configura automaticamente o Content-Type para multipart/form-data quando recebe FormData
      await axios.put(`${API_BASE_URL}/api/events/${eventId}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Evento atualizado com sucesso!");
      setTimeout(() => navigate(`/event/${eventId}`), 1500);
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      toast.error(
        error.response?.data?.message || "Erro ao atualizar o evento."
      );
    } finally {
        setSubmitting(false);
    }
  };

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
          <BackLink to={`/event/${eventId}`} />
          <h1 className="registration-title">Editar Evento</h1>
          <h3 className="registration-subtitle">
            Atualize as informações e imagens do seu evento.
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

            {/* --- GERENCIAMENTO DE IMAGENS --- */}
            <div className="tf" style={{ marginTop: '15px' }}>
              <label>Gerenciar Imagens</label>
              
              {/* Lista de Imagens Existentes */}
              {existingImages.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {existingImages.map((img) => (
                          <div key={img.id_imagem} style={{ position: 'relative', width: '80px', height: '80px' }}>
                              <img 
                                src={resolveImageUrl(img.url)} 
                                alt="Existente" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveExisting(img.id_imagem)}
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px'
                                }}
                                title="Remover imagem"
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                          </div>
                      ))}
                  </div>
              )}

              <label htmlFor="imagens" style={{marginTop: '10px', display: 'block'}}>Adicionar Novas Imagens:</label>
              <input 
                id="imagens" 
                type="file" 
                name="imagens" 
                multiple 
                accept="image/*" 
                className="file-input" 
                onChange={handleNewImageChange}
              />
              
              {/* Previews das Novas Imagens */}
              {newImagePreviews.length > 0 && (
                <div className="image-preview-container">
                  {newImagePreviews.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Nova Preview ${index + 1}`}
                      className="image-preview"
                    />
                  ))}
                </div>
              )}
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