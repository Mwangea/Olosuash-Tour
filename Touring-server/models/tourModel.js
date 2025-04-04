const { pool } = require('../config/db');
const slugify = require('slugify');

const tourModel = {
  /**
   * Create a new tour
   * @param {Object} tourData - Tour data
   * @param {Array} imagePaths - Array of image paths
   * @returns {Promise<Object>} Newly created tour
   */
  async create(tourData, imagePaths = []) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Create slug from title
      const slug = slugify(tourData.title, { lower: true });
      
      // Insert tour
      const [result] = await connection.query(
        `INSERT INTO tours 
        (title, slug, description, summary, duration, max_group_size, min_group_size, 
         difficulty, price, discount_price, featured, accommodation_details) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tourData.title,
          slug,
          tourData.description,
          tourData.summary,
          tourData.duration,
          tourData.maxGroupSize,
          tourData.minGroupSize || 1,
          tourData.difficulty,
          tourData.price,
          tourData.discountPrice || null,
          tourData.featured || false,
          tourData.accommodationDetails
        ]
      );
      
      const tourId = result.insertId;
      
      // Insert tour images
      if (imagePaths && imagePaths.length > 0) {
        const imageValues = imagePaths.map((path, index) => [
          tourId,
          path,
          index === 0 // First image is cover by default
        ]);
        
        await connection.query(
          `INSERT INTO tour_images (tour_id, image_path, is_cover) VALUES ?`,
          [imageValues]
        );
      }

      // Insert regions
      if (tourData.regions && tourData.regions.length > 0) {
        await connection.query(
          `INSERT INTO tour_regions (tour_id, region_id) VALUES ?`,
          [tourData.regions.map(regionId => [tourId, regionId])]
        );
      }

      // Insert vehicles
      if (tourData.vehicles && tourData.vehicles.length > 0) {
        await connection.query(
          `INSERT INTO tour_vehicles (tour_id, vehicle_type_id, capacity, is_primary) VALUES ?`,
          [tourData.vehicles.map(v => [tourId, v.vehicleTypeId, v.capacity, v.isPrimary || false])]
        );
      }
      
      // Insert itinerary if provided
      if (tourData.itinerary && tourData.itinerary.length > 0) {
        const itineraryValues = tourData.itinerary.map(item => [
          tourId,
          item.day,
          item.title,
          item.description
        ]);
        
        await connection.query(
          `INSERT INTO tour_itineraries (tour_id, day, title, description) VALUES ?`,
          [itineraryValues]
        );
      }
      
      // Insert locations if provided
      if (tourData.locations && tourData.locations.length > 0) {
        const locationValues = tourData.locations.map(location => [
          tourId,
          location.name,
          location.description || null,
          location.latitude,
          location.longitude,
          location.day || null
        ]);
        
        await connection.query(
          `INSERT INTO tour_locations 
          (tour_id, name, description, latitude, longitude, day) VALUES ?`,
          [locationValues]
        );
      }
      
      // Insert included services
      if (tourData.includedServices && tourData.includedServices.length > 0) {
        await connection.query(
          `INSERT INTO tour_included_services (tour_id, service_id, details) VALUES ?`,
          [tourData.includedServices.map(s => [tourId, s.serviceId, s.details || null])]
        );
      }
      
      // Insert excluded services
      if (tourData.excludedServices && tourData.excludedServices.length > 0) {
        await connection.query(
          `INSERT INTO tour_excluded_services (tour_id, service_id, details) VALUES ?`,
          [tourData.excludedServices.map(s => [tourId, s.serviceId, s.details || null])]
        );
      }
      
      // Insert availability dates if provided
      if (tourData.availability && tourData.availability.length > 0) {
        const availabilityValues = tourData.availability.map(date => [
          tourId,
          date.startDate,
          date.endDate,
          date.availableSpots
        ]);
        
        await connection.query(
          `INSERT INTO tour_availability 
          (tour_id, start_date, end_date, available_spots) VALUES ?`,
          [availabilityValues]
        );
      }
      
      await connection.commit();
      
      // Return the created tour
      return this.findById(tourId);
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  /**
   * Get all tours with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Tours and pagination info
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'DESC',
      featured,
      minPrice,
      maxPrice,
      difficulty,
      duration,
      search,
      regionId
    } = options;
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Start building the query
    let query = `
      SELECT 
        t.*,
        (SELECT image_path FROM tour_images WHERE tour_id = t.id AND is_cover = 1 LIMIT 1) as cover_image,
        (SELECT AVG(rating) FROM tour_reviews WHERE tour_id = t.id) as average_rating,
        (SELECT COUNT(*) FROM tour_reviews WHERE tour_id = t.id) as review_count
      FROM tours t
      WHERE 1=1
    `;
    
    // Array to hold query parameters
    const queryParams = [];
    
    // Add filters if provided
    if (featured !== undefined) {
      query += ` AND t.featured = ?`;
      queryParams.push(featured);
    }
    
    if (minPrice) {
      query += ` AND t.price >= ?`;
      queryParams.push(minPrice);
    }
    
    if (maxPrice) {
      query += ` AND t.price <= ?`;
      queryParams.push(maxPrice);
    }
    
    if (difficulty) {
      query += ` AND t.difficulty = ?`;
      queryParams.push(difficulty);
    }
    
    if (duration) {
      query += ` AND t.duration = ?`;
      queryParams.push(duration);
    }
    
    if (search) {
      query += ` AND (t.title LIKE ? OR t.description LIKE ? OR t.summary LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (regionId) {
      query += ` AND t.id IN (SELECT tour_id FROM tour_regions WHERE region_id = ?)`;
      queryParams.push(regionId);
    }
    
    // Validate sort field to prevent SQL injection
    const validSortFields = ['created_at', 'price', 'title', 'duration', 'average_rating'];
    const safeSort = validSortFields.includes(sort) ? sort : 'created_at';
    
    // Handle special case for average_rating which is a calculated field
    const sortField = safeSort === 'average_rating' 
      ? '(SELECT AVG(rating) FROM tour_reviews WHERE tour_id = t.id)'
      : `t.${safeSort}`;
    
    // Add sorting
    query += ` ORDER BY ${sortField} ${order === 'ASC' ? 'ASC' : 'DESC'}`;
    
    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // Execute query
    const [rows] = await pool.query(query, queryParams);
    
    // Count total tours for pagination info
    let countQuery = `SELECT COUNT(*) as total FROM tours t WHERE 1=1`;
    const countParams = [];
    
    // Rebuild the WHERE clause for count query
    if (featured !== undefined) {
      countQuery += ` AND t.featured = ?`;
      countParams.push(featured);
    }
    
    if (minPrice) {
      countQuery += ` AND t.price >= ?`;
      countParams.push(minPrice);
    }
    
    if (maxPrice) {
      countQuery += ` AND t.price <= ?`;
      countParams.push(maxPrice);
    }
    
    if (difficulty) {
      countQuery += ` AND t.difficulty = ?`;
      countParams.push(difficulty);
    }
    
    if (duration) {
      countQuery += ` AND t.duration = ?`;
      countParams.push(duration);
    }
    
    if (search) {
      countQuery += ` AND (t.title LIKE ? OR t.description LIKE ? OR t.summary LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (regionId) {
      countQuery += ` AND t.id IN (SELECT tour_id FROM tour_regions WHERE region_id = ?)`;
      countParams.push(regionId);
    }
    
    const [countResult] = await pool.query(countQuery, countParams);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    return {
      tours: rows,
      pagination: {
        total,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    };
  },
  
  /**
   * Find tour by ID
   * @param {number} id - Tour ID
   * @returns {Promise<Object|null>} Tour object or null if not found
   */
  async findById(id) {
    // Get the main tour information
    const [tourRows] = await pool.query(
      `SELECT * FROM tours WHERE id = ?`,
      [id]
    );
    
    if (tourRows.length === 0) {
      return null;
    }
    
    const tour = tourRows[0];
    
    // Get tour images
    const [images] = await pool.query(
      `SELECT id, image_path, is_cover FROM tour_images WHERE tour_id = ?`,
      [id]
    );
    tour.images = images;

    // Get regions
    const [regions] = await pool.query(`
      SELECT r.* FROM tour_regions tr
      JOIN regions r ON tr.region_id = r.id
      WHERE tr.tour_id = ?
    `, [id]);
    tour.regions = regions;

    // Get vehicles
    const [vehicles] = await pool.query(`
      SELECT vt.name as vehicle_type, tv.* FROM tour_vehicles tv
      JOIN vehicle_types vt ON tv.vehicle_type_id = vt.id
      WHERE tv.tour_id = ?
    `, [id]);
    tour.vehicles = vehicles;
    
    // Get tour itinerary
    const [itinerary] = await pool.query(
      `SELECT id, day, title, description FROM tour_itineraries 
       WHERE tour_id = ? ORDER BY day ASC`,
      [id]
    );
    tour.itinerary = itinerary;
    
    // Get tour locations
    const [locations] = await pool.query(
      `SELECT id, name, description, latitude, longitude, day 
       FROM tour_locations WHERE tour_id = ?`,
      [id]
    );
    tour.locations = locations;
    
    // Get included services
    const [includedServices] = await pool.query(`
      SELECT s.*, tis.details FROM tour_included_services tis
      JOIN services s ON tis.service_id = s.id
      WHERE tis.tour_id = ?
    `, [id]);
    tour.includedServices = includedServices;
    
    // Get excluded services
    const [excludedServices] = await pool.query(`
      SELECT s.*, tes.details FROM tour_excluded_services tes
      JOIN services s ON tes.service_id = s.id
      WHERE tes.tour_id = ?
    `, [id]);
    tour.excludedServices = excludedServices;
    
    // Get availability dates
    const [availability] = await pool.query(
      `SELECT id, start_date, end_date, available_spots 
       FROM tour_availability WHERE tour_id = ?`,
      [id]
    );
    tour.availability = availability;
    
    // Get reviews
    const [reviews] = await pool.query(
      `SELECT 
         r.id, r.rating, r.review, r.created_at,
         u.id as user_id, u.username, u.profile_picture
       FROM tour_reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.tour_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );
    tour.reviews = reviews;
    
    return tour;
  },
  
  /**
   * Find tour by slug
   * @param {string} slug - Tour slug
   * @returns {Promise<Object|null>} Tour object or null if not found
   */
  async findBySlug(slug) {
    // Get the tour ID by slug
    const [tourRows] = await pool.query(
      `SELECT id FROM tours WHERE slug = ?`,
      [slug]
    );
    
    if (tourRows.length === 0) {
      return null;
    }
    
    // Use the existing findById method to fetch all tour details
    return this.findById(tourRows[0].id);
  },
  
  /**
   * Update tour
   * @param {number} id - Tour ID
   * @param {Object} tourData - Tour data to update
   * @returns {Promise<Object>} Updated tour
   */
  async update(id, tourData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Update slug if title is provided
      if (tourData.title) {
        tourData.slug = slugify(tourData.title, { lower: true });
      }
      
      // Build the update query dynamically based on provided fields
      const allowedFields = [
        'title', 'slug', 'description', 'summary', 'duration', 
        'max_group_size', 'min_group_size', 'difficulty', 'price', 
        'discount_price', 'featured', 'accommodation_details'
      ];
      
      const updateFields = [];
      const updateValues = [];
      
      // Convert camelCase to snake_case for database
      const fieldMapping = {
        maxGroupSize: 'max_group_size',
        minGroupSize: 'min_group_size',
        discountPrice: 'discount_price',
        accommodationDetails: 'accommodation_details'
      };
      
      for (const [key, value] of Object.entries(tourData)) {
        // Skip undefined or null values and non-allowed fields
        if (value === undefined || value === null) continue;
        
        // Map camelCase to snake_case if needed
        const dbField = fieldMapping[key] || key;
        
        if (allowedFields.includes(dbField)) {
          updateFields.push(`${dbField} = ?`);
          updateValues.push(value);
        }
      }
      
      if (updateFields.length > 0) {
        // Append ID as the last parameter
        updateValues.push(id);
        
        await connection.query(
          `UPDATE tours SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
      }
      
      // Handle regions updates if provided
      if (tourData.regions) {
        await connection.query(
          `DELETE FROM tour_regions WHERE tour_id = ?`,
          [id]
        );
        
        if (tourData.regions.length > 0) {
          await connection.query(
            `INSERT INTO tour_regions (tour_id, region_id) VALUES ?`,
            [tourData.regions.map(regionId => [id, regionId])]
          );
        }
      }
      
      // Handle vehicles updates if provided
      if (tourData.vehicles) {
        await connection.query(
          `DELETE FROM tour_vehicles WHERE tour_id = ?`,
          [id]
        );
        
        if (tourData.vehicles.length > 0) {
          await connection.query(
            `INSERT INTO tour_vehicles (tour_id, vehicle_type_id, capacity, is_primary) VALUES ?`,
            [tourData.vehicles.map(v => [id, v.vehicleTypeId, v.capacity, v.isPrimary || false])]
          );
        }
      }
      
      // Handle itinerary updates if provided
      if (tourData.itinerary) {
        await connection.query(
          `DELETE FROM tour_itineraries WHERE tour_id = ?`,
          [id]
        );
        
        if (tourData.itinerary.length > 0) {
          const itineraryValues = tourData.itinerary.map(item => [
            id,
            item.day,
            item.title,
            item.description
          ]);
          
          await connection.query(
            `INSERT INTO tour_itineraries (tour_id, day, title, description) VALUES ?`,
            [itineraryValues]
          );
        }
      }
      
      // Handle locations updates if provided
      if (tourData.locations) {
        await connection.query(
          `DELETE FROM tour_locations WHERE tour_id = ?`,
          [id]
        );
        
        if (tourData.locations.length > 0) {
          const locationValues = tourData.locations.map(location => [
            id,
            location.name,
            location.description || null,
            location.latitude,
            location.longitude,
            location.day || null
          ]);
          
          await connection.query(
            `INSERT INTO tour_locations 
            (tour_id, name, description, latitude, longitude, day) VALUES ?`,
            [locationValues]
          );
        }
      }
      
      // Handle included services updates if provided
      if (tourData.includedServices) {
        await connection.query(
          `DELETE FROM tour_included_services WHERE tour_id = ?`,
          [id]
        );
        
        if (tourData.includedServices.length > 0) {
          await connection.query(
            `INSERT INTO tour_included_services (tour_id, service_id, details) VALUES ?`,
            [tourData.includedServices.map(s => [id, s.serviceId, s.details || null])]
          );
        }
      }
      
      // Handle excluded services updates if provided
      if (tourData.excludedServices) {
        await connection.query(
          `DELETE FROM tour_excluded_services WHERE tour_id = ?`,
          [id]
        );
        
        if (tourData.excludedServices.length > 0) {
          await connection.query(
            `INSERT INTO tour_excluded_services (tour_id, service_id, details) VALUES ?`,
            [tourData.excludedServices.map(s => [id, s.serviceId, s.details || null])]
          );
        }
      }
      
      // Handle availability updates if provided
      if (tourData.availability) {
        await connection.query(
          `DELETE FROM tour_availability WHERE tour_id = ?`,
          [id]
        );
        
        if (tourData.availability.length > 0) {
          const availabilityValues = tourData.availability.map(date => [
            id,
            date.startDate,
            date.endDate,
            date.availableSpots
          ]);
          
          await connection.query(
            `INSERT INTO tour_availability 
            (tour_id, start_date, end_date, available_spots) VALUES ?`,
            [availabilityValues]
          );
        }
      }
      
      await connection.commit();
      
      // Return the updated tour
      return this.findById(id);
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  /**
   * Delete tour
   * @param {number} id - Tour ID
   * @returns {Promise<boolean>} True if deletion was successful
   */
  async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
    
      const [result] = await connection.query(
        `DELETE FROM tours WHERE id = ?`,
        [id]
      );
      
      await connection.commit();
      
      return result.affectedRows > 0;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  /**
   * Add tour image
   * @param {number} tourId - Tour ID
   * @param {string} imagePath - Image path
   * @param {boolean} isCover - Whether the image is a cover image
   * @returns {Promise<number>} Image ID
   */
  async addImage(tourId, imagePath, isCover = false) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
    
      // If setting as cover, unset other cover images
      if (isCover) {
        await connection.query(
          `UPDATE tour_images SET is_cover = 0 WHERE tour_id = ?`,
          [tourId]
        );
      }
      
      // Insert new image
      const [result] = await connection.query(
        `INSERT INTO tour_images (tour_id, image_path, is_cover) VALUES (?, ?, ?)`,
        [tourId, imagePath, isCover]
      );
      
      await connection.commit();
      
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  /**
   * Remove tour image
   * @param {number} imageId - Image ID
   * @returns {Promise<boolean>} True if deletion was successful
   */
  async removeImage(imageId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
    
      const [result] = await connection.query(
        `DELETE FROM tour_images WHERE id = ?`,
        [imageId]
      );
      
      await connection.commit();
      
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  /**
   * Update image cover
   * @param {number} tourId - Tour ID
   * @param {number} imageId - Image ID
   * @returns {Promise<boolean>} True if update was successful
   */
  async updateImageCover(tourId, imageId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
    
      // Reset all cover flags for this tour
      await connection.query(
        `UPDATE tour_images SET is_cover = 0 WHERE tour_id = ?`,
        [tourId]
      );
      
      // Set the new cover image
      const [result] = await connection.query(
        `UPDATE tour_images SET is_cover = 1 WHERE id = ? AND tour_id = ?`,
        [imageId, tourId]
      );
      
      await connection.commit();
      
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  /**
   * Add review to tour
   * @param {number} tourId - Tour ID
   * @param {number} userId - User ID
   * @param {number} rating - Rating (1-5)
   * @param {string} review - Review text
   * @returns {Promise<boolean>} True if successful
   */
  async addReview(tourId, userId, rating, review) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
    
      // Check if user has already reviewed this tour
      const [existingReviews] = await connection.query(
        `SELECT id FROM tour_reviews WHERE tour_id = ? AND user_id = ?`,
        [tourId, userId]
      );
      
      if (existingReviews.length > 0) {
        // Update existing review
        await connection.query(
          `UPDATE tour_reviews SET rating = ?, review = ? WHERE id = ?`,
          [rating, review, existingReviews[0].id]
        );
      } else {
        // Insert new review
        await connection.query(
          `INSERT INTO tour_reviews (tour_id, user_id, rating, review) VALUES (?, ?, ?, ?)`,
          [tourId, userId, rating, review]
        );
      }
      
      // Update the tour's average rating
      await connection.query(`
        UPDATE tours t
        SET 
          t.rating = (SELECT AVG(rating) FROM tour_reviews WHERE tour_id = ?),
          t.rating_quantity = (SELECT COUNT(*) FROM tour_reviews WHERE tour_id = ?)
        WHERE t.id = ?
      `, [tourId, tourId, tourId]);
      
      await connection.commit();
      
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  /**
   * Add tour to user's wishlist
   * @param {number} userId - User ID
   * @param {number} tourId - Tour ID
   * @returns {Promise<boolean>} True if successful
   */
  async addToWishlist(userId, tourId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
    
      // Check if already in wishlist
      const [existing] = await connection.query(
        `SELECT id FROM wishlists WHERE user_id = ? AND tour_id = ?`,
        [userId, tourId]
      );
      
      if (existing.length > 0) {
        await connection.commit();
        return true;
      }
      
      await connection.query(
        `INSERT INTO wishlists (user_id, tour_id) VALUES (?, ?)`,
        [userId, tourId]
      );
      
      await connection.commit();
      
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  /**
   * Remove tour from user's wishlist
   * @param {number} userId - User ID
   * @param {number} tourId - Tour ID
   * @returns {Promise<boolean>} True if successful
   */
  async removeFromWishlist(userId, tourId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
    
      const [result] = await connection.query(
        `DELETE FROM wishlists WHERE user_id = ? AND tour_id = ?`,
        [userId, tourId]
      );
      
      await connection.commit();
      
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  /**
   * Get user's wishlist
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of tours
   */
  async getWishlist(userId) {
    const [rows] = await pool.query(
      `SELECT t.*, 
              (SELECT image_path FROM tour_images WHERE tour_id = t.id AND is_cover = 1 LIMIT 1) as cover_image, 
              w.created_at as added_to_wishlist_at 
       FROM wishlists w 
       JOIN tours t ON w.tour_id = t.id 
       WHERE w.user_id = ? 
       ORDER BY w.created_at DESC`,
      [userId]
    );
    return rows;
  },
  
  /**
   * Check if tour is in user's wishlist
   * @param {number} userId - User ID
   * @param {number} tourId - Tour ID
   * @returns {Promise<boolean>} True if in wishlist
   */
  async isInWishlist(userId, tourId) {
    const [rows] = await pool.query(
      `SELECT id FROM wishlists WHERE user_id = ? AND tour_id = ?`,
      [userId, tourId]
    );
    return rows.length > 0;
  },
  
 /**
 * Get comprehensive tour statistics
 * @returns {Promise<Object>} Statistics object
 */
 async getStats() {
  try {
    const [statsRows] = await pool.query(`
      SELECT 
        COUNT(*) as total_tours,
        CAST(COALESCE(AVG(price), 0) AS DECIMAL(10,2)) as average_price,
        CAST(COALESCE(MIN(price), 0) AS DECIMAL(10,2)) as min_price,
        CAST(COALESCE(MAX(price), 0) AS DECIMAL(10,2)) as max_price,
        COALESCE(SUM(rating_quantity), 0) as total_reviews,
        CAST(COALESCE(AVG(rating), 0) AS DECIMAL(10,2)) as average_rating,
        COALESCE(SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END), 0) as featured_tours,
        COALESCE((SELECT COUNT(*) FROM tour_reviews), 0) as total_reviews_all
      FROM tours
    `);
    
    return {
      total_tours: Number(statsRows[0].total_tours),
      average_price: Number(statsRows[0].average_price),
      min_price: Number(statsRows[0].min_price),
      max_price: Number(statsRows[0].max_price),
      total_reviews: Number(statsRows[0].total_reviews),
      average_rating: Number(statsRows[0].average_rating),
      featured_tours: Number(statsRows[0].featured_tours),
      total_reviews_all: Number(statsRows[0].total_reviews_all)
    };
  } catch (error) {
    console.error('Error getting tour stats:', error);
    return this.getDefaultStats();
  }
},

/**
 * Default statistics when no data exists
 */
getDefaultStats() {
  return {
    total_tours: 0,
    average_price: 0,
    min_price: 0,
    max_price: 0,
    total_reviews: 0,
    average_rating: 0,
    featured_tours: 0,
    total_reviews_all: 0,
    easy_tours: 0,
    medium_tours: 0,
    difficult_tours: 0,
    average_duration: 0,
    price_distribution: {
      under_500: 0,
      price_500_to_1000: 0,
      price_1000_to_2000: 0,
      over_2000: 0
    }
  };
},
  
  /**
   * Get top rated tours
   * @param {number} limit - Number of tours to return
   * @returns {Promise<Array>} Array of tours
   */
  async getTopRated(limit = 5) {
    const [rows] = await pool.query(
      `SELECT t.*, 
              (SELECT image_path FROM tour_images WHERE tour_id = t.id AND is_cover = 1 LIMIT 1) as cover_image 
       FROM tours t 
       WHERE t.rating_quantity > 0 
       ORDER BY t.rating DESC, t.rating_quantity DESC 
       LIMIT ?`,
      [limit]
    );
    return rows;
  },
  
  /**
   * Get featured tours
   * @param {number} limit - Number of tours to return
   * @returns {Promise<Array>} Array of tours
   */
  async getFeatured(limit = 5) {
    const [rows] = await pool.query(
      `SELECT t.*, 
              (SELECT image_path FROM tour_images WHERE tour_id = t.id AND is_cover = 1 LIMIT 1) as cover_image 
       FROM tours t 
       WHERE t.featured = 1 
       ORDER BY t.created_at DESC 
       LIMIT ?`,
      [limit]
    );
    return rows;
  },
  
  /**
   * Get all regions
   * @returns {Promise<Array>} Array of regions
   */
  async getRegions() {
    const [rows] = await pool.query('SELECT * FROM regions ORDER BY name');
    return rows;
  },
  
  /**
   * Get all vehicle types
   * @returns {Promise<Array>} Array of vehicle types
   */
  async getVehicleTypes() {
    const [rows] = await pool.query('SELECT * FROM vehicle_types ORDER BY name');
    return rows;
  },
  
  /**
   * Get all service categories with their services
   * @returns {Promise<Array>} Array of service categories
   */
  async getServiceCategories() {
    const [rows] = await pool.query(
      `SELECT sc.*, 
              (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', s.id, 
                  'name', s.name, 
                  'description', s.description
                )
              ) FROM services s WHERE s.category_id = sc.id) as services 
       FROM service_categories sc 
       ORDER BY sc.name`
    );
    return rows;
  }
};

module.exports = tourModel;