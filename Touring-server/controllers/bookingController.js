const Booking = require('../models/bookingModel');
const { sendBookingConfirmationEmail, sendBookingStatusUpdateEmail } = require('../services/emailService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Create a new booking
exports.createBooking = async (req, res, next) => {
  try {
    const { tour_id, travel_date, number_of_travelers, payment_method, special_requests, whatsapp_number } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!tour_id || !travel_date || !number_of_travelers || !payment_method) {
      return next(new AppError('Please provide all required booking details', 400));
    }

    // Validate travel date is in the future
    if (new Date(travel_date) < new Date()) {
      return next(new AppError('Travel date must be in the future', 400));
    }

    // Validate number of travelers
    if (number_of_travelers < 1 || number_of_travelers > 20) {
      return next(new AppError('Number of travelers must be between 1 and 20', 400));
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

    // Generate WhatsApp link if payment method is WhatsApp
    if (payment_method === 'whatsapp') {
      const whatsappNumber = await Booking.getSetting('admin_whatsapp_number');
      if (whatsappNumber) {
        const message = `New booking for ${booking.tour_title} on ${new Date(travel_date).toLocaleDateString()} for ${number_of_travelers} people. Total: $${booking.total_price}`;
        booking.whatsapp_url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      }
    }

    // Send confirmation email
    await sendBookingConfirmationEmail(booking);

    res.status(201).json({
      status: 'success',
      data: {
        booking: {
          id: booking.id,
          tour_id: booking.tour_id,
          tour_title: booking.tour_title,
          travel_date: booking.travel_date,
          number_of_travelers: booking.number_of_travelers,
          total_price: booking.total_price,
          status: booking.status,
          payment_method: booking.payment_method,
          whatsapp_url: booking.whatsapp_url,
          tour_duration: booking.tour_duration,
          created_at: booking.created_at
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

    // Send status update email
    await sendBookingStatusUpdateEmail(updatedBooking);

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