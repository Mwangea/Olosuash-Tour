const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { format } = require('date-fns');
const Booking = require('../models/bookingModel');
const logger = require('../utils/logger');

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
          <img src="cid:logo" alt="Olosuash Tours Logo" class="logo">
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Olosuash Tours. All rights reserved.</p>
          <p>If you have any questions, contact us at <a href="mailto:${process.env.EMAIL_USERNAME}">${process.env.EMAIL_USERNAME}</a></p>
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
    // Get the logo path
    const logoPath = path.join(__dirname, '../public/olosuashi.png');

    // Define the email options with the logo as an attachment
    const mailOptions = {
      from: `Olosuashi Tours <${process.env.EMAIL_USERNAME}>`,
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

// Send booking confirmation email
exports.sendBookingConfirmationEmail = async (booking) => {
  try {
    const companyName = await Booking.getSetting('company_name') || 'Olosuash Tours';
    const formattedDate = format(new Date(booking.travel_date), 'MMMM do, yyyy');
    const statusClass = `status-${booking.status}`;
    
    let whatsappSection = '';
    if (booking.payment_method === 'whatsapp' && booking.whatsapp_url) {
      whatsappSection = `
        <div style="text-align: center; margin: 25px 0;">
          <a href="${booking.whatsapp_url}" class="button whatsapp-button">
            Complete Payment via WhatsApp
          </a>
        </div>
        <p style="text-align: center;">Or contact us directly at: ${booking.whatsapp_number}</p>
      `;
    }

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
          <div class="detail-value">$${booking.total_price}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Status:</div>
          <div class="detail-value">
            <span class="status-badge ${statusClass}">${booking.status}</span>
          </div>
        </div>
        ${booking.special_requests ? `
        <div class="detail-row">
          <div class="detail-label">Special Requests:</div>
          <div class="detail-value">${booking.special_requests}</div>
        </div>
        ` : ''}
      </div>
      
      ${whatsappSection}
      
      <h3>Tour Itinerary</h3>
      ${booking.tour_details.itinerary.map(item => `
        <div class="itinerary-item">
          <div class="itinerary-day">Day ${item.day}: ${item.title}</div>
          <div>${item.description}</div>
        </div>
      `).join('')}
      
      <div class="divider"></div>
      
      <div style="display: flex; margin: 20px 0;">
        <div style="flex: 1; padding-right: 15px;">
          <h3>Included Services</h3>
          <ul class="service-list">
            ${booking.tour_details.included_services.map(service => `
              <li>${service.name}${service.details ? ` (${service.details})` : ''}</li>
            `).join('')}
          </ul>
        </div>
        <div style="flex: 1; padding-left: 15px;">
          <h3>Excluded Services</h3>
          <ul class="service-list">
            ${booking.tour_details.excluded_services.map(service => `
              <li>${service.name}${service.details ? ` (${service.details})` : ''}</li>
            `).join('')}
          </ul>
        </div>
      </div>
      
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
      Total Price: $${booking.total_price}
      Status: ${booking.status}
      ${booking.special_requests ? `Special Requests: ${booking.special_requests}` : ''}
      
      ${booking.payment_method === 'whatsapp' && booking.whatsapp_url ? `
      Complete your payment via WhatsApp: ${booking.whatsapp_url}
      Or contact us directly at: ${booking.whatsapp_number}
      ` : ''}
      
      Tour Itinerary:
      ${booking.tour_details.itinerary.map(item => `
      Day ${item.day}: ${item.title}
      ${item.description}
      `).join('\n')}
      
      Included Services:
      ${booking.tour_details.included_services.map(service => 
        `- ${service.name}${service.details ? ` (${service.details})` : ''}`
      ).join('\n')}
      
      Excluded Services:
      ${booking.tour_details.excluded_services.map(service => 
        `- ${service.name}${service.details ? ` (${service.details})` : ''}`
      ).join('\n')}
      
      We'll contact you soon to confirm your booking details. If you have any questions, please reply to this email.
      
      Best regards,
      The ${companyName} Team
    `;
    
    const subject = await Booking.getSetting('booking_email_subject') || `Booking Confirmation: ${booking.tour_title}`;
    
    return sendEmail({
      email: booking.user_email,
      subject,
      textContent,
      html: emailTemplate(content)
    });
  } catch (error) {
    logger.error(`Error sending booking confirmation email: ${error.message}`);
    throw error;
  }
};

// Send booking status update email
exports.sendBookingStatusUpdateEmail = async (booking) => {
  try {
    const companyName = await Booking.getSetting('company_name') || 'Olosuash Tours';
    const formattedDate = format(new Date(booking.travel_date), 'MMMM do, yyyy');
    const statusClass = `status-${booking.status}`;
    
    let statusMessage = '';
    let actionSection = '';
    let subject = '';
    
    switch (booking.status) {
      case 'approved':
        subject = await Booking.getSetting('booking_approval_subject') || `Booking Approved: ${booking.tour_title}`;
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
        subject = await Booking.getSetting('booking_cancellation_subject') || `Booking Cancelled: ${booking.tour_title}`;
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
            <span class="status-badge ${statusClass}">${booking.status}</span>
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
      html: emailTemplate(content)
    });
  } catch (error) {
    logger.error(`Error sending booking status email: ${error.message}`);
    throw error;
  }
};