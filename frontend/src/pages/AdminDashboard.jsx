// frontend/src/pages/AdminDashboard.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BackLink from "../components/BackLink";
import Button from "../components/Button"; // Para o botão Sair
// Importamos o CSS que contém os estilos do container e dos links
import "../pages/UserProfile.css"; 

export default function AdminDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Admin";

  const handleLogout = () => {
    localStorage.clear(); // Limpa todos os dados de login
    navigate("/"); // Redireciona para a home
  };

  return (
    <>
      <Header />
      {/* 1. Contêiner de fundo padrão (com o pattern) */}
      <div className="user-profile-container"> 
        {/* 2. Wrapper do card centralizado e branco */}
        <div className="profile-wrapper">
          
          {/* 3. Cabeçalho da Seção (título + backlink) */}
          <div className="profile-header-section">
            {/* O título usa o estilo padrão das páginas de perfil/cadastro */}
            <h1 className="profile-title">Painel do Administrador</h1> 
            <BackLink to="/" />
          </div>

          {/* Conteúdo principal dentro de um padding para alinhamento */}
          <div style={{ padding: "0 20px" }}> 
            <h2>Bem-vindo, {userName}!</h2>
            <p className="muted" style={{ marginBottom: '30px', fontSize: '1em' }}>
                Esta é uma área protegida, visível apenas para administradores.
            </p>
          
            {/* Seção de Links (usando classes de padronização) */}
            <div className="admin-link-section">
              <h3>Recursos Administrativos</h3>
              <Link 
                to="/admin/denuncias" 
                className="admin-action-link" // Estilo para o link de ação (adicionado no Passo 2)
              >
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  Gerenciar Denúncias Pendentes
              </Link>
            </div>

            {/* Botão de Logout padronizado */}
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <Button 
                onClick={handleLogout} 
                // Reutilizando o estilo de botão "perigoso" (delete-button) para Sair do painel
                className="delete-button" 
                style={{ maxWidth: '300px' }}
              >
                Sair do Painel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}