// frontend/src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import BackLink from '../components/BackLink';
import Button from '../components/Button';
import TextField from '../components/TextField';
import './UserProfile.css';

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Inicia como nulo para sabermos quando está carregando
  const [editMode, setEditMode] = useState({});

  // Efeito para buscar os dados do usuário ao carregar a página
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
        const response = await axios.get(`http://localhost:5000/api/auth/${userId}`);
        setUser(response.data);
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
    setUser(prev => ({ ...prev, [name]: value }));
  };

  // Função para salvar as alterações
  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.put(`http://localhost:5000/api/auth/${user.id_usuario}`, user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Perfil atualizado com sucesso!");
      setEditMode({}); // Desativa todos os modos de edição
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      toast.error(error.response?.data?.message || "Erro ao salvar o perfil.");
    }
  };
  
  // Função para excluir a conta
  const handleDeleteAccount = async () => {
    if (window.confirm("Tem certeza de que deseja excluir a sua conta? Esta ação é irreversível.")) {
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`http://localhost:5000/api/auth/${user.id_usuario}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Conta excluída com sucesso.");
        // Limpa o storage e redireciona
        localStorage.clear();
        navigate('/');
        window.location.reload(); // Força a recarga para atualizar o estado do Header
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        toast.error(error.response?.data?.message || "Não foi possível excluir a conta.");
      }
    }
  };

  // Renderiza um estado de carregamento enquanto os dados não chegam
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
                <img src={user.url_foto_perfil || 'https://via.placeholder.com/150'} alt="Foto de perfil" />
              </div>
              <div className="profile-text">
                <h2>{user.nome}</h2>
                <p>{user.descricao || 'Sem descrição.'}</p>
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
                    <button onClick={() => handleEditToggle('nome')} className="edit-button">
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
                  // Lógica condicional: só é editável se o provedor NÃO for 'google'
                  isEditable={user.authProvider !== 'google' && editMode.email} 
                  rightSlot={
                    // Desabilitamos o botão de edição se for um usuário Google
                    <button 
                      onClick={() => handleEditToggle('email')} 
                      className="edit-button"
                      disabled={user.authProvider === 'google'}
                      title={user.authProvider === 'google' ? "Não é possível editar o e-mail de contas Google" : "Editar e-mail"}
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                  }
                />
                <TextField 
                  label="Telefone"
                  id="telefone"
                  name="telefone"
                  value={user.telefone || ''}
                  onChange={handleChange}
                  isEditable={editMode.telefone}
                  rightSlot={
                    <button onClick={() => handleEditToggle('telefone')} className="edit-button">
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
                  value={user.descricao || ''}
                  onChange={handleChange}
                  readOnly={!editMode.descricao}
                  className={editMode.descricao ? 'is-editable-textarea' : ''}
                />
                <button onClick={() => handleEditToggle('descricao')} className="edit-button-desc">
                  <i className="bi bi-pencil-fill"></i>
                </button>
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