const { pool } = require('../config/db');
const slugify = require('slugify');

const experienceModel = {
  /**
   * Create a new experience category
   */
  async createCategory(categoryData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const slug = slugify(categoryData.name, { lower: true });
      
      const [result] = await connection.query(
        `INSERT INTO experience_categories 
        (name, slug, description, image_path) 
        VALUES (?, ?, ?, ?)`,
        [
          categoryData.name,
          slug,
          categoryData.description,
          categoryData.image_path
        ]
      );
      
      await connection.commit();
      return this.getCategoryById(result.insertId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Get all categories
   */
  async getAllCategories() {
    const [rows] = await pool.query(
      `SELECT * FROM experience_categories 
       WHERE is_active = 1 
       ORDER BY name`
    );
    return rows;
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM experience_categories WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug) {
    const [rows] = await pool.query(
      `SELECT * FROM experience_categories WHERE slug = ?`,
      [slug]
    );
    return rows[0] || null;
  },

  /**
   * Update category
   */
  async updateCategory(id, categoryData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Update slug if name is provided
      if (categoryData.name) {
        categoryData.slug = slugify(categoryData.name, { lower: true });
      }
      
      const allowedFields = ['name', 'slug', 'description', 'image_path', 'is_active'];
      const updateFields = [];
      const updateValues = [];
      
      for (const [key, value] of Object.entries(categoryData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      }
      
      if (updateFields.length > 0) {
        updateValues.push(id);
        await connection.query(
          `UPDATE experience_categories SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
      }
      
      await connection.commit();
      return this.getCategoryById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Delete category
   */
  async deleteCategory(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        `DELETE FROM experience_categories WHERE id = ?`,
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
   * Create a new experience
   */
  async createExperience(experienceData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Convert string numbers to actual numbers
      const numericFields = ['price', 'discount_price', 'min_group_size', 'max_group_size'];
      numericFields.forEach(field => {
        if (experienceData[field] !== undefined) {
          experienceData[field] = experienceData[field] ? Number(experienceData[field]) : null;
        }
      });
  
      const slug = slugify(experienceData.title, { lower: true });
      
      const [result] = await connection.query(
        `INSERT INTO experiences 
        (category_id, title, slug, short_description, description, duration, 
         price, discount_price, min_group_size, max_group_size, difficulty, is_featured) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          experienceData.category_id,
          experienceData.title,
          slug,
          experienceData.short_description,
          experienceData.description,
          experienceData.duration,
          experienceData.price,
          experienceData.discount_price,
          experienceData.min_group_size,
          experienceData.max_group_size,
          experienceData.difficulty,
          experienceData.is_featured || false
        ]
      );
      
      const experienceId = result.insertId;
      
      // Insert experience images
      if (experienceData.images && experienceData.images.length > 0) {
        const imageValues = experienceData.images.map((image, index) => [
          experienceId,
          image.image_path,
          image.is_cover || (index === 0) // First image is cover by default
        ]);
        
        await connection.query(
          `INSERT INTO experience_images (experience_id, image_path, is_cover) VALUES ?`,
          [imageValues]
        );
      }
  
      // Insert experience sections
      if (experienceData.sections && experienceData.sections.length > 0) {
        const sectionValues = experienceData.sections.map(section => [
          experienceId,
          section.title,
          section.description,
          section.image_path || null,
          section.order || 0
        ]);
        
        await connection.query(
          `INSERT INTO experience_sections 
          (experience_id, title, description, image_path, section_order) 
          VALUES ?`,
          [sectionValues]
        );
      }
      
      await connection.commit();
      return this.getExperienceById(experienceId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Get all experiences with optional filtering
   */
  async getAllExperiences(options = {}) {
    const {
      page = 1,
      limit = 10,
      category_id,
      featured,
      min_price,
      max_price,
      difficulty,
      search,
      is_active // Can be true, false, or undefined (no filter)
    } = options;
    
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        e.*,
        c.name as category_name,
        c.slug as category_slug,
        (SELECT image_path FROM experience_images WHERE experience_id = e.id AND is_cover = 1 LIMIT 1) as cover_image
      FROM experiences e
      JOIN experience_categories c ON e.category_id = c.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    
    // Apply is_active filter if specified
    if (is_active !== undefined) {
      query += ` AND e.is_active = ?`;
      queryParams.push(is_active ? 1 : 0);
    }
    
    if (category_id) {
      query += ` AND e.category_id = ?`;
      queryParams.push(category_id);
    }
    
    if (featured !== undefined) {
      query += ` AND e.is_featured = ?`;
      queryParams.push(featured ? 1 : 0);
    }
    
    if (min_price) {
      query += ` AND e.price >= ?`;
      queryParams.push(min_price);
    }
    
    if (max_price) {
      query += ` AND e.price <= ?`;
      queryParams.push(max_price);
    }
    
    if (difficulty) {
      query += ` AND e.difficulty = ?`;
      queryParams.push(difficulty);
    }
    
    if (search) {
      query += ` AND (e.title LIKE ? OR e.short_description LIKE ? OR e.description LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ` ORDER BY e.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    const [rows] = await pool.query(query, queryParams);
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM experiences e WHERE 1=1`;
    const countParams = [];
    
    if (is_active !== undefined) {
      countQuery += ` AND e.is_active = ?`;
      countParams.push(is_active ? 1 : 0);
    }
    
    if (category_id) {
      countQuery += ` AND e.category_id = ?`;
      countParams.push(category_id);
    }
    
    if (featured !== undefined) {
      countQuery += ` AND e.is_featured = ?`;
      countParams.push(featured ? 1 : 0);
    }
    
    if (min_price) {
      countQuery += ` AND e.price >= ?`;
      countParams.push(min_price);
    }
    
    if (max_price) {
      countQuery += ` AND e.price <= ?`;
      countParams.push(max_price);
    }
    
    if (difficulty) {
      countQuery += ` AND e.difficulty = ?`;
      countParams.push(difficulty);
    }
    
    if (search) {
      countQuery += ` AND (e.title LIKE ? OR e.short_description LIKE ? OR e.description LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const [countRows] = await pool.query(countQuery, countParams);
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);
    
    return {
      experiences: rows,
      pagination: {
        total,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    };
  },

  async getExperienceById(id) {
    // Get experience details
    const [experienceRows] = await pool.query(
      `SELECT e.*, c.name as category_name, c.slug as category_slug 
       FROM experiences e
       JOIN experience_categories c ON e.category_id = c.id
       WHERE e.id = ?`,
      [id]
    );
    
    if (experienceRows.length === 0) {
      return null;
    }
    
    const experience = experienceRows[0];
    
    // Get images
    const [images] = await pool.query(
      `SELECT id, image_path, is_cover 
       FROM experience_images 
       WHERE experience_id = ? 
       ORDER BY is_cover DESC, created_at ASC`,
      [id]
    );
    experience.images = images;
  
    // Get sections
    const [sections] = await pool.query(
      `SELECT id, title, description, image_path, section_order as "order"
       FROM experience_sections
       WHERE experience_id = ?
       ORDER BY section_order ASC`,
      [id]
    );
    experience.sections = sections;
    
    return experience;
  },
  
  async getExperienceBySlug(slug) {
    const [experienceRows] = await pool.query(
      `SELECT e.*, c.name as category_name, c.slug as category_slug 
       FROM experiences e
       JOIN experience_categories c ON e.category_id = c.id
       WHERE e.slug = ?`,
      [slug]
    );
    
    if (experienceRows.length === 0) {
      return null;
    }
    
    const experience = experienceRows[0];
    
    // Get images
    const [images] = await pool.query(
      `SELECT id, image_path, is_cover 
       FROM experience_images 
       WHERE experience_id = ? 
       ORDER BY is_cover DESC, created_at ASC`,
      [experience.id]
    );
    experience.images = images;
  
    // Get sections
    const [sections] = await pool.query(
      `SELECT id, title, description, image_path, section_order as "order"
       FROM experience_sections
       WHERE experience_id = ?
       ORDER BY section_order ASC`,
      [experience.id]
    );
    experience.sections = sections;
    
    return experience;
  },

  /**
   * Update experience
   */
  async updateExperience(id, experienceData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Update slug if title is provided
      if (experienceData.title) {
        experienceData.slug = slugify(experienceData.title, { lower: true });
      }
      
      const allowedFields = [
        'category_id', 'title', 'slug', 'short_description', 'description',
        'duration', 'price', 'discount_price', 'min_group_size', 'max_group_size',
        'difficulty', 'is_featured', 'is_active'
      ];
      
      const updateFields = [];
      const updateValues = [];
      
      for (const [key, value] of Object.entries(experienceData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      }
      
      if (updateFields.length > 0) {
        updateValues.push(id);
        await connection.query(
          `UPDATE experiences SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
      }
      
      await connection.commit();
      return this.getExperienceById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Delete experience
   */
  async deleteExperience(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        `DELETE FROM experiences WHERE id = ?`,
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
   * Add experience image
   */
  async addExperienceImage(experienceId, imagePath, isCover = false) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // If setting as cover, unset other cover images
      if (isCover) {
        await connection.query(
          `UPDATE experience_images SET is_cover = 0 WHERE experience_id = ?`,
          [experienceId]
        );
      }
      
      const [result] = await connection.query(
        `INSERT INTO experience_images (experience_id, image_path, is_cover) VALUES (?, ?, ?)`,
        [experienceId, imagePath, isCover]
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
   * Remove experience image
   */
  async removeExperienceImage(imageId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        `DELETE FROM experience_images WHERE id = ?`,
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
   * Set image as cover
   */
  async setExperienceImageAsCover(experienceId, imageId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Reset all cover flags for this experience
      await connection.query(
        `UPDATE experience_images SET is_cover = 0 WHERE experience_id = ?`,
        [experienceId]
      );
      
      // Set the new cover image
      const [result] = await connection.query(
        `UPDATE experience_images SET is_cover = 1 WHERE id = ? AND experience_id = ?`,
        [imageId, experienceId]
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
   * Create a new booking
   */
  async createBooking(bookingData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Generate booking reference
      const bookingReference = `EXP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const [result] = await connection.query(
        `INSERT INTO experience_bookings 
        (experience_id, user_id, booking_reference, full_name, email, phone, 
         number_of_guests, booking_date, total_price, special_requests, status, payment_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bookingData.experience_id,
          bookingData.user_id || null,
          bookingReference,
          bookingData.full_name,
          bookingData.email,
          bookingData.phone,
          bookingData.number_of_guests,
          bookingData.booking_date,
          bookingData.total_price,
          bookingData.special_requests || null,
          'pending',
          'pending'
        ]
      );
      
      await connection.commit();
      return this.getBookingById(result.insertId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Get booking by ID
   */
  async getBookingById(id) {
    const [rows] = await pool.query(
      `SELECT b.*, e.title as experience_title, e.slug as experience_slug 
       FROM experience_bookings b
       LEFT JOIN experiences e ON b.experience_id = e.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(id, status, paymentStatus = null, adminNotes = null) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      let query = `UPDATE experience_bookings SET status = ?`;
      const params = [status];
      
      if (paymentStatus) {
        query += `, payment_status = ?`;
        params.push(paymentStatus);
      }
      
      if (adminNotes) {
        query += `, admin_notes = ?`;
        params.push(adminNotes);
      }
      
      query += ` WHERE id = ?`;
      params.push(id);
      
      const [result] = await connection.query(query, params);
      
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
   * Get all bookings with optional filtering
   */
  async getAllBookings(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      payment_status,
      experience_id,
      user_id,
      search
    } = options;
    
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        b.*,
        e.title as experience_title,
        e.slug as experience_slug
      FROM experience_bookings b
      LEFT JOIN experiences e ON b.experience_id = e.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    
    if (status) {
      query += ` AND b.status = ?`;
      queryParams.push(status);
    }
    
    if (payment_status) {
      query += ` AND b.payment_status = ?`;
      queryParams.push(payment_status);
    }
    
    if (experience_id) {
      query += ` AND b.experience_id = ?`;
      queryParams.push(experience_id);
    }
    
    if (user_id) {
      query += ` AND b.user_id = ?`;
      queryParams.push(user_id);
    }
    
    if (search) {
      query += ` AND (b.booking_reference LIKE ? OR b.full_name LIKE ? OR b.email LIKE ? OR e.title LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    query += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));
    
    const [rows] = await pool.query(query, queryParams);
    
    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM experience_bookings b WHERE 1=1`;
    const countParams = [];
    
    if (status) {
      countQuery += ` AND b.status = ?`;
      countParams.push(status);
    }
    
    if (payment_status) {
      countQuery += ` AND b.payment_status = ?`;
      countParams.push(payment_status);
    }
    
    if (experience_id) {
      countQuery += ` AND b.experience_id = ?`;
      countParams.push(experience_id);
    }
    
    if (user_id) {
      countQuery += ` AND b.user_id = ?`;
      countParams.push(user_id);
    }
    
    if (search) {
      countQuery += ` AND (b.booking_reference LIKE ? OR b.full_name LIKE ? OR b.email LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const [countRows] = await pool.query(countQuery, countParams);
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);
    
    return {
      bookings: rows,
      pagination: {
        total,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    };
  },

  /**
   * Get featured experiences
   */
  async getFeaturedExperiences(limit = 4) {
    const [rows] = await pool.query(
      `SELECT 
        e.*,
        c.name as category_name,
        c.slug as category_slug,
        (SELECT image_path FROM experience_images WHERE experience_id = e.id AND is_cover = 1 LIMIT 1) as cover_image
       FROM experiences e
       JOIN experience_categories c ON e.category_id = c.id
       WHERE e.is_featured = 1 AND e.is_active = 1
       ORDER BY e.created_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  },

  /**
   * Get experiences by category
   */
  async getExperiencesByCategory(categoryId, limit = 4) {
    const [rows] = await pool.query(
      `SELECT 
        e.*,
        c.name as category_name,
        c.slug as category_slug,
        (SELECT image_path FROM experience_images WHERE experience_id = e.id AND is_cover = 1 LIMIT 1) as cover_image
       FROM experiences e
       JOIN experience_categories c ON e.category_id = c.id
       WHERE e.category_id = ? AND e.is_active = 1
       ORDER BY e.created_at DESC
       LIMIT ?`,
      [categoryId, limit]
    );
    return rows;
  },

   /**
   * Get experience sections
   */
   async getExperienceSections(experienceId) {
    const [rows] = await pool.query(
      `SELECT id FROM experience_sections WHERE experience_id = ?`,
      [experienceId]
    );
    return rows;
  },
   /**
   * Update experience section
   */
   async updateExperienceSection(sectionId, title, description, imagePath, order) {
    await pool.query(
      `UPDATE experience_sections SET 
        title = ?, description = ?, image_path = ?, section_order = ?
       WHERE id = ?`,
      [title, description, imagePath, order, sectionId]
    );
  },
  /**
   * Add experience section
   */
  async addExperienceSection(experienceId, title, description, imagePath, order) {
    await pool.query(
      `INSERT INTO experience_sections 
       (experience_id, title, description, image_path, section_order)
       VALUES (?, ?, ?, ?, ?)`,
      [experienceId, title, description, imagePath, order]
    );
  },

  /**
   * Delete experience sections
   */
  async deleteExperienceSections(sectionIds) {
    await pool.query(
      'DELETE FROM experience_sections WHERE id IN (?)',
      [sectionIds]
    );
  },
  
};

module.exports = experienceModel;