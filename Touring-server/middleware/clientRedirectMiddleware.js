/**
 * Middleware for handling client-side redirects
 * @param {Object} options - Configuration options for redirect
 * @param {string} options.defaultRedirectUrl - Default redirect URL
 * @param {function} [options.validateToken] - Optional function to validate token
 */
const clientRedirectMiddleware = (options = {}) => {
    const {
      defaultRedirectUrl = process.env.FRONTEND_URL,
      validateToken = null
    } = options;
  
    return async (req, res, next) => {
      try {
        // Extract possible redirect information
        const redirectParam = req.query.redirect || req.body.redirect;
        const tokenParam = req.query.token || req.body.token;
  
        // Optional token validation
        let isValidToken = true;
        if (validateToken && tokenParam) {
          isValidToken = await validateToken(tokenParam);
        }
  
        // Prepare redirect response
        const redirectResponse = {
          status: 'success',
          message: 'Redirect information',
          data: {
            redirectUrl: redirectParam || defaultRedirectUrl,
            token: isValidToken ? tokenParam : null,
            isValidToken
          }
        };
  
        // If it's an API request, send JSON
        if (req.xhr || req.headers.accept.includes('application/json')) {
          return res.status(200).json(redirectResponse);
        }
  
        // If it's a regular request, set redirect info in session or pass as query params
        req.session = req.session || {};
        req.session.redirectInfo = redirectResponse.data;
  
        // Redirect with original request's headers/method preserved
        const safeRedirectUrl = new URL(redirectResponse.data.redirectUrl);
        if (tokenParam) {
          safeRedirectUrl.searchParams.append('token', tokenParam);
        }
  
        res.redirect(safeRedirectUrl.toString());
      } catch (error) {
        next(error);
      }
    };
  };
  
  module.exports = {
    clientRedirectMiddleware
  };