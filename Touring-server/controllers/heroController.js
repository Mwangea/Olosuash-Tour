const fs = require('fs').promises;
const path = require('path');
const heroModel = require('../models/heroModel');
const { AppError } = require('../middleware/errorHandler');
const { uploadHeroImage } = require('../middleware/multer');

// Directory for hero images
const heroImagesDir = path.join(__dirname, '..', 'uploads', 'hero-images');

// Ensure upload directory exists
const ensureUploadDirExists = async () => {
  try {
    await fs.mkdir(heroImagesDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create hero images directory', error);
  }
};

// Generate full image URL
const generateImageUrl = (imagePath) => {
  return `/uploads/hero-images/${imagePath}`;
};

exports.uploadHeroImage = uploadHeroImage;

exports.getAllHeroSlides = async (req, res, next) => {
  try {
    await ensureUploadDirExists();
    const slides = await heroModel.getAll();
    
    const processedSlides = slides.map(slide => ({
      ...slide,
      image_path: generateImageUrl(slide.image_path)
    }));

    res.status(200).json({
      status: 'success',
      data: {
        slides: processedSlides
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

    const responseSlide = {
      ...slide,
      image_path: generateImageUrl(slide.image_path)
    };

    res.status(200).json({
      status: 'success',
      data: {
        slide: responseSlide
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createHeroSlide = async (req, res, next) => {
  try {
    await ensureUploadDirExists();
    
    if (!req.file) {
      return next(new AppError('Please upload an image', 400));
    }

    const slideData = {
      title: req.body.title,
      description: req.body.description,
      image_path: req.file.filename,
      is_active: req.body.is_active !== 'false',
      display_order: req.body.display_order || 0
    };

    const newSlide = await heroModel.create(slideData);
    
    const responseSlide = {
      ...newSlide,
      image_path: generateImageUrl(newSlide.image_path)
    };

    res.status(201).json({
      status: 'success',
      data: {
        slide: responseSlide
      }
    });
  } catch (error) {
    // Delete uploaded file if there's an error
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
};

exports.updateHeroSlide = async (req, res, next) => {
  try {
    await ensureUploadDirExists();
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

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (slide.image_path) {
        const oldImagePath = path.join(heroImagesDir, slide.image_path);
        await fs.unlink(oldImagePath).catch(err => {
          console.warn('Failed to delete old image:', err);
        });
      }

      // Update with new image
      updateData.image_path = req.file.filename;
    }

    const updatedSlide = await heroModel.update(req.params.id, updateData);
    
    const responseSlide = {
      ...updatedSlide,
      image_path: generateImageUrl(updatedSlide.image_path)
    };

    res.status(200).json({
      status: 'success',
      data: {
        slide: responseSlide
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

    // Delete the image file
    if (slide.image_path) {
      const imagePath = path.join(heroImagesDir, slide.image_path);
      await fs.unlink(imagePath).catch(err => {
        console.warn('Failed to delete image file:', err);
      });
    }

    // Delete from database
    const deleted = await heroModel.delete(req.params.id);
    if (!deleted) {
      return next(new AppError('Failed to delete hero slide', 500));
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};