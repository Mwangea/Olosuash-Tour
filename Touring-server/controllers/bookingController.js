const Booking = require('../models/bookingModel');
const { sendBookingConfirmationEmail, sendBookingStatusUpdateEmail, sendAdminBookingNotificationEmail } = require('../services/emailService');
const { sendAdminBookingNotification, sendUserBookingConfirmation } = require('../services/whatsappService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Create a new booking
// Create a new booking
exports.createBooking = async (req, res, next) => {
  try {
    const { tour_id, travel_date, number_of_travelers, payment_method, special_requests, whatsapp_number } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!tour_id || !travel_date || !number_of_travelers || !payment_method) {
      return next(new AppError('Please provide all required booking details', 400));
    }

    // Validate WhatsApp number if payment method is WhatsApp
    if (payment_method === 'whatsapp' && !whatsapp_number) {
      return next(new AppError('WhatsApp number is required for WhatsApp payments', 400));
    }

    // Create booking
    const booking = await Booking.create({
      tour_id,
      user_id,
      travel_date,
      number_of_travelers,
      payment_method,
      special_requests,
      whatsapp_number: payment_method === 'whatsapp' ? whatsapp_number : null
    });

    if (!booking) {
      return next(new AppError('Booking creation failed', 500));
    }

    // Get full booking details with proper error handling
    let fullBooking;
    try {
      fullBooking = await Booking.findById(booking.id);
      if (!fullBooking) {
        throw new Error('Booking details not found');
      }
    } catch (err) {
      logger.error(`Error fetching booking details: ${err.message}`);
      // Use basic booking info if details can't be fetched
      fullBooking = booking;
    }

    try {
      // Send confirmation email to user
      await sendBookingConfirmationEmail(fullBooking);
      logger.info(`Confirmation email sent to user for booking ${fullBooking.id}`);
      
      // Send admin notification email
      await sendAdminBookingNotificationEmail(fullBooking);
      logger.info(`Admin notification email sent for booking ${fullBooking.id}`);
    } catch (emailError) {
      logger.error(`Email notification failed for booking ${fullBooking.id}: ${emailError.message}`);
    }

    try {
      // Send WhatsApp notifications
      if (fullBooking.payment_method === 'whatsapp' && fullBooking.whatsapp_number) {
        // Send confirmation to user
        const userWhatsappResult = await sendUserBookingConfirmation({
          id: fullBooking.id,
          tour_title: fullBooking.tour_title,
          travel_date: fullBooking.travel_date,
          number_of_travelers: fullBooking.number_of_travelers,
          total_price: fullBooking.total_price,
          whatsapp_number: fullBooking.whatsapp_number
        });
        
        if (userWhatsappResult.success) {
          fullBooking.whatsapp_url = userWhatsappResult.whatsappUrl;
          await Booking.updateWhatsappUrl(fullBooking.id, userWhatsappResult.whatsappUrl);
          logger.info(`WhatsApp confirmation sent to user for booking ${fullBooking.id}`);
        } else {
          logger.error(`Failed to send WhatsApp to user for booking ${fullBooking.id}: ${userWhatsappResult.error}`);
        }
      }
      
      // Send WhatsApp notification to admin
      const adminWhatsappResult = await sendAdminWhatsapp(fullBooking);
      if (adminWhatsappResult.success) {
        logger.info(`Admin WhatsApp notification sent for booking ${fullBooking.id}`);
      } else {
        logger.error(`Failed to send WhatsApp to admin for booking ${fullBooking.id}: ${adminWhatsappResult.error}`);
      }
    } catch (whatsappError) {
      logger.error(`WhatsApp notification failed for booking ${fullBooking.id}: ${whatsappError.message}`);
    }

    res.status(201).json({
      status: 'success',
      data: {
        booking: {
          id: fullBooking.id,
          tour_id: fullBooking.tour_id,
          tour_title: fullBooking.tour_title || 'Tour',
          travel_date: fullBooking.travel_date,
          number_of_travelers: fullBooking.number_of_travelers,
          total_price: fullBooking.total_price,
          status: fullBooking.status,
          payment_method: fullBooking.payment_method,
          whatsapp_url: fullBooking.whatsapp_url,
          tour_duration: fullBooking.tour_duration,
          created_at: fullBooking.created_at,
          phone: fullBooking.user_phone
        }
      }
    });
  } catch (error) {
    logger.error(`Booking creation error: ${error.message}`);
    next(error);
  }
};


