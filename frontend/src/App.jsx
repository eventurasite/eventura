// frontend/src/App.jsx
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function App({ children }) {
  useEffect(() => {
    const handleAuthRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        // 1. Salva o token recebido
        localStorage.setItem("authToken", token);

        try {
          // 2. Usa o token para buscar os dados do usuário
          const response = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const userData = response.data;

          // 3. Salva os outros dados essenciais
          localStorage.setItem("userId", userData.id_usuario);
          localStorage.setItem("userName", userData.nome);
          localStorage.setItem("userType", userData.tipo);
          localStorage.setItem("userPhotoUrl", userData.url_foto_perfil || "");

        } catch (error) {
          console.error("Erro ao buscar dados do usuário após login com Google:", error);
          // Limpa em caso de erro para não manter um estado de login inconsistente
          localStorage.clear(); 
        } finally {
          // 4. Limpa o token da URL para o usuário não vê-lo
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