import React from "react";
import { createBrowserRouter } from "react-router-dom";

// import das páginas
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import UserProfile from "../pages/UserProfile";
import AdminDashboard from "../pages/AdminDashboard";
import Sobre from "../pages/Sobre";
import Agenda from "../pages/Agenda";
// import do nosso componente de proteção
import ProtectedRoute from "../components/ProtectedRoute";
import EventRegistration from "../pages/EventRegistration";
import EventDetail from "../pages/EventDetail";
import MyEvents from "../pages/MyEvents";
import DenouncePage from "../pages/DenouncePage";
import EventEdit from "../pages/EventEdit"; // <-- Importa a nova página de edição
import MyInterests from "../pages/MyInterests"; 
import axios from "axios";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/resetpassword", element: <ResetPassword /> },
  { path: "/profile", element: <UserProfile /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  // { path: "/resetpassword", element: <ResetPassword /> }, // Duplicado, removido ou comente se necessário
  { path: "/sobre", element: <Sobre /> },
  { path: "/event/:id", element: <EventDetail /> }, // Rota de detalhes
  { path: "/agenda", element: <Agenda /> },
  { path: "/registrarevento", element: <EventRegistration /> }, // Rota para criar evento
  { path: "/meuseventos", element: <MyEvents /> },
  {
    path: "/denuncia-evento/:id",
    element: (
        <ProtectedRoute>
            <DenouncePage />
        </ProtectedRoute>
    )
  },
  // --- ROTA PARA EDIÇÃO ---
  {
    path: "/editar-evento/:id", // Rota para editar evento
    element: (
        <ProtectedRoute> {/* Garante que só usuários logados possam editar */}
            <EventEdit />
        </ProtectedRoute>
    )
  },
  // ROTA: Meus Interesses
  { 
    path: "/meus-interesses", 
    element: (
        <ProtectedRoute>
            <MyInterests />
        </ProtectedRoute>
    ) 
  },
  // --- ROTA ADMIN ---
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["administrador"]}> {/* Protegida para admin */}
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);