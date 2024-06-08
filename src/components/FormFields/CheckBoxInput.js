import React from "react";

const CheckBoxInput = ({
  title,
  options,
  onChange,
  selectedOptions,
  className,
}) => {
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const option = options.find((opt) => opt.price === value);

    if (checked) {
      onChange([...selectedOptions, option]);
    } else {
      onChange(selectedOptions.filter((opt) => opt.price !== value));
    }
  };

  return (
    <div className="mb-6">
      {title && (
        <label className="block text-gray-700 text-sm font-light mb-2">
          {title}
        </label>
      )}
      {options.map((option) => (
        <div
          key={option.price}
          className="flex justify-between items-center mb-2"
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              value={option.price}
              checked={selectedOptions.some(
                (opt) => opt.price === option.price
              )}
              onChange={handleCheckboxChange}
              className={className}
            />
            <label className="text-black ml-2 my-2">{option.item}</label>
          </div>
          <label className="text-black my-2 flex justify-end">
            {option.item === "Rental Tax"
              ? `${option.price}${option.unit}`
              : `${option.unit}${option.price}`}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckBoxInput;
