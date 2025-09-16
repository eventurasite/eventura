import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import AuthLayout from "../components/AuthLayout";
import BackLink from "../components/BackLink";
import Button from "../components/Button";
import PasswordField from "../components/PasswordField";

import "./Login.css";

export default function ResetPassword() {
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (pwd !== confirmPwd) {
      toast.error("As senhas não conferem.");
      return;
    }

    // pega token da URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      toast.error("Token inválido ou expirado.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        senha: pwd,
      });

      toast.success("Senha redefinida com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao conectar com o servidor.");
      }
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
      <p className="muted">Digite a nova senha</p>

      <form onSubmit={onSubmit} className="form" noValidate>
        <PasswordField
          label="Nova senha"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Digite sua nova senha"
          required
        />

        <PasswordField
          label="Confirmar nova senha"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          placeholder="Confirme a nova senha"
          required
        />

        <Button type="submit" className="full">
          Enviar
        </Button>
      </form>
    </AuthLayout>
  );
}
