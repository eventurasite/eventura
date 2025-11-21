// frontend/src/routes/router.jsx

import React from "react";
import { createBrowserRouter } from "react-router-dom";
import axios from "axios";

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
import ProtectedRoute from "../components/ProtectedRoute";
import EventRegistration from "../pages/EventRegistration";
import EventDetail from "../pages/EventDetail";
import MyEvents from "../pages/MyEvents";
import DenouncePage from "../pages/DenouncePage";
import EventEdit from "../pages/EventEdit";
import MyInterests from "../pages/MyInterests";
import AdminDenounces from "../pages/AdminDenounces";
import VerifyEmail from "../pages/VerifyEmail";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/resetpassword", element: <ResetPassword /> },
  { path: "/profile", element: <UserProfile /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/sobre", element: <Sobre /> },
  { path: "/event/:id", element: <EventDetail /> },
  { path: "/agenda", element: <Agenda /> },
  { path: "/registrarevento", element: <EventRegistration /> },
  { path: "/meuseventos", element: <MyEvents /> },
  
  {
    path: "/denuncia-evento/:id",
    element: (
      <ProtectedRoute>
        <DenouncePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/editar-evento/:id",
    element: (
      <ProtectedRoute>
        <EventEdit />
      </ProtectedRoute>
    ),
  },

  {
    path: "/meus-interesses",
    element: (
      <ProtectedRoute>
        <MyInterests />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["administrador"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/denuncias",
    element: (
      <ProtectedRoute allowedRoles={["administrador"]}>
        <AdminDenounces />
      </ProtectedRoute>
    ),
  },
]);
