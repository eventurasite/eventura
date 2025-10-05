import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
                  value={user.telefone}
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
              <Button
                onClick={handleDeleteAccount}
                className="delete-button"
              >
                Excluir conta
              </Button>
              <Button onClick={handleSave} className="save-button">
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
