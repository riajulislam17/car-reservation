import React from "react";

const TextInputField = ({
  placeholder,
  required,
  title,
  onChange,
  value,
  disabled,
  type,
  className,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-black font-light mb-2">
        {title}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className={className}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TextInputField;
