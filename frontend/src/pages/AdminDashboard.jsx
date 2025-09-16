// frontend/src/pages/AdminDashboard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

// um estilo simples para a página
const styles = {
  container: {
    padding: "40px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "Roboto, sans-serif",
  },
  header: {
    borderBottom: "1px solid #eee",
    paddingBottom: "20px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "32px",
    color: "#4849E8", // roxo escuro
  },
  button: {
    backgroundColor: "#FEF15F", // amarelo
    color: "#4849E8",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "none",
  },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Admin";

  const handleLogout = () => {
    localStorage.clear(); // Limpa todos os dados de login
    navigate("/"); // Redireciona para a home
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Painel do Administrador</h1>
        <button onClick={handleLogout} style={styles.button}>
          Sair (Logout)
        </button>
      </div>
      <h2>Bem-vindo, {userName}!</h2>
      <p>Esta é uma área protegida, visível apenas para administradores.</p>
      <Link to="/" style={{ ...styles.button, backgroundColor: "#eee", marginTop: '20px', display: 'inline-block' }}>
        Voltar para a Home
      </Link>
    </div>
  );
}