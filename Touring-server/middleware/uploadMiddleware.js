const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('./errorHandler');

// Ensure upload directories exist
const experienceUploadDir = path.join(__dirname, '..', 'uploads', 'experience-images');
const categoryUploadDir = path.join(__dirname, '..', 'uploads', 'category-images');

// Create directories if they don't exist
[experienceUploadDir, categoryUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for experience images
const experienceStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, experienceUploadDir);
  },
  filename: function(req, file, cb) {
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    cb(null, `exp-${timestamp}${fileExt}`);
  }
});

// Configure storage for category images
const categoryStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, categoryUploadDir);
  },
  filename: function(req, file, cb) {
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    cb(null, `cat-${timestamp}${fileExt}`);
  }
});

// Common file filter for images
const imageFileFilter = (req, file, cb) => {
  // Accept image files only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400), false);
  }
};

// Create multer upload instances
const experienceUpload = multer({
  storage: experienceStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: imageFileFilter
});

const categoryUpload = multer({
  storage: categoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: imageFileFilter
});

module.exports = {
  // For uploading multiple experience images
  array: experienceUpload.array.bind(experienceUpload),
  
  // For uploading single experience image
  single: experienceUpload.single.bind(experienceUpload),
  
  // For uploading category image
  categoryUpload: categoryUpload.single('image')
};