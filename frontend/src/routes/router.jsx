import React from "react";
import { createBrowserRouter } from "react-router-dom";

// import das páginas
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Reset_Password from "../pages/ResetPassword";

import AdminDashboard from "../pages/AdminDashboard";

// import do nosso componente de proteção
import ProtectedRoute from "../components/ProtectedRoute";

import ForgotPassword from "../pages/ForgotPassword";

import Reset_Password from "../pages/ResetPassword";

import AdminDashboard from "../pages/AdminDashboard";

// import do nosso componente de proteção
import ProtectedRoute from "../components/ProtectedRoute";


export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },


  { path: "/forgotpassword", element: <ForgotPassword /> },


  { path: "/resetpassword", element: <Reset_Password /> },
  
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['administrador']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },

]);

