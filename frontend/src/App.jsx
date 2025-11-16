// frontend/src/App.jsx
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function App({ children }) {
  useEffect(() => {
    const handleAuthRedirect = async () => {

      const currentPath = window.location.pathname;

      // Só trata token se estiver no fluxo do Google Login
      if (currentPath !== "/login" && currentPath !== "/google/callback") return;

      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        localStorage.setItem("authToken", token);

        try {
          const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const userData = response.data;

          localStorage.setItem("userId", userData.id_usuario);
          localStorage.setItem("userName", userData.nome);
          localStorage.setItem("userType", userData.tipo);
          localStorage.setItem("userPhotoUrl", userData.url_foto_perfil || "");
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          localStorage.clear();
        } finally {
          window.history.replaceState({}, document.title, "/");
        }
      }
    };

    handleAuthRedirect();
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
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
