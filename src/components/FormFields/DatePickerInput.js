import React from "react";

const DatePickerInput = ({
  title,
  required,
  placeholder,
  minDate,
  onChange,
  value,
  className,
}) => {
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  return (
    <div className="mb-6">
      {title && (
        <label className="block text-black text-sm font-light mb-2">
          {title}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="datetime-local"
        value={value ? formatDate(value) : ""}
        onChange={onChange}
        min={minDate ? formatDate(minDate) : ""}
        placeholder={placeholder}
        required={required}
        className={className}
      />
    </div>
  );
};

export default DatePickerInput;
