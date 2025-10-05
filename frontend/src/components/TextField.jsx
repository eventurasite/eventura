// frontend/src/components/TextField.jsx
import React from "react"; 
export default function TextField({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  rightSlot = null
}) {
  return (
    <div className="tf">
      <label htmlFor={id}>{label}</label>
      <div className="tf-box">
        <input
          id={id}
          name={name || id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete="on"
        />
        {rightSlot && <div className="tf-right">{rightSlot}</div>}
      </div>
    </div>
  );
}