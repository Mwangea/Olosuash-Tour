const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const emailTemplates = require('../utils/emailTemplates');
const logger = require('../utils/logger');


// Settings cache
let settingsCache = null;
let lastSettingsFetch = 0;
const SETTINGS_CACHE_TTL = 300000; // 5 minutes

// Get settings with caching
async function getSettings() {
  const now = Date.now();
  if (!settingsCache || (now - lastSettingsFetch) > SETTINGS_CACHE_TTL) {
    // In a real implementation, you would fetch settings from your database
    settingsCache = {
      company_name: 'Olosuashi Experiences',
      company_email: process.env.BOOKING_EMAIL_USERNAME,
      company_phone: '+254 708 414 577',
      admin_email: process.env.ADMIN_EMAIL,
      mpesa_paybill: '123456',
      booking_email_subject: 'Experience Booking Confirmation',
      booking_approval_subject: 'Experience Booking Confirmed',
      booking_cancellation_subject: 'Experience Booking Cancelled'
    };
    lastSettingsFetch = now;
    logger.info('System settings refreshed');
  }
  return settingsCache;
}

const transporter = nodemailer.createTransport({
  host: process.env.BOOKING_EMAIL_OUTGOING_SERVER,
  port: process.env.BOOKING_EMAIL_SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.BOOKING_EMAIL_USERNAME,
    pass: process.env.BOOKING_EMAIL_PASSWORD
  }
});

// Common email template with branding
const emailTemplate = (content, settings) => {
  const companyName = settings?.company_name || 'Olosuashi Experiences';
  const companyEmail = settings?.company_email || process.env.BOOKING_EMAIL_USERNAME;
  const companyPhone = settings?.company_phone || '+254 708 414 577';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${companyName}</title>
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
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 12px;
        }
        .status-pending {
          background-color: #FFF3CD;
          color: #856404;
        }
        .status-confirmed {
          background-color: #D4EDDA;
          color: #155724;
        }
        .status-cancelled {
          background-color: #F8D7DA;
          color: #721C24;
        }
        .detail-row {
          display: flex;
          margin-bottom: 10px;
        }
        .detail-label {
          font-weight: bold;
          width: 150px;
        }
        .detail-value {
          flex: 1;
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
          <img src="cid:logo" alt="${companyName} Logo" class="logo">
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          <p>Contact us at <a href="mailto:${companyEmail}">${companyEmail}</a> or ${companyPhone}</p>
          <p>
            <a href="https://www.olosuashi.com/privacy" style="margin: 0 10px;">Privacy Policy</a> | 
            <a href="https://www.olosuashi.com/terms" style="margin: 0 10px;">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendEmail = async (options) => {
  try {
    const settings = await getSettings();
    const companyName = settings?.company_name || 'Olosuashi Experiences';
    const companyEmail = settings?.company_email || process.env.BOOKING_EMAIL_USERNAME;

    // Get the logo path
    const logoPath = path.join(__dirname, '../public/olosuashi.png');

    // Define the email options with the logo as an attachment
    const mailOptions = {
      from: `${companyName} <${companyEmail}>`,
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: [
        {
          filename: 'olosuashi.png',
          path: logoPath,
          cid: 'logo'
        },
        ...(options.attachments || [])
      ]
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Error sending email to ${options.email}: ${error.message}`);
    throw error;
  }
};

// Send booking confirmation email to user
exports.sendBookingConfirmationEmail = async (booking) => {
  try {
    const settings = await getSettings();
    const template = emailTemplates.getBookingConfirmationTemplate(booking, settings);
    
    return sendEmail({
      email: booking.email,
      subject: template.subject,
      text: template.text,
      html: emailTemplate(template.html, settings)
    });
  } catch (error) {
    logger.error(`Error sending booking confirmation email: ${error.message}`);
    throw error;
  }
};

// Send admin notification email
exports.sendAdminBookingNotificationEmail = async (booking) => {
  try {
    const settings = await getSettings();
    const adminEmail = settings?.admin_email || process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      logger.warn('No admin email configured - skipping admin notification');
      return;
    }

    const template = emailTemplates.getAdminNotificationTemplate(booking, settings);
    
    return sendEmail({
      email: adminEmail,
      subject: template.subject,
      text: template.text,
      html: emailTemplate(template.html, settings)
    });
  } catch (error) {
    logger.error(`Error sending admin notification email: ${error.message}`);
    throw error;
  }
};

// Send booking status update email to user
exports.sendBookingStatusUpdateEmail = async (booking) => {
  try {
    const settings = await getSettings();
    const template = emailTemplates.getStatusUpdateTemplate(booking, settings);
    
    return sendEmail({
      email: booking.email,
      subject: template.subject,
      text: template.text,
      html: emailTemplate(template.html, settings)
    });
  } catch (error) {
    logger.error(`Error sending booking status email: ${error.message}`);
    throw error;
  }
};