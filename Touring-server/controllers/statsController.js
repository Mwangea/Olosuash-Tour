const StatsModel = require('../models/statsModel');

exports.getQuickStats = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    
    // Validate input
    if (days <= 0 || days > 365) {
      throw new AppError('Invalid days parameter. Must be between 1 and 365.', 400);
    }

    const stats = await StatsModel.getQuickStats(days);
    
    res.status(200).json({
      status: 'success',
      data: {
        ...stats,
        period_days: days
      }
    });
  } catch (error) {
    next(error);
  }
};