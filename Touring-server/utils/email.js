const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_OUTGOING_SERVER,
  port: process.env.EMAIL_SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Common email template with branding
const emailTemplate = (content) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Olosuash Tours</title>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background-color: #8B7355;
          padding: 20px;
          text-align: center;
        }
        .logo {
          max-width: 200px;
          height: auto;
        }
        .content {
          padding: 30px;
          line-height: 1.5;
          color: #333333;
        }
        .footer {
          background-color: #f7f3ee;
          padding: 20px;
          text-align: center;
          color: #8B7355;
          font-size: 14px;
        }
        .button {
          background-color: #8B7355;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          display: inline-block;
          margin: 20px 0;
          border: none;
        }
        .link-section {
          background-color: #f7f3ee;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          word-break: break-all;
        }
        h2 {
          color: #8B7355;
          margin-top: 0;
        }
        a {
          color: #8B7355;
        }
        .divider {
          border-top: 1px solid #e5e5e5;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="/Touring-server/public/olosuashi.png" alt="Olosuash Tours Logo" class="logo">
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Olosuash Tours. All rights reserved.</p>
          <p>If you have any questions, contact us at <a href="mailto:info@olosuashtours.com">info@olosuashtours.com</a></p>
          <p>
            <a href="https://www.olosuashtours.com/privacy" style="color: #8B7355; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
            <a href="https://www.olosuashtours.com/terms" style="color: #8B7355; text-decoration: none; margin: 0 10px;">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendEmail = async (options) => {
  try {
    // Define the email options
    const mailOptions = {
      from: `Olosuash Tours <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      text: options.message || options.textContent,
      html: options.html
    };
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendVerificationEmail = async (user, verificationUrl) => {
  const subject = 'Verify Your Email Address';
  const content = `
    <h2>Welcome to Olosuash Tours!</h2>
    <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
    <div style="text-align: center;">
      <a href="${verificationUrl}" class="button">Verify Email</a>
    </div>
    <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
    <div class="link-section">
      ${verificationUrl}
    </div>
    <p>This link will expire in 24 hours.</p>
    <div class="divider"></div>
    <p>If you did not sign up for an account, please ignore this email.</p>
    <p>Best regards,<br>The Olosuash Tours Team</p>
  `;
  
  const textContent = `
    Welcome to Olosuash Tours!
    
    Thank you for signing up. Please verify your email address by visiting the following link:
    
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you did not sign up for an account, please ignore this email.
    
    Best regards,
    The Olosuash Tours Team
  `;
  
  return sendEmail({
    email: user.email,
    subject,
    textContent,
    html: emailTemplate(content)
  });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  const subject = 'Password Reset Request';
  const content = `
    <h2>Password Reset Request</h2>
    <p>You requested a password reset. Please click the button below to reset your password:</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
    <div class="link-section">
      ${resetUrl}
    </div>
    <p>This link will expire in 10 minutes.</p>
    <div class="divider"></div>
    <p>If you did not request a password reset, please ignore this email and ensure your account is secure.</p>
    <p>Best regards,<br>The Olosuash Tours Team</p>
  `;
  
  const textContent = `
    Password Reset Request
    
    You requested a password reset. Please visit the following link to reset your password:
    
    ${resetUrl}
    
    This link will expire in 10 minutes.
    
    If you did not request a password reset, please ignore this email and ensure your account is secure.
    
    Best regards,
    The Olosuash Tours Team
  `;
  
  return sendEmail({
    email: user.email,
    subject,
    textContent,
    html: emailTemplate(content)
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};