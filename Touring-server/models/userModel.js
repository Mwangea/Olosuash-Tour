const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');



const userModel = {
    /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Newly created user
   */

    async create(userData) {
        const connection = await pool.getConnection();
      
        try {
          await connection.beginTransaction();
      
          // Hash password if provided
          if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 12);
          }
      
          // Generate verification token for email verification
          if (!userData.is_verified) {
            userData.verification_token = crypto.randomBytes(32).toString('hex');
          }
          
          // Execute insert query with role included
          const [result] = await connection.query(
            'INSERT INTO users (username, email, password, profile_picture, phone_number, auth_provider, auth_provider_id, verification_token, is_verified, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              userData.username,
              userData.email,
              userData.password || null,
              userData.profile_picture || null,
              userData.phone_number || null,
              userData.auth_provider || 'local',
              userData.auth_provider_id || null,
              userData.verification_token || null,
              userData.is_verified || false,
              userData.role || 'user' // Default to 'user' if not specified
            ]
          );
          
          const userId = result.insertId;
          
          // Create user profile
          await connection.query(
            'INSERT INTO user_profiles (user_id) VALUES (?)',
            [userId]
          );
          
          // Get the created user
          const [users] = await connection.query(
            'SELECT id, username, email, profile_picture, role, auth_provider, is_verified, verification_token, created_at FROM users WHERE id = ?',
            [userId]
          );
          
          await connection.commit();
          
          return users[0];
        } catch (error) {
          await connection.rollback();
          throw error;
        } finally {
          connection.release();
        }
      },
  
  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User object
   */
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.profile_picture, u.role, u.auth_provider, u.is_verified, u.created_at,
       p.first_name, p.last_name
       FROM users u
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [id]
    );
    
    return rows[0] || null;
  },
  
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object
   */
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    return rows[0] || null;
  },
  
  /**
   * Find user by username
   * @param {string} username - Username
   * @returns {Promise<Object>} User object
   */
  async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    return rows[0] || null;
  },
  
  /**
   * Update user authentication provider
   * @param {number} userId - User ID
   * @param {string} provider - Auth provider (google, facebook)
   * @param {string} providerId - Provider ID
   * @returns {Promise<Object>} Updated user object
   */
  async updateAuthProvider(userId, provider, providerId) {
    await pool.query(
      'UPDATE users SET auth_provider = ?, auth_provider_id = ? WHERE id = ?',
      [provider, providerId, userId]
    );
    
    return this.findById(userId);
  },
  
  /**
   * Verify user email
   * @param {string} token - Verification token
   * @returns {Promise<boolean>} Success status
   */
  async verifyEmail(token) {
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE verification_token = ?',
      [token]
    );
    
    if (!rows.length) {
      return false;
    }
    
    await pool.query(
      'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?',
      [rows[0].id]
    );
    
    return true;
  },
  
  /**
   * Generate password reset token
   * @param {string} email - User email
   * @returns {Promise<string>} Reset token
   */
  async createPasswordResetToken(email) {
    const user = await this.findByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Token expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await pool.query(
      'UPDATE users SET reset_password_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetTokenHash, expiresAt, user.id]
    );
    
    return resetToken;
  },
  
  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  async resetPassword(token, newPassword) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE reset_password_token = ? AND reset_token_expires > NOW()',
      [hashedToken]
    );
    
    if (!rows.length) {
      return false;
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await pool.query(
      'UPDATE users SET password = ?, reset_password_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, rows[0].id]
    );
    
    return true;
  },
  
  /**
   * Check if login credentials are valid
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User object if valid
   */
  async validateCredentials(email, password) {
    const user = await this.findByEmail(email);
    
    if (!user || !user.password) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return null;
    }
    
    return user;
  },
  
  /**
   * Create a user session
   * @param {number} userId - User ID
   * @param {string} token - JWT token
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>} Session object
   */
  async createSession(userId, token, ipAddress, userAgent) {
    // Token expires in 7 days or as per JWT_EXPIRES_IN
    const expiresAt = new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
    );
    
    const [result] = await pool.query(
      'INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
      [userId, token, ipAddress, userAgent, expiresAt]
    );
    
    return {
      id: result.insertId,
      userId,
      token,
      expiresAt
    };
  },
  
  /**
   * Log login attempt
   * @param {string} email - Email attempted
   * @param {string} ipAddress - IP address
   * @returns {Promise<void>}
   */
  async logLoginAttempt(email, ipAddress) {
    await pool.query(
      'INSERT INTO login_attempts (email, ip_address) VALUES (?, ?)',
      [email, ipAddress]
    );
  },
  
  /**
   * Check if user has too many login attempts
   * @param {string} email - User email
   * @param {string} ipAddress - IP address
   * @returns {Promise<boolean>} True if too many attempts
   */
  async tooManyLoginAttempts(email, ipAddress) {
    // Check if there are more than 5 attempts in the last 15 minutes
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM login_attempts WHERE (email = ? OR ip_address = ?) AND attempt_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)',
      [email, ipAddress]
    );
    
    return rows[0].count >= 5;
  },

   /**
   * Check if admin exists
   * @returns {Promise<boolean>} True if admin exists
   */
  async adminExists(){
    const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM users WHERE role = ?',
        ['admin']
    );
    return rows[0].count > 0;
  },


  /**
   * Create admin account
   * @param {Object} adminData - Admin data
   * @param {string} secretKey - Admin creation secret key
   * @returns {Promise<Object>} Created admin user
   */

  async createAdmin(adminData, secretKey) {
    // Check if secret key matches
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      throw new Error('Invalid admin secret key');
    }
  
    // Check if admin already exists
    if (await this.adminExists()) {
      throw new Error('Admin account already exists');
    }
  
    // Check if username exists
    const existingUser = await this.findByUsername(adminData.username);
    if (existingUser) {
      throw new Error(`Username ${adminData.username} is already taken`);
    }
  
    // Check if email exists
    const existingEmail = await this.findByEmail(adminData.email);
    if (existingEmail) {
      throw new Error(`Email ${adminData.email} is already in use`);
    }
  
    // Create admin user with explicit role
    const adminUser = await this.create({
      ...adminData,
      role: 'admin',
      is_verified: true // Auto-verify admin
    });
  
    return adminUser;
  }
};

module.exports = userModel;