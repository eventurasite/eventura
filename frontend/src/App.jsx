// frontend/src/App.jsx
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function App({ children }) {
  useEffect(() => {
    const handleGoogleAuthRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      // Se o token NÃO existe na URL, não faz nada
      if (!token) return;

      // 1. Armazena o token
      localStorage.setItem("authToken", token);

      try {
        // 2. Busca os dados do usuário via /me
        const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;

        // 3. Armazena dados do usuário no localStorage
        localStorage.setItem("userId", userData.id_usuario);
        localStorage.setItem("userName", userData.nome);
        localStorage.setItem("userType", userData.tipo);
        localStorage.setItem("userPhotoUrl", userData.url_foto_perfil || "");

      } catch (error) {
        console.error("Erro ao buscar dados do usuário após login Google:", error);
        localStorage.clear();
      }

      // 4. Limpa a URL removendo o ?token=
      window.history.replaceState({}, document.title, "/");

      // 5. Opcional: recarregar a página
      window.location.reload();
    };

    handleGoogleAuthRedirect();
  }, []);

  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
