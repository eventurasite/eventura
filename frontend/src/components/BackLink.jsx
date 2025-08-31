import React from "react";
import { Link } from "react-router-dom";

export default function BackLink({ to = "/" }) {
  return (
    <Link to={to} className="back-arrow" aria-label="Voltar">
      <i className="bi bi-arrow-left"></i>
    </Link>
  );
}
