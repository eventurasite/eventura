// frontend/src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at turpis eu urna semper fringilla. Ut ut condimentum mauris, eget tincidunt ligula. Sed mattis iaculis magna, et commodo odio molestie vel. Integer imperdiet accumsan ante at molestie. Sed eget feugiat dui, eu tempus nibh.',
  url_foto_perfil: 'https://via.placeholder.com/150', // Imagem de exemplo
};

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(mockUser);
  const [editMode, setEditMode] = useState({});

  const handleEditToggle = (field) => {
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Lógica para salvar os dados no backend
    console.log("Dados do usuário salvos:", user);
    setEditMode({}); // Desativa o modo de edição
    navigate('/'); // Redireciona para a página principal após salvar
  };
  
  const handleDeleteAccount = () => {
    // Lógica para excluir a conta
    if (window.confirm("Tem certeza de que deseja excluir a sua conta? Esta ação é irreversível.")) {
      console.log("Conta do usuário excluída.");
      // Lógica para desautenticar o usuário e redirecionar
      localStorage.clear();
      navigate('/');
      window.location.reload();
    }
  };

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
            {/* Seção de foto, nome e descrição */}
            <div className="profile-info-section">
              <div className="profile-picture">
                <img src={user.url_foto_perfil} alt="Foto de perfil" />
              </div>
              <div className="profile-text">
                <h2>{user.nome}</h2>
                <p>{user.descricao}</p>
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
                  isEditable={editMode.nome} // <-- Nova propriedade
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
                  isEditable={editMode.email} // <-- Nova propriedade
                  rightSlot={
                    <button onClick={() => handleEditToggle('email')} className="edit-button">
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                  }
                />
                <TextField 
                  label="Telefone"
                  id="telefone"
                  name="telefone"
                  value={user.telefone}
                  onChange={handleChange}
                  isEditable={editMode.telefone} // <-- Nova propriedade
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
                  value={user.descricao}
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
              <Button onClick={handleSave} className="save-button">Salvar</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}