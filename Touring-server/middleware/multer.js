const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { AppError } = require("./errorHandler");

// Define all upload directories
const uploadDirs = {
  experience: path.join(__dirname, "..", "uploads", "experience-images"),
  category: path.join(__dirname, "..", "uploads", "category-images"),
  profile: path.join(__dirname, "..", "uploads", "profile-pictures"),
  hero: path.join(__dirname, "..", "uploads", "hero-images"),
};

// Create directories if they don't exist
Object.values(uploadDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for different types
const storageConfigs = {
  experience: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirs.experience);
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const fileExt = path.extname(file.originalname);
      cb(null, `exp-${timestamp}${fileExt}`);
    },
  }),

  category: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirs.category);
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const fileExt = path.extname(file.originalname);
      cb(null, `cat-${timestamp}${fileExt}`);
    },
  }),

  profile: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirs.profile);
    },
    filename: function (req, file, cb) {
      const userId = req.user ? req.user.id : req.params.id || "unknown";
      const timestamp = Date.now();
      const fileExt = path.extname(file.originalname);
      cb(null, `user-${userId}-${timestamp}${fileExt}`);
    },
  }),

  hero: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirs.hero);
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const fileExt = path.extname(file.originalname);
      cb(null, `hero-slide-${timestamp}${fileExt}`);
    },
  }),
};

// File filters
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError("Only image files are allowed!", 400), false);
  }
};

const heroImageFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "image/tiff",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new AppError(
        "Invalid file type. Allowed types: JPEG, PNG, WebP, GIF, AVIF, TIFF",
        400
      ),
      false
    );
  }
  cb(null, true);
};

// Create multer upload instances
const uploaders = {
  experience: multer({
    storage: storageConfigs.experience,
    limits: { fileSize: 10 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter,
  }),

  category: multer({
    storage: storageConfigs.category,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter,
  }),

  profile: multer({
    storage: storageConfigs.profile,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter,
  }),

  hero: multer({
    storage: storageConfigs.hero,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: heroImageFileFilter,
  }),
};

// Export all upload middlewares
module.exports = {
  // Experience uploads
  uploadExperienceArray: (fields) => uploaders.experience.fields(fields),
  uploadExperienceSingle: uploaders.experience.single.bind(uploaders.experience),

  // Category upload
  uploadCategory: uploaders.category.single("image"),

  // Profile upload
  uploadProfilePicture: uploaders.profile.single("profile_picture"),

  // Hero image upload
  uploadHeroImage: uploaders.hero.single("hero_image"),
};
