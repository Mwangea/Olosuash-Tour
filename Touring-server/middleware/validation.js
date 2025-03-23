const { 
    validateSignUpData, 
    validateLoginData, 
    validatePasswordResetData 
  } = require('../utils/validators');
  
  /**
   * Validate sign up request
   */
  const validateSignUp = (req, res, next) => {
    const { isValid, errors } = validateSignUpData(req.body);
    
    if (!isValid) {
      return res.status(400).json({
        status: 'fail',
        errors
      });
    }
    
    next();
  };
  
  /**
   * Validate login request
   */
  const validateLogin = (req, res, next) => {
    const { isValid, errors } = validateLoginData(req.body);
    
    if (!isValid) {
      return res.status(400).json({
        status: 'fail',
        errors
      });
    }
    
    next();
  };
  
  /**
   * Validate forgot password request
   */
  const validateForgotPassword = (req, res, next) => {
    if (!req.body.email) {
      return res.status(400).json({
        status: 'fail',
        errors: {
          email: 'Email is required'
        }
      });
    }
    
    next();
  };
  
  /**
   * Validate reset password request
   */
  const validateResetPassword = (req, res, next) => {
    const { isValid, errors } = validatePasswordResetData(req.body);
    
    if (!isValid) {
      return res.status(400).json({
        status: 'fail',
        errors
      });
    }
    
    next();
  };
  
  module.exports = {
    validateSignUp,
    validateLogin,
    validateForgotPassword,
    validateResetPassword
  };