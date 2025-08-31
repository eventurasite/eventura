import React, { useState } from "react";
import TextField from "./TextField";

export default function PasswordField({
  id = "pwd",
  label = "Senha",
  placeholder = "Digite sua senha",
  ...props
}) {
  const [show, setShow] = useState(false);

  return (
    <TextField
      id={id}
      label={label}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      rightSlot={
        <button
          type="button"
          className="ghost"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          title={show ? "Ocultar senha" : "Mostrar senha"}
        >
          {show ? (
            <i className="bi bi-eye-slash"></i>
          ) : (
            <i className="bi bi-eye-fill"></i>
          )}
        </button>
      }
      {...props}
    />
  );
}
