import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/Header";
import BackLink from "../components/BackLink";
import Button from "../components/Button";
import TextField from "../components/TextField";
import "./UserProfile.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Componente para o corpo do Toast de Confirmação
const ConfirmationToast = ({ closeToast, message, onConfirm }) => (
  <div className="toast-confirmation-body">
    <p>{message}</p>
    <div className="toast-confirmation-buttons">
      <button className="toast-btn toast-btn-cancel" onClick={closeToast}>
        Cancelar
      </button>
      <button
        className="toast-btn toast-btn-confirm"
        onClick={() => {
          onConfirm();
          closeToast();
        }}
      >
        Confirmar
      </button>
    </div>
  </div>
);

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");

      if (!userId || !token) {
        toast.error("Você precisa estar logado para ver seu perfil.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/${userId}`);
        const userData = response.data;
        setUser(userData);

        if (userData.url_foto_perfil) {
          setPreview(`${API_BASE_URL}${userData.url_foto_perfil}`);
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error);
        toast.error("Não foi possível carregar os dados do perfil.");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditToggle = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    let updatedUser = { ...user };

    if (selectedFile) {
      const formData = new FormData();
      formData.append("profileImage", selectedFile);

      try {
        const uploadResponse = await axios.post(
          `${API_BASE_URL}/api/auth/upload/${user.id_usuario}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        updatedUser.url_foto_perfil = uploadResponse.data.url_foto_perfil;
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        toast.error(
          error.response?.data?.message || "Erro ao fazer upload da imagem."
        );
        return;
      }
    }

    try {
      // 1. Captura a resposta do backend
      const response = await axios.put(
        `${API_BASE_URL}/api/auth/${user.id_usuario}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 2. Extrai o usuário ATUALIZADO da resposta
      const userFromApi = response.data.usuario;

      setUser(userFromApi); // <-- CORREÇÃO: Usa os dados que vieram da API

      if (userFromApi.url_foto_perfil) {
        // 3. Usa a variável userFromApi aqui
        const fullUrl = `${API_BASE_URL}${userFromApi.url_foto_perfil}`;
        setPreview(fullUrl);
        localStorage.setItem("userPhotoUrl", userFromApi.url_foto_perfil);
      } else {
        setPreview(null);
        localStorage.setItem("userPhotoUrl", "");
      }

      toast.success("Perfil atualizado com sucesso!");
      setEditMode({});
      setSelectedFile(null);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      toast.error(error.response?.data?.message || "Erro ao salvar o perfil.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmAction = async () => {
      const token = localStorage.getItem("authToken");
      try {
        await axios.delete(`${API_BASE_URL}/api/auth/${user.id_usuario}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Conta excluída com sucesso.");
        localStorage.clear();
        navigate("/");
        window.location.reload();
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        toast.error(
          error.response?.data?.message || "Não foi possível excluir a conta."
        );
      }
    };

    toast.warn(
      <ConfirmationToast
        message="Tem certeza de que deseja excluir a sua conta? Esta ação é irreversível."
        onConfirm={confirmAction}
      />,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: "colored",
      }
    );
  };

  const handleRemovePhoto = async () => {
    if (!user) return;

    const confirmAction = async () => {
      const token = localStorage.getItem("authToken");
      try {
        await axios.delete(
          `${API_BASE_URL}/api/auth/upload/${user.id_usuario}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPreview(null);
        setUser((prevUser) => ({ ...prevUser, url_foto_perfil: null }));
        localStorage.setItem("userPhotoUrl", "");

        toast.success("Foto de perfil removida com sucesso!");
      } catch (error) {
        console.error("Erro ao remover a foto:", error);
        toast.error(
          error.response?.data?.message || "Não foi possível remover a foto."
        );
      }
    };

    toast.warn(
      <ConfirmationToast
        message="Tem certeza de que deseja remover sua foto de perfil?"
        onConfirm={confirmAction}
      />,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: "colored",
      }
    );
  };

  if (!user) {
    return (
      <>
        <Header />
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          Carregando perfil...
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="user-profile-container">
        <div className="profile-wrapper">
          <div className="profile-header-section">
            <h1 className="profile-title">Perfil do usuário</h1>
            <BackLink />
          </div>
          <div className="profile-content">
            <div className="profile-info-section">
              <div className="profile-picture">
                {preview && <img src={preview} alt="Foto de perfil" />}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept="image/*"
                />
                <button
                  className="edit-photo-button"
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="bi bi-camera-fill"></i> Alterar Foto
                </button>

                {preview && (
                  <button
                    className="remove-photo-button"
                    onClick={handleRemovePhoto}
                    title="Remover foto"
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                )}
              </div>
              <div className="profile-text">
                <h2>{user.nome}</h2>
                <p>{user.descricao || "Sem descrição."}</p>
              </div>
            </div>

            <div className="profile-edit-section">
              <div className="profile-edit-fields">
                <TextField
                  label="Nome Completo"
                  id="nome"
                  name="nome"
                  value={user.nome}
                  onChange={handleChange}
                  isEditable={editMode.nome}
                  rightSlot={
                    <button
                      onClick={() => handleEditToggle("nome")}
                      className="edit-button"
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                  }
                />
                <TextField
                  label="E-mail"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  isEditable={user.authProvider !== "google" && editMode.email}
                  rightSlot={
                    <button
                      onClick={() => handleEditToggle("email")}
                      className="edit-button"
                      disabled={user.authProvider === "google"}
                      title={
                        user.authProvider === "google"
                          ? "Não é possível editar o e-mail de contas Google"
                          : "Editar e-mail"
                      }
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                  }
                />
                <TextField
                  label="Telefone"
                  id="telefone"
                  name="telefone"
                  value={user.telefone || ""}
                  onChange={handleChange}
                  isEditable={editMode.telefone}
                  rightSlot={
                    <button
                      onClick={() => handleEditToggle("telefone")}
                      className="edit-button"
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                  }
                />
              </div>

              <div className="profile-description-field">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={user.descricao || ""}
                  onChange={handleChange}
                  readOnly={!editMode.descricao}
                  className={editMode.descricao ? "is-editable-textarea" : ""}
                />
                <button
                  onClick={() => handleEditToggle("descricao")}
                  className="edit-button-desc"
                >
                  <i className="bi bi-pencil-fill"></i>
                </button>
              </div>
            </div>

            <div className="profile-actions">
              <Button onClick={handleDeleteAccount} className="delete-button">
                Excluir conta
              </Button>
              <Button onClick={handleSave} className="save-button">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
