const fs = require('fs').promises;
const path = require('path');
const heroModel = require('../models/heroModel');
const { AppError } = require('../middleware/errorHandler');
const { uploadHeroImage } = require('../middleware/multer');

// Use the pre-configured uploadHeroImage middleware
exports.uploadHeroImage = uploadHeroImage;

exports.getAllHeroSlides = async (req, res, next) => {
  try {
    const slides = await heroModel.getAll();
    res.status(200).json({
      status: 'success',
      data: {
        slides
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getHeroSlide = async (req, res, next) => {
  try {
    const slide = await heroModel.getById(req.params.id);
    if (!slide) {
      return next(new AppError('Hero slide not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        slide
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createHeroSlide = async (req, res, next) => {
  try {
    // Check if we already have 6 active slides
    const activeCount = await heroModel.countActive();
    if (activeCount >= 6) {
      // If a file was uploaded, delete it before returning error
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      return next(new AppError('Maximum of 6 active hero slides allowed', 400));
    }

    if (!req.file) {
      return next(new AppError('Please upload an image', 400));
    }

    const slideData = {
      title: req.body.title,
      description: req.body.description,
      image_path: req.file.path,
      is_active: req.body.is_active !== 'false', // default to true
      display_order: req.body.display_order || 0
    };

    const newSlide = await heroModel.create(slideData);
    
    res.status(201).json({
      status: 'success',
      data: {
        slide: newSlide
      }
    });
  } catch (error) {
    // If a file was uploaded, delete it in case of error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

exports.updateHeroSlide = async (req, res, next) => {
  try {
    const slide = await heroModel.getById(req.params.id);
    if (!slide) {
      // Delete uploaded file if slide not found
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      return next(new AppError('Hero slide not found', 404));
    }

    const updateData = {
      title: req.body.title || slide.title,
      description: req.body.description || slide.description,
      is_active: req.body.is_active !== undefined 
        ? req.body.is_active !== 'false' 
        : slide.is_active,
      display_order: req.body.display_order || slide.display_order
    };

    // If new image is uploaded
    if (req.file) {
      updateData.image_path = req.file.path;
      
      // Delete old image file
      if (slide.image_path) {
        await fs.unlink(slide.image_path).catch(() => {});
      }
    }

    const updatedSlide = await heroModel.update(req.params.id, updateData);
    
    res.status(200).json({
      status: 'success',
      data: {
        slide: updatedSlide
      }
    });
  } catch (error) {
    // Delete uploaded file in case of error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

exports.deleteHeroSlide = async (req, res, next) => {
  try {
    const slide = await heroModel.getById(req.params.id);
    if (!slide) {
      return next(new AppError('Hero slide not found', 404));
    }

    const deleted = await heroModel.delete(req.params.id);
    if (!deleted) {
      return next(new AppError('Failed to delete hero slide', 500));
    }

    // Delete the associated image file
    if (slide.image_path) {
      await fs.unlink(slide.image_path).catch(() => {});
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};