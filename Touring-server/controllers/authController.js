const passport = require('passport');
const authService = require('../services/authService');
const { AppError } = require('../middleware/errorHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = async (req, res, next) => {
  try {
    const host = `${req.protocol}://${req.get('host')}`;
    const result = await authService.signup(req.body, host);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Please check your email to verify your account.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log in user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const result = await authService.login(email, password, ipAddress, userAgent);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log in with Google (callback)
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    if (err || !user) {
      return next(new AppError('Failed to authenticate with Google', 401));
    }

    try {
      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'];

      const result = await authService.socialLogin(user, ipAddress, userAgent);
      
      // Redirect with token in query params (frontend should extract and store)
      res.redirect(`${process.env.FRONTEND_URL}/auth/social-callback?token=${result.token}`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

/**
 * @desc    Log in with Facebook (callback)
 * @route   GET /api/auth/facebook/callback
 * @access  Public
 */
const facebookCallback = (req, res, next) => {
  passport.authenticate('facebook', { session: false }, async (err, user) => {
    if (err || !user) {
      return next(new AppError('Failed to authenticate with Facebook', 401));
    }

    try {
      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'];

      const result = await authService.socialLogin(user, ipAddress, userAgent);
      
      // Redirect with token in query params (frontend should extract and store)
      res.redirect(`${process.env.FRONTEND_URL}/auth/social-callback?token=${result.token}`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
const verifyEmail = async (req, res, next) => {
    try {
      const { token } = req.params;
      
      // Log token for debugging
      console.log("Verification token received:", token);
      
      if (token === "undefined") {
        throw new Error("Verification token is undefined");
      }
      
      await authService.verifyEmail(token);
  
      // Return HTML success message for testing
      res.status(200).send(`
        <html>
          <head>
            <title>Email Verification Successful</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
              .success { color: green; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="success">Email Verification Successful!</h1>
              <p>Your email has been successfully verified. You can now log in to your account.</p>
              <p>This is a temporary message for testing. In production, you will be redirected to the application.</p>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Email verification error:", error.message);
      
      // Return HTML error message for testing
      res.status(400).send(`
        <html>
          <head>
            <title>Email Verification Failed</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
              .error { color: red; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="error">Email Verification Failed</h1>
              <p>We could not verify your email. The verification link may be invalid or expired.</p>
              <p>Error: ${error.message}</p>
              <p>This is a temporary message for testing. In production, you will be redirected to the application.</p>
            </div>
          </body>
        </html>
      `);
    }
  };

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const host = `${req.protocol}://${req.get('host')}`;
    
    await authService.forgotPassword(email, host);

    // Always return success to prevent email enumeration
    res.status(200).json({
      status: 'success',
      message: 'If that email address is in our database, we will send you a password reset link'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    await authService.resetPassword(token, password);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful. You can now log in with your new password'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getCurrentUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};

module.exports = {
  signup,
  login,
  googleCallback,
  facebookCallback,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser
};