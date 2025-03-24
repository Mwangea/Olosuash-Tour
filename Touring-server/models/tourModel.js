const db = require('../config/db');
const slugify = require('slugify');

class Tour {
  static async createTour(tourData, imagePaths = []) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Create slug from title
      const slug = slugify(tourData.title, { lower: true });
      
      // Insert tour
      const [result] = await connection.query(
        `INSERT INTO tours 
        (title, slug, description, summary, duration, max_group_size, 
         difficulty, price, discount_price, featured) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tourData.title,
          slug,
          tourData.description,
          tourData.summary,
          tourData.duration,
          tourData.maxGroupSize,
          tourData.difficulty,
          tourData.price,
          tourData.discountPrice || null,
          tourData.featured || false
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
      
      // Insert included services if provided
      if (tourData.includedServices && tourData.includedServices.length > 0) {
        const includedValues = tourData.includedServices.map(service => [
          tourId,
          service
        ]);
        
        await connection.query(
          `INSERT INTO tour_included_services (tour_id, service) VALUES ?`,
          [includedValues]
        );
      }
      
      // Insert excluded services if provided
      if (tourData.excludedServices && tourData.excludedServices.length > 0) {
        const excludedValues = tourData.excludedServices.map(service => [
          tourId,
          service
        ]);
        
        await connection.query(
          `INSERT INTO tour_excluded_services (tour_id, service) VALUES ?`,
          [excludedValues]
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
      return this.getTourById(tourId);
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  static async getAllTours(options = {}) {
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
      search
    } = options;
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Start building the query
    let query = `
      SELECT 
        t.*,
        (SELECT image_path FROM tour_images WHERE tour_id = t.id AND is_cover = 1 LIMIT 1) as cover_image
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
    
    // Add sorting
    query += ` ORDER BY t.${sort} ${order}`;
    
    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    // Execute query
    const [rows] = await db.query(query, queryParams);
    
    // Count total tours for pagination info
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM tours t WHERE 1=1`,
      queryParams.slice(0, -2) // Remove limit and offset params
    );
    
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
  }
  
  static async getTourById(id) {
    // Get the main tour information
    const [tourRows] = await db.query(
      `SELECT * FROM tours WHERE id = ?`,
      [id]
    );
    
    if (tourRows.length === 0) {
      return null;
    }
    
    const tour = tourRows[0];
    
    // Get tour images
    const [images] = await db.query(
      `SELECT id, image_path, is_cover FROM tour_images WHERE tour_id = ?`,
      [id]
    );
    tour.images = images;
    
    // Get tour itinerary
    const [itinerary] = await db.query(
      `SELECT id, day, title, description FROM tour_itineraries 
       WHERE tour_id = ? ORDER BY day ASC`,
      [id]
    );
    tour.itinerary = itinerary;
    
    // Get tour locations
    const [locations] = await db.query(
      `SELECT id, name, description, latitude, longitude, day 
       FROM tour_locations WHERE tour_id = ?`,
      [id]
    );
    tour.locations = locations;
    
    // Get included services
    const [includedServices] = await db.query(
      `SELECT id, service FROM tour_included_services WHERE tour_id = ?`,
      [id]
    );
    tour.includedServices = includedServices.map(item => item.service);
    
    // Get excluded services
    const [excludedServices] = await db.query(
      `SELECT id, service FROM tour_excluded_services WHERE tour_id = ?`,
      [id]
    );
    tour.excludedServices = excludedServices.map(item => item.service);
    
    // Get availability dates
    const [availability] = await db.query(
      `SELECT id, start_date, end_date, available_spots 
       FROM tour_availability WHERE tour_id = ?`,
      [id]
    );
    tour.availability = availability;
    
    // Get reviews
    const [reviews] = await db.query(
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
  }
  
  static async getTourBySlug(slug) {
    // Get the tour ID by slug
    const [tourRows] = await db.query(
      `SELECT id FROM tours WHERE slug = ?`,
      [slug]
    );
    
    if (tourRows.length === 0) {
      return null;
    }
    
    // Use the existing getTourById method to fetch all tour details
    return this.getTourById(tourRows[0].id);
  }
  
  static async updateTour(id, tourData) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Update slug if title is provided
      if (tourData.title) {
        tourData.slug = slugify(tourData.title, { lower: true });
      }
      
      // Build the update query dynamically based on provided fields
      const allowedFields = [
        'title', 'slug', 'description', 'summary', 'duration', 
        'max_group_size', 'difficulty', 'price', 'discount_price', 'featured'
      ];
      
      const updateFields = [];
      const updateValues = [];
      
      // Convert camelCase to snake_case for database
      const fieldMapping = {
        maxGroupSize: 'max_group_size',
        discountPrice: 'discount_price'
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
      
      // Handle itinerary updates if provided
      if (tourData.itinerary) {
        // Delete existing itinerary
        await connection.query(
          `DELETE FROM tour_itineraries WHERE tour_id = ?`,
          [id]
        );
        
        // Insert new itinerary
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
        // Delete existing locations
        await connection.query(
          `DELETE FROM tour_locations WHERE tour_id = ?`,
          [id]
        );
        
        // Insert new locations
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
        // Delete existing included services
        await connection.query(
          `DELETE FROM tour_included_services WHERE tour_id = ?`,
          [id]
        );
        
        // Insert new included services
        if (tourData.includedServices.length > 0) {
          const includedValues = tourData.includedServices.map(service => [
            id,
            service
          ]);
          
          await connection.query(
            `INSERT INTO tour_included_services (tour_id, service) VALUES ?`,
            [includedValues]
          );
        }
      }
      
      // Handle excluded services updates if provided
      if (tourData.excludedServices) {
        // Delete existing excluded services
        await connection.query(
          `DELETE FROM tour_excluded_services WHERE tour_id = ?`,
          [id]
        );
        
        // Insert new excluded services
        if (tourData.excludedServices.length > 0) {
          const excludedValues = tourData.excludedServices.map(service => [
            id,
            service
          ]);
          
          await connection.query(
            `INSERT INTO tour_excluded_services (tour_id, service) VALUES ?`,
            [excludedValues]
          );
        }
      }
      
      // Handle availability updates if provided
      if (tourData.availability) {
        // Delete existing availability
        await connection.query(
          `DELETE FROM tour_availability WHERE tour_id = ?`,
          [id]
        );
        
        // Insert new availability
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
      return this.getTourById(id);
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  static async deleteTour(id) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Delete all related records
      // Due to foreign key constraints with CASCADE delete, 
      // we only need to delete the main tour record
      
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
  }
  
  static async addTourImage(tourId, imagePath, isCover = false) {
    // If setting as cover, unset other cover images
    if (isCover) {
      await db.query(
        `UPDATE tour_images SET is_cover = 0 WHERE tour_id = ?`,
        [tourId]
      );
    }
    
    // Insert new image
    const [result] = await db.query(
      `INSERT INTO tour_images (tour_id, image_path, is_cover) VALUES (?, ?, ?)`,
      [tourId, imagePath, isCover]
    );
    
    return result.insertId;
  }
  
  static async removeTourImage(imageId) {
    const [result] = await db.query(
      `DELETE FROM tour_images WHERE id = ?`,
      [imageId]
    );
    
    return result.affectedRows > 0;
  }
  
  static async updateImageCover(tourId, imageId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Reset all cover flags for this tour
      await connection.query(
        `UPDATE tour_images SET is_cover = 0 WHERE tour_id = ?`,
        [tourId]
      );
      
      // Set the new cover image
      await connection.query(
        `UPDATE tour_images SET is_cover = 1 WHERE id = ? AND tour_id = ?`,
        [imageId, tourId]
      );
      
      await connection.commit();
      
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  static async addReview(tourId, userId, rating, review) {
    const connection = await db.getConnection();
    
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
  }
  
  static async addToWishlist(userId, tourId) {
    try {
      await db.query(
        `INSERT INTO wishlists (user_id, tour_id) VALUES (?, ?)`,
        [userId, tourId]
      );
      
      return true;
    } catch (error) {
      // If duplicate entry error, the tour is already in the wishlist
      if (error.code === 'ER_DUP_ENTRY') {
        return true;
      }
      throw error;
    }
  }
  
  static async removeFromWishlist(userId, tourId) {
    const [result] = await db.query(
      `DELETE FROM wishlists WHERE user_id = ? AND tour_id = ?`,
      [userId, tourId]
    );
    
    return result.affectedRows > 0;
  }
  
  static async getUserWishlist(userId) {
    const [rows] = await db.query(`
      SELECT 
        t.*,
        (SELECT image_path FROM tour_images WHERE tour_id = t.id AND is_cover = 1 LIMIT 1) as cover_image,
        w.created_at as added_to_wishlist_at
      FROM wishlists w
      JOIN tours t ON w.tour_id = t.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `, [userId]);
    
    return rows;
  }
  
  static async checkWishlist(userId, tourId) {
    const [rows] = await db.query(
      `SELECT id FROM wishlists WHERE user_id = ? AND tour_id = ?`,
      [userId, tourId]
    );
    
    return rows.length > 0;
  }
  
  static async getTourStats() {
    const [rows] = await db.query(`
      SELECT
        COUNT(*) as total_tours,
        AVG(price) as average_price,
        MIN(price) as min_price,
        MAX(price) as max_price,
        SUM(rating_quantity) as total_reviews,
        AVG(rating) as average_rating
      FROM tours
    `);
    
    return rows[0];
  }
  
  static async getTopRatedTours(limit = 5) {
    const [rows] = await db.query(`
      SELECT 
        t.*,
        (SELECT image_path FROM tour_images WHERE tour_id = t.id AND is_cover = 1 LIMIT 1) as cover_image
      FROM tours t
      WHERE t.rating_quantity > 0
      ORDER BY t.rating DESC, t.rating_quantity DESC
      LIMIT ?
    `, [limit]);
    
    return rows;
  }
  
  static async getFeaturedTours(limit = 5) {
    const [rows] = await db.query(`
      SELECT 
        t.*,
        (SELECT image_path FROM tour_images WHERE tour_id = t.id AND is_cover = 1 LIMIT 1) as cover_image
      FROM tours t
      WHERE t.featured = 1
      ORDER BY t.created_at DESC
      LIMIT ?
    `, [limit]);
    
    return rows;
  }
}

module.exports = Tour;