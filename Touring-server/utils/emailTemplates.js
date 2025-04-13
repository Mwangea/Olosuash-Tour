const { format } = require('date-fns');

module.exports = {
  /**
   * Booking confirmation email to user
   */
  getBookingConfirmationTemplate(booking, settings) {
    const companyName = settings?.company_name || 'Olosuashi Experiences';
    const formattedDate = format(new Date(booking.booking_date), 'MMMM do, yyyy');
    
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

    const paymentInstructions = `
      <div class="payment-instructions">
        <h3>📝 Payment Instructions</h3>
        <ol>
          <li>M-Pesa Paybill: ${settings?.mpesa_paybill || '123456'}</li>
          <li>Account Number: ${booking.booking_reference}</li>
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

    return {
      subject: settings?.booking_email_subject || `Booking Confirmation: ${booking.experience_title}`,
      html: `
        <h2>Experience Booking Confirmation</h2>
        <p>Dear ${booking.full_name},</p>
        <p>Thank you for booking with ${companyName}! Here are your booking details:</p>
        
        <div class="booking-details">
          <div class="detail-row">
            <div class="detail-label">Booking Reference:</div>
            <div class="detail-value">${booking.booking_reference}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Experience:</div>
            <div class="detail-value">${booking.experience_title}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Booking Date:</div>
            <div class="detail-value">${formattedDate}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Duration:</div>
            <div class="detail-value">${booking.experience_duration}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Guests:</div>
            <div class="detail-value">${booking.number_of_guests} person(s)</div>
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
        
        <div class="divider"></div>
        
        <p>We'll contact you soon to confirm your booking details. If you have any questions, please reply to this email.</p>
        <p>Best regards,<br>The ${companyName} Team</p>
      `,
      text: `
        Experience Booking Confirmation - ${companyName}
        
        Dear ${booking.full_name},
        
        Thank you for booking with ${companyName}! Here are your booking details:
        
        Booking Reference: ${booking.booking_reference}
        Experience: ${booking.experience_title}
        Booking Date: ${formattedDate}
        Duration: ${booking.experience_duration}
        Guests: ${booking.number_of_guests} person(s)
        Total Price: USD ${booking.total_price.toLocaleString()}
        Status: ${booking.status}
        ${booking.special_requests ? `Special Requests: ${booking.special_requests}` : ''}
        
        📝 Payment Instructions:
        1. M-Pesa Paybill: ${settings?.mpesa_paybill || '123456'}
        2. Account Number: ${booking.booking_reference}
        3. Amount: USD ${booking.total_price.toLocaleString()}
        4. Send payment confirmation to WhatsApp: ${settings?.company_phone || '+254 708 414 577'}
        5. Or pay cash at our office
        
        🔔 Next Steps:
        - Complete payment within 24 hours
        - Send payment confirmation to our WhatsApp number
        - We'll verify and confirm your booking
        
        ${booking.payment_method === 'whatsapp' && booking.whatsapp_url ? `
        Complete your payment via WhatsApp: ${booking.whatsapp_url}
        Or contact us directly at: ${booking.whatsapp_number}
        ` : ''}
        
        We'll contact you soon to confirm your booking details. If you have any questions, please reply to this email.
        
        Best regards,
        The ${companyName} Team
      `
    };
  },

  /**
   * Admin notification email for new booking
   */
  getAdminNotificationTemplate(booking, settings) {
    const companyName = settings?.company_name || 'Olosuashi Experiences';
    const formattedDate = format(new Date(booking.booking_date), 'MMMM do, yyyy');
    const bookingUrl = `${process.env.ADMIN_BASE_URL}/bookings/${booking.id}`;

    return {
      subject: `New Experience Booking: ${booking.experience_title} (Ref: ${booking.booking_reference})`,
      html: `
        <h2>New Experience Booking Notification</h2>
        <p>Dear Admin,</p>
        <p>A new experience booking has been created and requires your attention:</p>
        
        <div class="booking-details">
          <div class="detail-row">
            <div class="detail-label">Booking Reference:</div>
            <div class="detail-value">${booking.booking_reference}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Experience:</div>
            <div class="detail-value">${booking.experience_title}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Booking Date:</div>
            <div class="detail-value">${formattedDate}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Guests:</div>
            <div class="detail-value">${booking.number_of_guests} person(s)</div>
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
            <div class="detail-value">${booking.full_name}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Customer Email:</div>
            <div class="detail-value">${booking.email}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Customer Phone:</div>
            <div class="detail-value">${booking.phone}</div>
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
      `,
      text: `
        New Experience Booking Notification - ${companyName}
        
        Dear Admin,
        
        A new experience booking has been created and requires your attention:
        
        Booking Reference: ${booking.booking_reference}
        Experience: ${booking.experience_title}
        Booking Date: ${formattedDate}
        Guests: ${booking.number_of_guests} person(s)
        Total Price: USD ${booking.total_price.toLocaleString()}
        Status: ${booking.status}
        Customer: ${booking.full_name}
        Customer Email: ${booking.email}
        Customer Phone: ${booking.phone}
        ${booking.special_requests ? `Special Requests: ${booking.special_requests}` : ''}
        ${booking.payment_method === 'whatsapp' ? `WhatsApp Number: ${booking.whatsapp_number}` : ''}
        
        View Booking: ${bookingUrl}
        
        Please review and update the booking status as needed.
        
        Best regards,
        The ${companyName} Team
      `
    };
  },

  /**
   * Booking status update email to user
   */
  getStatusUpdateTemplate(booking, settings) {
    const companyName = settings?.company_name || 'Olosuashi Experiences';
    const formattedDate = format(new Date(booking.booking_date), 'MMMM do, yyyy');
    
    let statusMessage = '';
    let actionSection = '';
    let subject = '';
    
    switch (booking.status) {
      case 'confirmed':
        subject = settings?.booking_approval_subject || `Booking Confirmed: ${booking.experience_title}`;
        statusMessage = `
          <p>Your booking for <strong>${booking.experience_title}</strong> has been confirmed!</p>
          <p>We're excited to have you join us on ${formattedDate}.</p>
        `;
        actionSection = `
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://www.olosuashi.com/prepare-for-experience" class="button">
              Prepare for Your Experience
            </a>
          </div>
        `;
        break;
      case 'cancelled':
        subject = settings?.booking_cancellation_subject || `Booking Cancelled: ${booking.experience_title}`;
        statusMessage = `
          <p>Your booking for <strong>${booking.experience_title}</strong> on ${formattedDate} has been cancelled.</p>
          ${booking.payment_status === 'refunded' ? `
          <p>Your payment has been refunded. Please allow 5-7 business days for the refund to process.</p>
          ` : ''}
        `;
        actionSection = `
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://www.olosuashi.com/experiences" class="button">
              Book Another Experience
            </a>
          </div>
        `;
        break;
      default:
        subject = `Booking Status Update: ${booking.experience_title}`;
        statusMessage = `
          <p>The status of your booking for <strong>${booking.experience_title}</strong> has been updated.</p>
        `;
    }

    return {
      subject,
      html: `
        <h2>Experience Booking Status Update</h2>
        <p>Dear ${booking.full_name},</p>
        
        ${statusMessage}
        
        <div class="booking-details">
          <div class="detail-row">
            <div class="detail-label">Booking Reference:</div>
            <div class="detail-value">${booking.booking_reference}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Experience:</div>
            <div class="detail-value">${booking.experience_title}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Booking Date:</div>
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
      `,
      text: `
        Experience Booking Status Update - ${companyName}
        
        Dear ${booking.full_name},
        
        ${booking.status === 'confirmed' ? `
        Your booking for "${booking.experience_title}" has been confirmed!
        We're excited to have you join us on ${formattedDate}.
        ` : `
        Your booking for "${booking.experience_title}" on ${formattedDate} has been cancelled.
        ${booking.payment_status === 'refunded' ? 'Your payment has been refunded. Please allow 5-7 business days for the refund to process.' : ''}
        `}
        
        Booking Reference: ${booking.booking_reference}
        Experience: ${booking.experience_title}
        Booking Date: ${formattedDate}
        Status: ${booking.status}
        ${booking.admin_notes ? `Admin Notes: ${booking.admin_notes}` : ''}
        
        If you have any questions about this update, please reply to this email.
        
        Best regards,
        The ${companyName} Team
      `
    };
  }
};