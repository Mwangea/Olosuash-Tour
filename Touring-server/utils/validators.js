const validator = require('validator');

// Validate username
const isValidUsername = (username) => {
  if (!username || typeof username !== 'string') return false;
  
  // Check length (3-50 characters)
  if (username.length < 3 || username.length > 50) return false;
  
  // Only allow alphanumeric characters and underscores
  return /^[a-zA-Z0-9_]+$/.test(username);
};

// Validate email
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return validator.isEmail(email);
};

// Validate password
const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number
  return /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(password);
};

// Validate sign up data
const validateSignUpData = (data) => {
  const errors = {};
  
  // Validate username
  if (!isValidUsername(data.username)) {
    errors.username = 'Username must be 3-50 characters long and can only contain letters, numbers, and underscores';
  }
  
  // Validate email
  if (!isValidEmail(data.email)) {
    errors.email = 'Please provide a valid email address';
  }
  
  // Validate password
  if (!isValidPassword(data.password)) {
    errors.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate login data
const validateLoginData = (data) => {
  const errors = {};
  
  // Validate email
  if (!isValidEmail(data.email)) {
    errors.email = 'Please provide a valid email address';
  }
  
  // Check if password exists
  if (!data.password || data.password.trim() === '') {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate password reset data
const validatePasswordResetData = (data) => {
  const errors = {};
  
  // Validate password
  if (!isValidPassword(data.password)) {
    errors.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number';
  }
  
  // Check if password confirmation matches
  if (data.password !== data.passwordConfirm) {
    errors.passwordConfirm = 'Password confirmation does not match password';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  isValidUsername,
  isValidEmail,
  isValidPassword,
  validateSignUpData,
  validateLoginData,
  validatePasswordResetData
};