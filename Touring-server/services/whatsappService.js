// whatsappService.js
const logger = require('../utils/logger');

// Static configuration
const whatsappConfig = {
  apiUrl: process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/send',
  adminNumber: process.env.ADMIN_WHATSAPP_NUMBER || '+254786027589',
  companyName: process.env.COMPANY_NAME || 'Olosuash Tours',
  companyPhone: process.env.COMPANY_PHONE || '+254786027589'
};

// Send booking notification to admin
async function sendAdminBookingNotification(bookingData) {
  try {
    const formattedDate = new Date(bookingData.travel_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `📢 *NEW BOOKING NOTIFICATION* 📢
    
*${whatsappConfig.companyName}*

🔖 *Booking ID:* ${bookingData.id}
🏕️ *Tour:* ${bookingData.tour_title}
📅 *Travel Date:* ${formattedDate}
👥 *Travelers:* ${bookingData.number_of_travelers}
💰 *Total Price:* USD ${bookingData.total_price.toLocaleString()}
📝 *Status:* ${bookingData.status.toUpperCase()}
    
👤 *Customer Details:*
Name: ${bookingData.user_name}
Email: ${bookingData.user_email}
Phone: ${bookingData.user_phone}
    
${bookingData.special_requests ? `📌 *Special Requests:*\n${bookingData.special_requests}\n` : ''}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `${whatsappConfig.apiUrl}?phone=${whatsappConfig.adminNumber.replace('+', '')}&text=${encodedMessage}`;
    
    logger.info(`Admin WhatsApp notification prepared for booking ${bookingData.id}`);
    return {
      success: true,
      whatsappUrl
    };
  } catch (error) {
    logger.error('Failed to send admin WhatsApp notification:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Send booking confirmation to user via WhatsApp
async function sendUserBookingConfirmation(bookingData) {
  try {
    if (!bookingData.whatsapp_number) {
      logger.error(`No WhatsApp number provided for booking ${bookingData.id}`);
      return { success: false, message: 'No WhatsApp number provided' };
    }

    const formattedDate = new Date(bookingData.travel_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `📌 *BOOKING CONFIRMATION* 📌
    
Thank you for booking with *${whatsappConfig.companyName}*!

🔖 *Booking ID:* ${bookingData.id}
🏕️ *Tour:* ${bookingData.tour_title}
📅 *Travel Date:* ${formattedDate}
👥 *Travelers:* ${bookingData.number_of_travelers}
💰 *Total Amount:* USD ${bookingData.total_price.toLocaleString()}
    
📝 *Payment Instructions:*
1. M-Pesa Paybill: 123456
   Account: ${bookingData.id}
2. Send to WhatsApp: ${whatsappConfig.companyPhone}
3. Cash payment at our office
    
🔔 *Next Steps:*
- Complete payment within 24 hours
- Send payment confirmation to this number
- We'll verify and confirm your booking
    
📞 *Need Help?*
Call us at ${whatsappConfig.companyPhone} or reply to this message.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `${whatsappConfig.apiUrl}?phone=${bookingData.whatsapp_number.replace('+', '')}&text=${encodedMessage}`;
    
    logger.info(`User WhatsApp confirmation prepared for booking ${bookingData.id}`);
    return {
      success: true,
      whatsappUrl
    };
  } catch (error) {
    logger.error('Failed to send user WhatsApp confirmation:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  sendAdminBookingNotification,
  sendUserBookingConfirmation
};