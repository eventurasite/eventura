// frontend/src/pages/EventRegistration.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import TextField from "../components/TextField";
import BackLink from "../components/BackLink";
import { toast } from "react-toastify";

// Importa os estilos (vamos criar este arquivo no próximo passo)
import "./EventRegistration.css"; 

// Opções mockadas para Categoria e Tipo de Ingresso
// No projeto real, Categoria viria da API
const CATEGORIAS = [
  "Música",
  "Esportes",
  "Tecnologia",
  "Arte e Cultura",
  "Gastronomia",
  "Comédia",
];

const TIPOS_INGRESSO = [
  { value: "gratuito", label: "Gratuito" },
  { value: "pago", label: "Pago" },
];

export default function EventRegistration() {
  // Estado dos campos
  const [formData, setFormData] = useState({
    titulo: "",
    data: "",
    hora: "",
    categoria: "",
    local: "",
    tipoIngresso: "gratuito",
    preco: 0.0,
    descricao: "",
    imagens: null, // Para armazenar o objeto FileList
  });

  // Estado para a pré-visualização das imagens (opcional, para visualização no frontend)
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, imagens: files }));
    
    // Gera pré-visualização das imagens
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);

    if (files.length > 5) {
      toast.warn("Recomendamos não subir mais de 5 imagens por evento.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.tipoIngresso === "gratuito") {
        formData.preco = 0.0;
    }

    console.log("Dados do Evento a serem enviados (Ação Mockada):", formData);
    toast.success("Evento submetido para cadastro! (Ação mockada)");

    // TODO: Implementar a lógica de envio para a API (usando FormData para as imagens)
    // Exemplo de como serializar:
    /*
    const eventData = new FormData();
    eventData.append('titulo', formData.titulo);
    // ... outros campos
    formData.imagens.forEach((file, index) => {
        eventData.append(`imagem_${index}`, file);
    });

    axios.post('http://localhost:5000/api/events/create', eventData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    })
    */
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
                  type="text"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Nome do Evento"
                  required
                  isEditable={true}
                />
                
                <TextField
                  id="data"
                  label="Data *"
                  name="data"
                  type="date"
                  value={formData.data}
                  onChange={handleChange}
                  required
                  isEditable={true}
                />

                <TextField
                  id="hora"
                  label="Hora *"
                  name="hora"
                  type="time"
                  value={formData.hora}
                  onChange={handleChange}
                  required
                  isEditable={true}
                />

                <div className="tf">
                  <label htmlFor="categoria">Categoria *</label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                    className="custom-select is-editable"
                  >
                    <option value="" disabled>Selecione uma categoria</option>
                    {CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
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
                  type="text"
                  value={formData.local}
                  onChange={handleChange}
                  placeholder="Endereço completo do evento"
                  required
                  isEditable={true}
                />
                
                <div className="tf">
                  <label htmlFor="tipoIngresso">Tipo de Ingresso *</label>
                  <select
                    id="tipoIngresso"
                    name="tipoIngresso"
                    value={formData.tipoIngresso}
                    onChange={handleChange}
                    required
                    className="custom-select is-editable"
                  >
                    {TIPOS_INGRESSO.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                <TextField
                  id="preco"
                  label="Preço do Ingresso"
                  name="preco"
                  type="number"
                  value={formData.preco}
                  onChange={handleChange}
                  placeholder="0.00"
                  required={formData.tipoIngresso === 'pago'}
                  isEditable={formData.tipoIngresso === 'pago'}
                  // Desabilita se for gratuito
                  disabled={formData.tipoIngresso === 'gratuito'} 
                />

                <div className="tf">
                  <label htmlFor="imagens">Anexar Imagens</label>
                  <input
                    id="imagens"
                    type="file"
                    name="imagens"
                    onChange={handleImageChange}
                    multiple
                    accept="image/*"
                    className="file-input"
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

              </div>
            </div>

            {/* DESCRIÇÃO - ABAIXO DAS DUAS COLUNAS */}
            <div className="description-field">
              <label htmlFor="descricao">Descrição do Evento *</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Detalhes sobre o evento, atrações, público-alvo, etc."
                required
              />
            </div>
            
            {/* BOTÃO */}
            <div className="form-actions">
                <Button type="submit" className="full">Cadastrar Evento</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}