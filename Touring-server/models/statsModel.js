const { pool } = require('../config/db');
const { AppError } = require('../middleware/errorHandler');

class StatsModel {
  static async getQuickStats(days = 30) {
    const connection = await pool.getConnection();
    try {
      // Simple query to test connection first
      await connection.query('SELECT 1');
      
      const [results] = await connection.query(`
        SELECT
          COUNT(*) as total_bookings,
          SUM(CASE WHEN status = 'approved' THEN total_price ELSE 0 END) as total_revenue,
          COUNT(DISTINCT user_id) as unique_customers
        FROM bookings
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      `, [days]);

      if (!results.length) {
        return {
          avgBookings: 0,
          avgRevenue: 0,
          conversionRate: 0,
          avgResponseTime: 0
        };
      }

      const stats = results[0];
      
      // Get total visitors (you may need to adjust this based on your analytics)
      const [visitors] = await connection.query(`
        SELECT COUNT(*) as total_visitors FROM users
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      `, [days]);

      // Calculate all metrics
      return {
        avgBookings: (stats.total_bookings / days).toFixed(1),
        avgRevenue: stats.total_bookings > 0 
          ? (stats.total_revenue / stats.total_bookings).toFixed(2)
          : 0,
        conversionRate: visitors[0].total_visitors > 0
          ? ((stats.unique_customers / visitors[0].total_visitors) * 100).toFixed(1)
          : 0,
        avgResponseTime: 24 // Placeholder - implement your actual logic
      };
    } catch (error) {
      console.error('Database error in getQuickStats:', error);
      throw new AppError('Failed to retrieve statistics', 500);
    } finally {
      connection.release();
    }
  }
}

module.exports = StatsModel;