// Get all bookings (admin) or user's bookings
exports.getBookings = async (req, res, next) => {
  try {
    const { status, search, start_date, end_date, page = 1, limit = 10 } = req.query;
    const filters = { page, limit };

    // Admins can see all bookings, users only see their own
    if (req.user.role === 'admin') {
      if (status) filters.status = status;
      if (search) filters.search = search;
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;
    } else {
      filters.user_id = req.user.id;
    }

    const { bookings, pagination } = await Booking.findAll(filters);

    res.status(200).json({
      status: 'success',
      pagination,
      data: {
        bookings: bookings.map(booking => ({
          id: booking.id,
          tour_id: booking.tour_id,
          tour_title: booking.tour_title,
          travel_date: booking.travel_date,
          number_of_travelers: booking.number_of_travelers,
          total_price: booking.total_price,
          status: booking.status,
          payment_method: booking.payment_method,
          created_at: booking.created_at,
          user_name: req.user.role === 'admin' ? booking.user_name : undefined
        }))
      }
    });
  } catch (error) {
    logger.error(`Error getting bookings: ${error.message}`);
    next(error);
  }
};

// Get single booking
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check if user is authorized to view this booking
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return next(new AppError('Not authorized to view this booking', 403));
    }

    // Format response based on user role
    const responseData = {
      id: booking.id,
      tour_id: booking.tour_id,
      tour_title: booking.tour_title,
      tour_description: booking.tour_description,
      tour_price: booking.tour_price,
      tour_discount_price: booking.tour_discount_price,
      tour_duration: booking.tour_duration,
      tour_difficulty: booking.tour_difficulty,
      travel_date: booking.travel_date,
      number_of_travelers: booking.number_of_travelers,
      total_price: booking.total_price,
      status: booking.status,
      payment_method: booking.payment_method,
      payment_status: booking.payment_status,
      special_requests: booking.special_requests,
      whatsapp_number: booking.whatsapp_number,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      user_name: booking.user_name,
      user_email: booking.user_email,
      tour_details: {
        itinerary: booking.tour_details.itinerary,
        included_services: booking.tour_details.included_services,
        excluded_services: booking.tour_details.excluded_services
      },
      status_history: booking.status_history
    };

    // Add admin-only fields if user is admin
    if (req.user.role === 'admin') {
      responseData.admin_notes = booking.admin_notes;
      responseData.user_phone = booking.user_phone;
      responseData.payment_history = booking.payment_history;
    }

    res.status(200).json({
      status: 'success',
      data: {
        booking: responseData
      }
    });
  } catch (error) {
    logger.error(`Error getting booking: ${error.message}`);
    next(error);
  }
};

// Update booking status (admin only)
// Update booking status (admin only)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, admin_notes } = req.body;

    if (!status || !['pending', 'approved', 'cancelled'].includes(status)) {
      return next(new AppError('Please provide a valid status', 400));
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    const updatedBooking = await Booking.updateStatus(
      req.params.id, 
      status, 
      req.user.id,
      admin_notes
    );

    try {
      // Send status update email to user
      await sendBookingStatusUpdateEmail(updatedBooking);
      logger.info(`Status update email sent for booking ${updatedBooking.id}`);
      
      // If status is approved, send another notification to admin
      if (status === 'approved') {
        await sendAdminBookingNotificationEmail(updatedBooking);
        logger.info(`Approval notification sent to admin for booking ${updatedBooking.id}`);
      }
    } catch (emailError) {
      logger.error(`Failed to send status update emails for booking ${updatedBooking.id}: ${emailError.message}`);
    }

    res.status(200).json({
      status: 'success',
      data: {
        booking: {
          id: updatedBooking.id,
          status: updatedBooking.status,
          admin_notes: updatedBooking.admin_notes,
          updated_at: updatedBooking.updated_at
        }
      }
    });
  } catch (error) {
    logger.error(`Error updating booking status: ${error.message}`);
    next(error);
  }
};

// Cancel booking (user or admin)
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check if user is authorized to cancel this booking
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return next(new AppError('Not authorized to cancel this booking', 403));
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return next(new AppError('Booking is already cancelled', 400));
    }

    const cancelled = await Booking.cancel(req.params.id, req.user.id);
    if (!cancelled) {
      return next(new AppError('Booking cancellation failed', 400));
    }

    // Get updated booking
    const updatedBooking = await Booking.findById(req.params.id);

    // Send cancellation email
    await sendBookingStatusUpdateEmail(updatedBooking);

    res.status(200).json({
      status: 'success',
      data: {
        booking: {
          id: updatedBooking.id,
          status: updatedBooking.status,
          payment_status: updatedBooking.payment_status,
          updated_at: updatedBooking.updated_at
        }
      }
    });
  } catch (error) {
    logger.error(`Error cancelling booking: ${error.message}`);
    next(error);
  }
};

// Get booking statistics (admin only)
exports.getBookingStats = async (req, res, next) => {
  try {
    const stats = await Booking.getStats();
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    logger.error(`Error getting booking stats: ${error.message}`);
    next(error);
  };
  
};