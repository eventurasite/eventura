// frontend/src/components/TextField.jsx
import React from "react"; 
export default function TextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  rightSlot = null,
  isEditable = false, // <-- Nova propriedade
}) {
  return (
    <div className="tf">
      <label htmlFor={id}>{label}</label>
      <div className="tf-box">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete="on"
          readOnly={!isEditable} 
          className={isEditable ? "is-editable" : ""} 
        />
        {rightSlot && <div className="tf-right">{rightSlot}</div>}
      </div>
    </div>
  );
}