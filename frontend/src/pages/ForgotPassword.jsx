// frontend/src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import AuthLayout from "../components/AuthLayout";
import BackLink from "../components/BackLink";
import Button from "../components/Button";
import TextField from "../components/TextField";

import "../components/TextField.css";
import "./Login.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;
export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message ||
            "Se o e-mail existir, enviaremos um link de redefinição."
        );
      } else {
        toast.error(data.message || "Erro ao solicitar redefinição de senha.");
      }
    } catch (err) {
      console.error("Erro ao enviar e-mail de recuperação:", err);
      toast.error("Erro inesperado ao enviar o e-mail.");
    }
  };

  return (
    <AuthLayout
      left={
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div className="brand">EVENTURA</div>
          <p className="tagline">Cada evento, uma nova aventura!</p>
        </div>
      }
    >
      <BackLink to="/" />

      <h1>REDEFINIR SUA SENHA</h1>
      <p className="muted">
        Digite o seu endereço de e-mail no campo abaixo e enviaremos uma
        mensagem para ele
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <TextField
          id="email"
          label="E-mail"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          isEditable={true}
        />

        <Button type="submit" className="full">
          Enviar E-mail
        </Button>
      </form>

      <div className="links">
        <span>Já possui conta?</span>
        <Link to="/login">Fazer Login</Link>
      </div>
    </AuthLayout>
  );
}
