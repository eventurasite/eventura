import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../components/AuthLayout";
import BackLink from "../components/BackLink";
import Button from "../components/Button";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../components/TextField.css";
import "./Login.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  // Captura token do Google se vier na query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/"); // redireciona para home
    }
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("Você deve aceitar os Termos de Uso.");
      return;
    }

    if (pwd !== confirmPwd) {
      alert("As senhas não conferem.");
      return;
    }

    if(!email){
      return toast.error("O campo de email é obrigatório.");
    }


    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          nome: name,
          email,
          telefone: phone,
          senha: pwd,
        }
      );

      toast.success("Usuário registrado com sucesso!");
      navigate("/login"); // redireciona para login após registro
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Erro ao conectar com o servidor");
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
      <BackLink to="/" />

      <h1>CADASTRE-SE</h1>
      <p className="muted">Crie sua conta para interagir e divulgar eventos!</p>

      <form onSubmit={onSubmit} className="form" noValidate>
        <TextField
          id="name"
          label="Nome"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome Completo"
          required
          isEditable={true}
        />

        <TextField
          id="email"
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
          isEditable={true}
        />

        <TextField
          id="phone"
          label="Telefone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefone"
          isEditable={true}
        />

        <PasswordField
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Senha"
          required
          isEditable={true}
        />

        <PasswordField
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          placeholder="Confirmar Senha"
          required
          isEditable={true}
        />

        <label style={{ fontSize: 14, margin: "8px 0" }}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          Eu concordo com os <a href="#">Termos de Uso</a>
        </label>

        <Button type="submit" className="full">
          Cadastrar-se
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
          Cadastrar com Google
        </Button>

        <div className="links">
          <span>Já possui conta?</span>
          <Link to="/login">Fazer Login</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
