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

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/resetpassword", element: <ResetPassword /> },
  { path: "/profile", element: <UserProfile /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/resetpassword", element: <ResetPassword /> },
  { path: "/sobre", element: <Sobre /> },
  // consertando rota para mandar o id
  { path: "/event/:id", element: <EventDetail /> },
  { path: "/agenda", element: <Agenda /> },
  { path: "/registrarevento", element: <EventRegistration /> },
  { path: "/meuseventos", element: <MyEvents /> },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["administrador"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);
