import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");

  // 1. Verifica se o usuário está logado
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 2. Verifica se a rota exige um tipo de usuário específico
  if (allowedRoles && !allowedRoles.includes(userType)) {
    // Se o usuário não tiver a permissão necessária, redireciona para a home
    // (ou futuramente para uma página de "acesso negado")
    return <Navigate to="/" />;
  }

  // 3. Se tudo estiver certo, renderiza a página solicitada
  return children;
}