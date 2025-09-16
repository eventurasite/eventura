// frontend/src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import './ResetPasswordPage.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar o e-mail será adicionada aqui depois
    console.log('E-mail enviado:', email);
  };

  return (
    <div className="reset-password-wrap">
      <AuthLayout />
      <div className="reset-password-right-panel">
        <Link to="/" className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12 8H4M4 8l3-3m-3 3l3 3" />
          </svg>
        </Link>
        <h2>REDEFINIR SUA SENHA</h2>
        <p className="subtitle">Digite o seu endereço de e-mail no campo abaixo e enviaremos uma mensagem para ele</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Enviar E-mail</button>
        </form>
        <div className="links">
          <Link to="/login" className="login-link">Já possui conta? Fazer Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;