import { useState } from "react";

function useForm(defaultValue = {}) {
  const [formData, setFormData] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(fieldName, value) {
    setFormData((p) => ({
      ...p,
      [fieldName]: value,
    }));
  }

  function handleChangeFromEvent(e) {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  }

  function reset(data) {
    setFormData(data);
  }

  return {
    formData,
    reset,
    handleChange,
    handleChangeFromEvent,
    loading,
    setLoading,
    errors,
    setErrors,
  };
}
export default useForm;
