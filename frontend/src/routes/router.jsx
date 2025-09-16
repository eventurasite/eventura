import React from "react";
import { createBrowserRouter } from "react-router-dom";

// import das páginas
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard"; // <-- 1. Importe a nova página

// import do nosso componente de proteção
import ProtectedRoute from "../components/ProtectedRoute"; // <-- 2. Importe o protetor

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  
  // --- 3. Adicione a nova rota protegida aqui ---
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['administrador']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);