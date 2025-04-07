const { pool } = require('../config/db');
const logger = require('../utils/logger');

class BookingModel {
  // Create a new booking
  static async create(bookingData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Calculate total price
      const [tour] = await connection.query(
        `SELECT price, discount_price FROM tours WHERE id = ?`,
        [bookingData.tour_id]
      );
      
      if (!tour.length) {
        throw new Error('Tour not found');
      }

      const price = tour[0].discount_price || tour[0].price;
      const totalPrice = price * bookingData.number_of_travelers;

      // Insert booking
      const [result] = await connection.query(
        `INSERT INTO bookings SET ?`,
        {
          tour_id: bookingData.tour_id,
          user_id: bookingData.user_id,
          travel_date: bookingData.travel_date,
          number_of_travelers: bookingData.number_of_travelers,
          total_price: totalPrice,
          payment_method: bookingData.payment_method,
          payment_status: bookingData.payment_method === 'online' ? 'pending' : 'completed',
          special_requests: bookingData.special_requests || null,
          whatsapp_number: bookingData.payment_method === 'whatsapp' ? bookingData.whatsapp_number : null,
          whatsapp_url: null, // Will be updated after creation
          status: 'pending'
        }
      );

      const bookingId = result.insertId;

      // Log status change
      await connection.query(
        `INSERT INTO booking_status_log SET ?`,
        {
          booking_id: bookingId,
          status: 'pending',
          changed_by: bookingData.user_id,
          notes: 'Booking created'
        }
      );

      // Get full booking details
      const [booking] = await connection.query(
        `SELECT b.*, t.title AS tour_title, t.duration AS tour_duration,
                u.username AS user_name, u.email AS user_email, u.phone_number AS user_phone
         FROM bookings b
         JOIN tours t ON b.tour_id = t.id
         JOIN users u ON b.user_id = u.id
         WHERE b.id = ?`,
        [bookingId]
      );

      await connection.commit();
      return booking[0];
    } catch (error) {
      await connection.rollback();
      logger.error(`Booking creation failed: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Find booking by ID with full details
  static async findById(id) {
    try {
      // Get booking basics
      const [bookings] = await pool.query(
        `SELECT b.*, t.title AS tour_title, t.description AS tour_description,
                t.price AS tour_price, t.discount_price AS tour_discount_price,
                t.duration AS tour_duration, t.difficulty AS tour_difficulty,
                u.username AS user_name, u.email AS user_email, u.phone_number AS user_phone
         FROM bookings b
         JOIN tours t ON b.tour_id = t.id
         JOIN users u ON b.user_id = u.id
         WHERE b.id = ?`,
        [id]
      );
      
      if (bookings.length === 0) return null;
      
      const booking = bookings[0];
      
      // Safely get itinerary
      let itinerary = [];
      try {
        const [itineraryData] = await pool.query(
          'SELECT day, title, description FROM tour_itineraries WHERE tour_id = ? ORDER BY day',
          [booking.tour_id]
        );
        itinerary = itineraryData || [];
      } catch (err) {
        logger.error(`Error fetching itinerary: ${err.message}`);
      }
      
      // Safely get included services
      let includedServices = [];
      try {
        const [includedData] = await pool.query(
          `SELECT s.name, tis.details 
           FROM tour_included_services tis
           JOIN services s ON tis.service_id = s.id
           WHERE tis.tour_id = ?`,
          [booking.tour_id]
        );
        includedServices = includedData || [];
      } catch (err) {
        logger.error(`Error fetching included services: ${err.message}`);
      }
      
      // Safely get excluded services
      let excludedServices = [];
      try {
        const [excludedData] = await pool.query(
          `SELECT s.name, tes.details 
           FROM tour_excluded_services tes
           JOIN services s ON tes.service_id = s.id
           WHERE tes.tour_id = ?`,
          [booking.tour_id]
        );
        excludedServices = excludedData || [];
      } catch (err) {
        logger.error(`Error fetching excluded services: ${err.message}`);
      }
      
      // Get status history
      let statusHistory = [];
      try {
        const [historyData] = await pool.query(
          `SELECT status, notes, created_at, 
                  CONCAT(u.username, ' (', u.role, ')') AS changed_by
           FROM booking_status_log l
           LEFT JOIN users u ON l.changed_by = u.id
           WHERE booking_id = ?
           ORDER BY created_at DESC`,
          [id]
        );
        statusHistory = historyData || [];
      } catch (err) {
        logger.error(`Error fetching status history: ${err.message}`);
      }
      
      // Get payment history
      let paymentHistory = [];
      try {
        const [paymentData] = await pool.query(
          `SELECT amount, payment_method, status, 
                  transaction_reference, notes, created_at
           FROM booking_payments
           WHERE booking_id = ?
           ORDER BY created_at DESC`,
          [id]
        );
        paymentHistory = paymentData || [];
      } catch (err) {
        logger.error(`Error fetching payment history: ${err.message}`);
      }
      
      return {
        ...booking,
        tour_details: {
          itinerary,
          included_services: includedServices,
          excluded_services: excludedServices
        },
        status_history: statusHistory,
        payment_history: paymentHistory
      };
    } catch (error) {
      logger.error(`Error finding booking by ID: ${error.message}`);
      throw error;
    }
  }

  // Find all bookings with filters and pagination
  static async findAll(filters = {}) {
    const { status, user_id, search, start_date, end_date, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    let query = `
  SELECT b.*, t.title AS tour_title, t.duration AS tour_duration,
         u.username AS user_name, u.email AS user_email,
         b.created_at AS booking_created_at, b.updated_at AS booking_updated_at
  FROM bookings b
  JOIN tours t ON b.tour_id = t.id
  JOIN users u ON b.user_id = u.id
  WHERE 1=1
`;
    const params = [];

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }

    if (user_id) {
      query += ' AND b.user_id = ?';
      params.push(user_id);
    }

    if (search) {
      query += ' AND (t.title LIKE ? OR u.username LIKE ? OR u.email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (start_date) {
      query += ' AND b.travel_date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND b.travel_date <= ?';
      params.push(end_date);
    }

    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [bookings] = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = `
  SELECT COUNT(*) AS total 
  FROM bookings b
  JOIN tours t ON b.tour_id = t.id
  JOIN users u ON b.user_id = u.id
  WHERE 1=1
`;
    const countParams = [];

    if (status) {
      countQuery += ' AND b.status = ?';
      countParams.push(status);
    }

    if (user_id) {
      countQuery += ' AND b.user_id = ?';
      countParams.push(user_id);
    }

    if (search) {
      countQuery += ' AND (t.title LIKE ? OR u.username LIKE ? OR u.email LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (start_date) {
      countQuery += ' AND b.travel_date >= ?';
      countParams.push(start_date);
    }

    if (end_date) {
      countQuery += ' AND b.travel_date <= ?';
      countParams.push(end_date);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    return {
      bookings,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    };
  }

  // Update booking status
  static async updateStatus(id, status, adminId, notes = null) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Update booking status
      const [result] = await connection.query(
        `UPDATE bookings 
         SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [status, notes, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Booking not found');
      }

      // Log status change
      await connection.query(
        `INSERT INTO booking_status_log SET ?`,
        {
          booking_id: id,
          status,
          changed_by: adminId,
          notes: notes || `Status changed to ${status}`
        }
      );

      // If cancelled and paid, create refund record
      if (status === 'cancelled') {
        const [booking] = await connection.query(
          `SELECT payment_status, total_price FROM bookings WHERE id = ?`,
          [id]
        );

        if (booking[0].payment_status === 'completed') {
          await connection.query(
            `INSERT INTO booking_payments SET ?`,
            {
              booking_id: id,
              amount: booking[0].total_price,
              payment_method: 'refund',
              status: 'refunded',
              notes: 'Automatic refund due to cancellation'
            }
          );

          await connection.query(
            `UPDATE bookings 
             SET payment_status = 'refunded'
             WHERE id = ?`,
            [id]
          );
        }
      }

      await connection.commit();

      // Get updated booking
      const updatedBooking = await this.findById(id);
      return updatedBooking;
    } catch (error) {
      await connection.rollback();
      logger.error(`Error updating booking status: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Cancel booking
  static async cancel(id, userId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get current status
      const [booking] = await connection.query(
        'SELECT status FROM bookings WHERE id = ?',
        [id]
      );

      if (booking.length === 0) {
        throw new Error('Booking not found');
      }

      if (booking[0].status === 'cancelled') {
        throw new Error('Booking is already cancelled');
      }

      // Update booking status
      const [result] = await connection.query(
        `UPDATE bookings 
         SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [id]
      );

      // Log status change
      await connection.query(
        `INSERT INTO booking_status_log SET ?`,
        {
          booking_id: id,
          status: 'cancelled',
          changed_by: userId,
          notes: 'Booking cancelled by user'
        }
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      logger.error(`Error cancelling booking: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get booking statistics
  static async getStats() {
    try {
      const [results] = await pool.query(`
        SELECT 
          COUNT(*) AS total_bookings,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_bookings,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved_bookings,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_bookings,
          SUM(total_price) AS total_revenue,
          AVG(total_price) AS average_booking_value,
          MIN(travel_date) AS earliest_booking,
          MAX(travel_date) AS latest_booking,
          SUM(CASE WHEN payment_status = 'completed' THEN total_price ELSE 0 END) AS revenue_completed,
          SUM(CASE WHEN payment_status = 'pending' THEN total_price ELSE 0 END) AS revenue_pending,
          SUM(CASE WHEN payment_status = 'refunded' THEN total_price ELSE 0 END) AS revenue_refunded
        FROM bookings
      `);
      return results[0];
    } catch (error) {
      logger.error(`Error getting booking stats: ${error.message}`);
      throw error;
    }
  }

  // Get all system settings
  static async getSettings() {
    try {
      const [settings] = await pool.query(
        'SELECT setting_key, setting_value FROM system_settings'
      );
      
      // Convert array of settings to an object for easier access
      return settings.reduce((acc, { setting_key, setting_value }) => {
        acc[setting_key] = setting_value;
        return acc;
      }, {});
    } catch (error) {
      logger.error(`Error getting system settings: ${error.message}`);
      throw error;
    }
  }

  // Get single system setting
  static async getSetting(key) {
    try {
      const [settings] = await pool.query(
        'SELECT setting_value FROM system_settings WHERE setting_key = ?',
        [key]
      );
      return settings[0]?.setting_value || null;
    } catch (error) {
      logger.error(`Error getting system setting: ${error.message}`);
      throw error;
    }
  }

  // Update whatsapp_url for a booking
  static async updateWhatsappUrl(bookingId, whatsappUrl) {
    try {
      const [result] = await pool.query(
        'UPDATE bookings SET whatsapp_url = ? WHERE id = ?',
        [whatsappUrl, bookingId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      logger.error(`Error updating whatsapp_url: ${error.message}`);
      throw error;
    }
  }

}

module.exports = BookingModel;