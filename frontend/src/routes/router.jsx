import React from "react";
import { createBrowserRouter } from "react-router-dom";

// import das páginas
import Home from "../pages/Home";
import Login from "../pages/Login";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
]);
