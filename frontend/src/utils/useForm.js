import { useState, useCallback } from 'react';

/**
 * Custom hook for form handling with validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validators - Object with validation functions for each field
 * @param {Function} onSubmit - Function to call on form submission
 * @returns {Object} Form state and handlers
 */
const useForm = (initialValues = {}, validators = {}, onSubmit = () => {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validate all fields and return if the form is valid
  const validateAll = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(validators).forEach((fieldName) => {
      const value = values[fieldName];
      const validator = validators[fieldName];
      const error = validator ? validator(value) : '';
      
      if (error) {
        formIsValid = false;
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [values, validators]);

  // Handle field change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues((prevValues) => ({
      ...prevValues,
      [name]: fieldValue,
    }));

    // If field has been touched, validate it
    if (touched[name] && validators[name]) {
      const error = validators[name](fieldValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  }, [validators, touched]);

  // Handle direct value setting (for non-input elements)
  const setValue = useCallback((name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // If field has been touched, validate it
    if (touched[name] && validators[name]) {
      const error = validators[name](value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  }, [validators, touched]);

  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));

    if (validators[name]) {
      const error = validators[name](value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  }, [validators]);

  // Handle form reset
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(validators).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const formIsValid = validateAll();
    
    if (formIsValid) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateAll, validators, onSubmit]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    resetForm,
    validateAll,
  };
};

export default useForm;