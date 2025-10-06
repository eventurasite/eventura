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
// import do nosso componente de proteção
import ProtectedRoute from "../components/ProtectedRoute";
import EventRegistration from "../pages/EventRegistration";
import EventDetail from "../pages/EventDetail";


export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/resetpassword", element: <ResetPassword /> },
  { path: "/profile", element: <UserProfile /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/resetpassword", element: <ResetPassword /> },
  { path: "/sobre", element: <Sobre /> },
  // A nova rota fixa para o nosso evento único
  { path: "/evento", element: <EventDetail /> },
  
  // Linha AJUSTADA para usar :eventId
  { path: "/evento/:eventId", element: <EventDetail /> },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["administrador"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);
