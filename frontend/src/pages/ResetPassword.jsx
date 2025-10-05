// frontend/src/pages/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import AuthLayout from "../components/AuthLayout";
import BackLink from "../components/BackLink";
import Button from "../components/Button";
import PasswordField from "../components/PasswordField";

import "./Login.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Link inválido ou expirado.");
    }
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("As senhas não conferem.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Senha redefinida com sucesso. Você já pode entrar.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.message || "Erro ao redefinir senha.");
      }
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      toast.error("Erro inesperado ao redefinir senha.");
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
      <BackLink to="/login" />

      <h1>REDEFINIR SENHA</h1>
      <p className="muted">Digite a nova senha para concluir a redefinição.</p>

      <form onSubmit={onSubmit} className="form" noValidate>
        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          isEditable={true}
        />

        <PasswordField
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirme sua nova senha"
          required
          isEditable={true}
        />

        <Button type="submit" className="full">
          Enviar
        </Button>
      </form>
    </AuthLayout>
  );
}
