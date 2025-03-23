const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('./errorHandler');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'profile-pictures');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename with user ID (if available) and timestamp
    const userId = req.user ? req.user.id : (req.params.id || 'unknown');
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    cb(null, `user-${userId}-${timestamp}${fileExt}`);
  }
});

// Filter file types
const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

module.exports = {
  uploadProfilePicture: upload.single('profile_picture')
};