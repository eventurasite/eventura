import { createBrowserRouter } from "react-router-dom";

// import das páginas
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import AdminDashboard from "../pages/AdminDashboard";

// import do nosso componente de proteção
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/resetpassword", element: <ResetPassword /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['administrador']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);

