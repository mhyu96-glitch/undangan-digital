/**
 * Validation utilities for form inputs
 */

export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Field ini wajib diisi';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Minimal ${min} karakter`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Maksimal ${max} karakter`;
    }
    return null;
  },

  email: (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Format email tidak valid';
    }
    return null;
  },

  phone: (value) => {
    if (value && !/^(\+62|62|0)[0-9]{9,13}$/.test(value.replace(/[\s-]/g, ''))) {
      return 'Format nomor telepon tidak valid';
    }
    return null;
  },

  name: (value) => {
    if (value && !/^[a-zA-Z\s.]+$/.test(value)) {
      return 'Nama hanya boleh mengandung huruf dan spasi';
    }
    return null;
  }
};

/**
 * Validate a single field with multiple validators
 * @param {any} value - Value to validate
 * @param {Array} validationRules - Array of validation functions
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (value, validationRules = []) => {
  for (const rule of validationRules) {
    const error = rule(value);
    if (error) {
      return error;
    }
  }
  return null;
};

/**
 * Validate entire form object
 * @param {Object} formData - Form data object
 * @param {Object} validationSchema - Schema with validation rules for each field
 * @returns {Object} - Object with errors for each field
 */
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  
  Object.keys(validationSchema).forEach(fieldName => {
    const fieldValue = formData[fieldName];
    const fieldRules = validationSchema[fieldName];
    const error = validateField(fieldValue, fieldRules);
    
    if (error) {
      errors[fieldName] = error;
    }
  });
  
  return errors;
};

/**
 * Check if form has any errors
 * @param {Object} errors - Errors object from validateForm
 * @returns {boolean} - True if form is valid (no errors)
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
