/**
 * Custom error class for API errors
 */
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Handle MySQL duplicate entry errors
   */
  const handleDuplicateFieldsDB = (err) => {
    // Extract field name from error message
    const field = err.message.match(/key '([^']+)'/)[1].split('.')[1];
    const message = `Duplicate value for ${field}. Please use another value.`;
    return new AppError(message, 400);
  };
  
  /**
   * Handle JWT errors
   */
  const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
  
  /**
   * Handle JWT expired error
   */
  const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again.', 401);
  
  /**
   * Global error handler middleware
   */
  const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    // Development error response (with stack trace)
    if (process.env.NODE_ENV === 'development') {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
      });
    }
  
    // Production error handling
    let error = { ...err };
    error.message = err.message;
  
    // Handle specific error types
    if (err.code === 'ER_DUP_ENTRY') error = handleDuplicateFieldsDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message
      });
    }
  
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  };
  
  module.exports = {
    AppError,
    errorHandler
  };