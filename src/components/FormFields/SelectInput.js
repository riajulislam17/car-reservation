import React from "react";

const SelectInput = ({
  placeholder,
  title,
  options,
  onChange,
  required,
  className,
  value,
  optionsType,
  disabled,
}) => {
  return (
    <div className="mb-6">
      {title && (
        <label className="block text-black text-sm font-light mb-2">
          {title}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        placeholder={placeholder}
        required={required}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          const selectedValue = event.target.value;
          const selectedOption = options.find((option) =>
            optionsType !== "components"
              ? option.value === selectedValue
              : option.id === selectedValue
          );
          onChange(
            optionsType !== "components"
              ? selectedOption
              : JSON.stringify(selectedOption)
          );
        }}
        className={className}
      >
        <option value="" disabled hidden></option>
        {optionsType !== "components"
          ? options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[#DFDFFF] p-5 my-4 text-xl cursor-pointer"
              >
                {option.label}
              </option>
            ))
          : options.map((option) => (
              <option
                key={option.id}
                value={option.id}
                className="bg-[#DFDFFF] p-5 my-4 text-xl cursor-pointer"
              >
                {`${option.make} - (${option.seats} seats | ${option.bags} bags) - (`}
                {Object.entries(option.rates).map(([key, value]) => (
                  <span key={key}>{`${key}: $${value} `}</span>
                ))}
                {")"}
              </option>
            ))}
      </select>
    </div>
  );
};

export default SelectInput;
