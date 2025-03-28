const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('./errorHandler');

// Ensure upload directories exist
const profileUploadDir = path.join(__dirname, '..', 'uploads', 'profile-pictures');
const heroUploadDir = path.join(__dirname, '..', 'uploads', 'hero-images');

// Create directories if they don't exist
[profileUploadDir, heroUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for profile pictures
const profileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, profileUploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename with user ID (if available) and timestamp
    const userId = req.user ? req.user.id : (req.params.id || 'unknown');
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    cb(null, `user-${userId}-${timestamp}${fileExt}`);
  }
});

// Configure storage for hero images
const heroStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, heroUploadDir);
  },
  filename: function(req, file, cb) {
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    // Store just the filename, not the full path
    const filename = `hero-slide-${timestamp}${fileExt}`;
    cb(null, filename);
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

// Hero image specific file filter with expanded support
const heroImageFileFilter = (req, file, cb) => {
  // More inclusive filter for hero images
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/webp', 
    'image/gif', 
    'image/avif', 
    'image/tiff'
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new AppError(
      'Invalid file type. Allowed types: JPEG, PNG, WebP, GIF, AVIF, TIFF', 
      400
    ), false);
  }

  cb(null, true);
};

// Create multer upload instances
const profilePictureUpload = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: imageFileFilter
});

const heroImageUpload = multer({
  storage: heroStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: heroImageFileFilter
});

module.exports = {
  // Existing profile picture upload
  uploadProfilePicture: profilePictureUpload.single('profile_picture'),
  
  // New hero image upload
  uploadHeroImage: heroImageUpload.single('hero_image')
};