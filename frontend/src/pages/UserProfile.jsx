import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import Header from '../components/Header';
import BackLink from '../components/BackLink';
import Button from '../components/Button';
import TextField from '../components/TextField';
import './UserProfile.css';

// Dados de exemplo para o perfil do usuário
const mockUser = {
  nome: 'Paola Silva',
  email: 'paola.silva@gmail.com.br',
  telefone: '(34) 99112-2334',
  descricao:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at turpis eu urna semper fringilla. Ut ut condimentum mauris, eget tincidunt ligula. Sed mattis iaculis magna, et commodo odio molestie vel. Integer imperdiet accumsan ante at molestie. Sed eget feugiat dui, eu tempus nibh.',
  url_foto_perfil: 'https://via.placeholder.com/150',
};

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(mockUser);

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
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');

      if (!userId || !token) {
        toast.error("Você precisa estar logado para ver seu perfil.");
        navigate('/login');
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
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Dados do usuário salvos:', user);
    navigate('/');
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Tem certeza de que deseja excluir a sua conta? Esta ação é irreversível.'
      )
    ) {
      console.log('Conta do usuário excluída.');
      localStorage.clear();
      navigate('/');
      window.location.reload();
      
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    let updatedUser = { ...user };
  
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profileImage', selectedFile);
  
      try {
        const uploadResponse = await axios.post(`${API_BASE_URL}/api/auth/upload/${user.id_usuario}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        updatedUser.url_foto_perfil = uploadResponse.data.url_foto_perfil;
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        toast.error(error.response?.data?.message || "Erro ao fazer upload da imagem.");
        return;
      }
    }
  
    try {
      await axios.put(`${API_BASE_URL}/api/auth/${user.id_usuario}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(updatedUser);
      if (updatedUser.url_foto_perfil) {
        const fullUrl = `${API_BASE_URL}${updatedUser.url_foto_perfil}`;
        setPreview(fullUrl);
        localStorage.setItem('userPhotoUrl', updatedUser.url_foto_perfil);
      } else {
        setPreview(null);
        localStorage.setItem('userPhotoUrl', '');
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
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`${API_BASE_URL}/api/auth/${user.id_usuario}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Conta excluída com sucesso.");
        localStorage.clear();
        navigate('/');
        window.location.reload(); 
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        toast.error(error.response?.data?.message || "Não foi possível excluir a conta.");
      }
    };

    toast.warn(
      <ConfirmationToast
        message="Tem certeza de que deseja excluir a sua conta? Esta ação é irreversível."
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

  const handleRemovePhoto = async () => {
    if (!user) return;

    const confirmAction = async () => {
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`${API_BASE_URL}/api/auth/upload/${user.id_usuario}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setPreview(null);
        setUser(prevUser => ({ ...prevUser, url_foto_perfil: null }));
        localStorage.setItem('userPhotoUrl', '');

        toast.success("Foto de perfil removida com sucesso!");

      } catch (error) {
        console.error("Erro ao remover a foto:", error);
        toast.error(error.response?.data?.message || "Não foi possível remover a foto.");
      }
    };

    toast.warn(
      <ConfirmationToast
        message="Tem certeza de que deseja remover sua foto de perfil?"
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

  if (!user) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Carregando perfil...</div>
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
                  style={{ display: 'none' }}
                  accept="image/*"
                />
                <button className="edit-photo-button" onClick={() => fileInputRef.current.click()}>
                  <i className="bi bi-camera-fill"></i> Alterar Foto
                </button>

                {preview && (
                  <button className="remove-photo-button" onClick={handleRemovePhoto} title="Remover foto">
                    <i className="bi bi-trash-fill"></i>
                  </button>
                )}
              </div>
              <div className="profile-text">
                <h2>{user.nome}</h2>
                <p>{user.descricao || 'Sem descrição.'}</p>
              </div>
            </div>

            {/* Campos editáveis */}
            <div className="profile-edit-section">
              <div className="profile-edit-fields">
                <TextField
                  label="Nome Completo"
                  id="nome"
                  name="nome"
                  value={user.nome}
                  onChange={handleChange}
                  rightSlot={<i className="bi bi-pencil-fill"></i>}
                />

                <TextField
                  label="E-mail"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  rightSlot={<i className="bi bi-pencil-fill"></i>}
                />

                <TextField
                  label="Telefone"
                  id="telefone"
                  name="telefone"
                  value={user.telefone || ''}
                  onChange={handleChange}
                  rightSlot={<i className="bi bi-pencil-fill"></i>}
                />
              </div>

              <div className="profile-description-field">
                <label htmlFor="descricao">Descrição</label>

                <div className="textarea-box">
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={user.descricao}
                    onChange={handleChange}
                    className="is-editable-textarea"
                  />

                  <i className="bi bi-pencil-fill"></i>
                </div>
              </div>
            </div>

            <div className="profile-actions">

              <Button onClick={handleDeleteAccount} className="delete-button">Excluir conta</Button>
              <Button onClick={handleSave} className="save-button">Salvar Alterações</Button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
