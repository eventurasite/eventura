import React from "react";

export default function Button({ variant = "primary", className = "", ...props }) {
  const base = variant === "google" ? "btn google" : "btn btn-primary";
  return <button {...props} className={`${base} ${className}`.trim()} />;
}
