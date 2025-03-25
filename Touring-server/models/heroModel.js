const { pool } = require('../config/db');

const heroModel = {
  /**
   * Get all hero slides (max 6 active ones)
   * @returns {Promise<Array>} Array of hero slides
   */
  async getAll() {
    const [rows] = await pool.query(
      `SELECT * FROM hero_slides 
       WHERE is_active = TRUE 
       ORDER BY display_order ASC, created_at DESC 
       LIMIT 6`
    );
    return rows;
  },

  /**
   * Get hero slide by ID
   * @param {number} id - Slide ID
   * @returns {Promise<Object|null>} Slide object or null if not found
   */
  async getById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM hero_slides WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Create a new hero slide
   * @param {Object} slideData - Slide data
   * @returns {Promise<Object>} Newly created slide
   */
  async create(slideData) {
    const [result] = await pool.query(
      `INSERT INTO hero_slides 
       (title, description, image_path, is_active, display_order) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        slideData.title,
        slideData.description,
        slideData.image_path,
        slideData.is_active !== undefined ? slideData.is_active : true,
        slideData.display_order || 0
      ]
    );
    return this.getById(result.insertId);
  },

  /**
   * Update a hero slide
   * @param {number} id - Slide ID
   * @param {Object} slideData - Slide data to update
   * @returns {Promise<Object|null>} Updated slide or null if not found
   */
  async update(id, slideData) {
    const allowedFields = ['title', 'description', 'image_path', 'is_active', 'display_order'];
    const updateFields = [];
    const updateValues = [];

    for (const field of allowedFields) {
      if (slideData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(slideData[field]);
      }
    }

    if (updateFields.length === 0) {
      return this.getById(id);
    }

    updateValues.push(id);

    const [result] = await pool.query(
      `UPDATE hero_slides SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.getById(id);
  },

  /**
   * Delete a hero slide
   * @param {number} id - Slide ID
   * @returns {Promise<boolean>} True if deletion was successful
   */
  async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM hero_slides WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Count active hero slides
   * @returns {Promise<number>} Number of active slides
   */
  async countActive() {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM hero_slides WHERE is_active = TRUE`
    );
    return rows[0].count;
  }
};

module.exports = heroModel;