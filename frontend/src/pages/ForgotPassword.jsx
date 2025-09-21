// frontend/src/pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import BackLink from '../components/BackLink';
import Button from "../components/Button";
import TextField from "../components/TextField";

import './ForgotPassword.css';
import '../components/TextField.css';
import './Login.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar o e-mail será adicionada aqui depois
    console.log('E-mail enviado:', email);
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
        Digite o seu endereço de e-mail no campo abaixo e enviaremos uma mensagem para ele
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
        />

        <Button type="submit" className="full">Enviar E-mail</Button>
      </form>
      <div className="links">
        <span>Já possui conta?</span>
        <Link to="/login">Fazer Login</Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;