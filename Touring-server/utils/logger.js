// utils/logger.js
const { createLogger, format, transports } = require('winston');
const path = require('path');

// Define log format
const logFormat = format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create logger instance
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json(),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      )
    }),
    new transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error' 
    }),
    new transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log') 
    })
  ],
  exceptionHandlers: [
    new transports.File({ 
      filename: path.join(__dirname, '../logs/exceptions.log') 
    })
  ]
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  throw reason;
});

module.exports = logger;