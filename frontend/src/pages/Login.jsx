import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import BackLink from "../components/BackLink";
import Button from "../components/Button";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";

import "../components/TextField.css";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const sideRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: pwd }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        alert("Login realizado com sucesso!");
        window.location.href = "/"; // redirecionar para home
      } else {
        const error = await response.json();

        if (error.provider === "google") {
          // redireciona automaticamente para o fluxo Google
          window.location.href = "http://localhost:5000/api/auth/google";
        } else {
          alert(error.message || "Erro ao fazer login");
        }
      }
    } catch (err) {
      console.error("Erro no login", err);
      alert("Erro inesperado no login.");
    }
  };

  return (
    <AuthLayout
      left={
        <div
          ref={sideRef}
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          <div className="brand">EVENTURA</div>
          <p className="tagline">Cada evento, uma nova aventura!</p>
        </div>
      }
    >
      <BackLink to="/" />

      <h1>ENTRAR / LOGAR</h1>
      <p className="muted">
        Entre na sua conta para interagir com agendas e divulgar seus eventos!
      </p>

      <form onSubmit={onSubmit} className="form" noValidate>
        <TextField
          id="email"
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          required
        />

        <PasswordField
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        />

        <div className="forgot-wrap">
          <a href="#">Esqueci minha senha</a>
        </div>

        <Button type="submit" className="full">
          Entrar
        </Button>

        <div className="or">
          <span>ou</span>
        </div>

        <Button
          type="button"
          variant="google"
          className="full"
          onClick={() => {
            window.location.href = "http://localhost:5000/api/auth/google";
          }}
        >
          <img
            alt=""
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width="18"
            height="18"
            style={{ marginRight: 8 }}
          />
          Entrar com Google
        </Button>

        <div className="links">
          <Link to="/register">Criar uma conta</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
