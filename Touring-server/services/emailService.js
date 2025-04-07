const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { format } = require('date-fns');
const Booking = require('../models/bookingModel');
const logger = require('../utils/logger');

// Settings cache
let settingsCache = null;
let lastSettingsFetch = 0;
const SETTINGS_CACHE_TTL = 300000; // 5 minutes

// Get settings with caching
async function getSettings() {
  const now = Date.now();
  if (!settingsCache || (now - lastSettingsFetch) > SETTINGS_CACHE_TTL) {
    settingsCache = await Booking.getSettings();
    lastSettingsFetch = now;
    logger.info('System settings refreshed from database');
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
  const companyName = settings?.company_name || 'Olosuash Tours';
  const companyEmail = settings?.company_email || process.env.BOOKING_EMAIL_USERNAME;
  const companyPhone = settings?.company_phone || '+254786027589';

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
        .status-approved {
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
        .itinerary-item {
          margin-bottom: 15px;
        }
        .itinerary-day {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .service-list {
          padding-left: 20px;
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
            <a href="https://www.olosuashtours.com/privacy" style="margin: 0 10px;">Privacy Policy</a> | 
            <a href="https://www.olosuashtours.com/terms" style="margin: 0 10px;">Terms of Service</a>
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
    const companyName = settings?.company_name || 'Olosuash Tours';
    const companyEmail = settings?.company_email || process.env.BOOKING_EMAIL_USERNAME;

    // Get the logo path
    const logoPath = path.join(__dirname, '../public/olosuashi.png');

    // Define the email options with the logo as an attachment
    const mailOptions = {
      from: `${companyName} <${companyEmail}>`,
      to: options.email,
      subject: options.subject,
      text: options.textContent,
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
    const companyName = settings?.company_name || 'Olosuash Tours';
    const formattedDate = format(new Date(booking.travel_date), 'MMMM do, yyyy');
    
    let whatsappSection = '';
    if (booking.payment_method === 'whatsapp' && booking.whatsapp_url) {
      whatsappSection = `
        <div style="text-align: center; margin: 25px 0;">
          <a href="${booking.whatsapp_url}" class="button">
            Complete Payment via WhatsApp
          </a>
        </div>
        <p style="text-align: center;">Or contact us directly at: ${booking.whatsapp_number}</p>
      `;
    }

    // Payment instructions section
    const paymentInstructions = `
      <div class="payment-instructions">
        <h3>📝 Payment Instructions</h3>
        <ol>
          <li>M-Pesa Paybill: ${settings?.mpesa_paybill || '123456'}</li>
          <li>Account Number: ${booking.id}</li>
          <li>Amount: USD ${booking.total_price.toLocaleString()}</li>
          <li>Send payment confirmation to WhatsApp: ${settings?.company_phone || '+254786027589'}</li>
          <li>Or pay cash at our office</li>
        </ol>
        
        <div class="next-steps">
          <h3>🔔 Next Steps</h3>
          <ul>
            <li>Complete payment within 24 hours</li>
            <li>Send payment confirmation to our WhatsApp number</li>
            <li>We'll verify and confirm your booking</li>
          </ul>
        </div>
      </div>
    `;

    const content = `
      <h2>Booking Confirmation</h2>
      <p>Dear ${booking.user_name},</p>
      <p>Thank you for booking with ${companyName}! Here are your booking details:</p>
      
      <div class="booking-details">
        <div class="detail-row">
          <div class="detail-label">Booking Reference:</div>
          <div class="detail-value">#${booking.id}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Tour:</div>
          <div class="detail-value">${booking.tour_title}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Travel Date:</div>
          <div class="detail-value">${formattedDate}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Duration:</div>
          <div class="detail-value">${booking.tour_duration} days</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Travelers:</div>
          <div class="detail-value">${booking.number_of_travelers} person(s)</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Total Price:</div>
          <div class="detail-value">USD ${booking.total_price.toLocaleString()}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Status:</div>
          <div class="detail-value">
            <span class="status-badge status-${booking.status}">${booking.status}</span>
          </div>
        </div>
        ${booking.special_requests ? `
        <div class="detail-row">
          <div class="detail-label">Special Requests:</div>
          <div class="detail-value">${booking.special_requests}</div>
        </div>
        ` : ''}
      </div>
      
      ${paymentInstructions}
      
      ${whatsappSection}
      
      <h3>Tour Itinerary</h3>
      ${booking.tour_details?.itinerary?.map(item => `
        <div class="itinerary-item">
          <div class="itinerary-day">Day ${item.day}: ${item.title}</div>
          <div>${item.description}</div>
        </div>
      `).join('') || '<p>No itinerary details available.</p>'}
      
      <div class="divider"></div>
      
      <p>We'll contact you soon to confirm your booking details. If you have any questions, please reply to this email.</p>
      <p>Best regards,<br>The ${companyName} Team</p>
    `;
    
    const textContent = `
      Booking Confirmation - ${companyName}
      
      Dear ${booking.user_name},
      
      Thank you for booking with ${companyName}! Here are your booking details:
      
      Booking Reference: #${booking.id}
      Tour: ${booking.tour_title}
      Travel Date: ${formattedDate}
      Duration: ${booking.tour_duration} days
      Travelers: ${booking.number_of_travelers} person(s)
      Total Price: USD ${booking.total_price.toLocaleString()}
      Status: ${booking.status}
      ${booking.special_requests ? `Special Requests: ${booking.special_requests}` : ''}
      
      📝 Payment Instructions:
      1. M-Pesa Paybill: ${settings?.mpesa_paybill || '123456'}
      2. Account Number: ${booking.id}
      3. Amount: USD ${booking.total_price.toLocaleString()}
      4. Send payment confirmation to WhatsApp: ${settings?.company_phone || '+254786027589'}
      5. Or pay cash at our office
      
      🔔 Next Steps:
      - Complete payment within 24 hours
      - Send payment confirmation to our WhatsApp number
      - We'll verify and confirm your booking
      
      ${booking.payment_method === 'whatsapp' && booking.whatsapp_url ? `
      Complete your payment via WhatsApp: ${booking.whatsapp_url}
      Or contact us directly at: ${booking.whatsapp_number}
      ` : ''}
      
      Tour Itinerary:
      ${booking.tour_details?.itinerary?.map(item => `
      Day ${item.day}: ${item.title}
      ${item.description}
      `).join('\n') || 'No itinerary details available.'}
      
      We'll contact you soon to confirm your booking details. If you have any questions, please reply to this email.
      
      Best regards,
      The ${companyName} Team
    `;
    
    const subject = settings?.booking_email_subject || `Booking Confirmation: ${booking.tour_title}`;
    
    return sendEmail({
      email: booking.user_email,
      subject,
      textContent,
      html: emailTemplate(content, settings)
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

    const companyName = settings?.company_name || 'Olosuash Tours';
    const formattedDate = format(new Date(booking.travel_date), 'MMMM do, yyyy');
    const bookingUrl = `${process.env.BASE_URL}/admin/bookings?view=${booking.id}` || "http://localhost:5173/admin/bookings/";

    const content = `
      <h2>New Booking Notification</h2>
      <p>Dear Admin,</p>
      <p>A new booking has been created and requires your attention:</p>
      
      <div class="booking-details">
        <div class="detail-row">
          <div class="detail-label">Booking Reference:</div>
          <div class="detail-value">#${booking.id}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Tour:</div>
          <div class="detail-value">${booking.tour_title}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Travel Date:</div>
          <div class="detail-value">${formattedDate}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Travelers:</div>
          <div class="detail-value">${booking.number_of_travelers} person(s)</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Total Price:</div>
          <div class="detail-value">USD ${booking.total_price.toLocaleString()}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Status:</div>
          <div class="detail-value">
            <span class="status-badge status-${booking.status}">${booking.status}</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Customer:</div>
          <div class="detail-value">${booking.user_name}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Customer Email:</div>
          <div class="detail-value">${booking.user_email}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Customer Phone:</div>
          <div class="detail-value">${booking.user_phone}</div>
        </div>
        ${booking.special_requests ? `
        <div class="detail-row">
          <div class="detail-label">Special Requests:</div>
          <div class="detail-value">${booking.special_requests}</div>
        </div>
        ` : ''}
        ${booking.payment_method === 'whatsapp' ? `
        <div class="detail-row">
          <div class="detail-label">WhatsApp Number:</div>
          <div class="detail-value">${booking.whatsapp_number}</div>
        </div>
        ` : ''}
      </div>
      
      <div style="text-align: center; margin: 25px 0;">
        <a href="${bookingUrl}" class="button">
          View Booking in Admin Panel
        </a>
      </div>
      
      <div class="divider"></div>
      
      <p>Please review and update the booking status as needed.</p>
      <p>Best regards,<br>The ${companyName} Team</p>
    `;
    
    const textContent = `
      New Booking Notification - ${companyName}
      
      Dear Admin,
      
      A new booking has been created and requires your attention:
      
      Booking Reference: #${booking.id}
      Tour: ${booking.tour_title}
      Travel Date: ${formattedDate}
      Travelers: ${booking.number_of_travelers} person(s)
      Total Price: USD ${booking.total_price.toLocaleString()}
      Status: ${booking.status}
      Customer: ${booking.user_name}
      Customer Email: ${booking.user_email}
      Customer Phone: ${booking.user_phone}
      ${booking.special_requests ? `Special Requests: ${booking.special_requests}` : ''}
      ${booking.payment_method === 'whatsapp' ? `WhatsApp Number: ${booking.whatsapp_number}` : ''}
      
      View Booking: ${bookingUrl}
      
      Please review and update the booking status as needed.
      
      Best regards,
      The ${companyName} Team
    `;
    
    return sendEmail({
      email: adminEmail,
      subject: `New Booking: ${booking.tour_title} (Ref: #${booking.id})`,
      textContent,
      html: emailTemplate(content, settings)
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
    const companyName = settings?.company_name || 'Olosuash Tours';
    const formattedDate = format(new Date(booking.travel_date), 'MMMM do, yyyy');
    
    let statusMessage = '';
    let actionSection = '';
    let subject = '';
    
    switch (booking.status) {
      case 'approved':
        subject = settings?.booking_approval_subject || `Booking Approved: ${booking.tour_title}`;
        statusMessage = `
          <p>Your booking for <strong>${booking.tour_title}</strong> has been approved!</p>
          <p>We're excited to have you join us on ${formattedDate}.</p>
        `;
        actionSection = `
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://www.olosuashtours.com/prepare-for-tour" class="button">
              Prepare for Your Tour
            </a>
          </div>
        `;
        break;
      case 'cancelled':
        subject = settings?.booking_cancellation_subject || `Booking Cancelled: ${booking.tour_title}`;
        statusMessage = `
          <p>Your booking for <strong>${booking.tour_title}</strong> on ${formattedDate} has been cancelled.</p>
          ${booking.payment_status === 'refunded' ? `
          <p>Your payment has been refunded. Please allow 5-7 business days for the refund to process.</p>
          ` : ''}
        `;
        actionSection = `
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://www.olosuashtours.com/book-again" class="button">
              Book Another Tour
            </a>
          </div>
        `;
        break;
      default:
        subject = `Booking Status Update: ${booking.tour_title}`;
        statusMessage = `
          <p>The status of your booking for <strong>${booking.tour_title}</strong> has been updated.</p>
        `;
    }

    const content = `
      <h2>Booking Status Update</h2>
      <p>Dear ${booking.user_name},</p>
      
      ${statusMessage}
      
      <div class="booking-details">
        <div class="detail-row">
          <div class="detail-label">Booking Reference:</div>
          <div class="detail-value">#${booking.id}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Tour:</div>
          <div class="detail-value">${booking.tour_title}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Travel Date:</div>
          <div class="detail-value">${formattedDate}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Status:</div>
          <div class="detail-value">
            <span class="status-badge status-${booking.status}">${booking.status}</span>
          </div>
        </div>
        ${booking.admin_notes ? `
        <div class="detail-row">
          <div class="detail-label">Admin Notes:</div>
          <div class="detail-value">${booking.admin_notes}</div>
        </div>
        ` : ''}
      </div>
      
      ${actionSection}
      
      <div class="divider"></div>
      
      <p>If you have any questions about this update, please reply to this email.</p>
      <p>Best regards,<br>The ${companyName} Team</p>
    `;
    
    const textContent = `
      Booking Status Update - ${companyName}
      
      Dear ${booking.user_name},
      
      ${booking.status === 'approved' ? `
      Your booking for "${booking.tour_title}" has been approved!
      We're excited to have you join us on ${formattedDate}.
      ` : `
      Your booking for "${booking.tour_title}" on ${formattedDate} has been cancelled.
      ${booking.payment_status === 'refunded' ? 'Your payment has been refunded. Please allow 5-7 business days for the refund to process.' : ''}
      `}
      
      Booking Reference: #${booking.id}
      Tour: ${booking.tour_title}
      Travel Date: ${formattedDate}
      Status: ${booking.status}
      ${booking.admin_notes ? `Admin Notes: ${booking.admin_notes}` : ''}
      
      If you have any questions about this update, please reply to this email.
      
      Best regards,
      The ${companyName} Team
    `;
    
    return sendEmail({
      email: booking.user_email,
      subject,
      textContent,
      html: emailTemplate(content, settings)
    });
  } catch (error) {
    logger.error(`Error sending booking status email: ${error.message}`);
    throw error;
  }
};