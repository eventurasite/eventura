// frontend/src/pages/EventRegistration.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import TextField from "../components/TextField";
import BackLink from "../components/BackLink";
import { toast } from "react-toastify";
import axios from "axios";

import "./EventRegistration.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function EventRegistration() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    data: "",
    local: "",
    preco: "0",
    id_categoria: "",
    descricao: "",
    url_link_externo: "", // Campo para Link Oficial
  });
  const [imagens, setImagens] = useState([]); // Armazena os arquivos
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    // Busca as categorias da API quando o componente é montado
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImagens(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    if (files.length > 5) {
      toast.warn("Você pode enviar no máximo 5 imagens.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Você precisa estar logado para criar um evento.");
      return;
    }

    const eventData = new FormData();
    eventData.append("titulo", formData.titulo);
    eventData.append("descricao", formData.descricao);
    eventData.append("data", formData.data);
    eventData.append("local", formData.local);
    eventData.append("preco", formData.preco);
    eventData.append("id_categoria", formData.id_categoria);

    if (formData.url_link_externo) {
        eventData.append("url_link_externo", formData.url_link_externo);
    }

    imagens.forEach((imagem) => {
      eventData.append("imagens", imagem);
    });

    try {
      await axios.post(`${API_BASE_URL}/api/events`, eventData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Evento cadastrado com sucesso!");
      setTimeout(() => navigate("/"), 2000); // Redireciona para a home
    } catch (error) {
      console.error("Erro ao cadastrar evento:", error);
      toast.error(
        error.response?.data?.message || "Erro ao cadastrar o evento."
      );
    }
  };

  return (
    <>
      <Header />
      <div className="registration-container">
        <div className="registration-wrapper">
          <BackLink to="/" />
          <h1 className="registration-title">Cadastro de Evento</h1>
          <h3 className="registration-subtitle">
            Preencha as informações do evento para cadastrá-lo
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
              <label htmlFor="imagens">Anexar Imagens (até 5) *</label>
              <input
                id="imagens"
                type="file"
                name="imagens"
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="file-input"
                required
              />
              {imagePreviews.length > 0 && (
                <div className="image-preview-container">
                  {imagePreviews.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="image-preview"
                    />
                  ))}
                </div>
              )}
            </div>

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

            <div className="form-actions">
              <Button type="submit" className="full">
                Cadastrar Evento
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}