const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const { isAuthenticated, restrictTo } = require('../middleware/auth');

// Public routes
router.get('/', heroController.getAllHeroSlides);
router.get('/:id', heroController.getHeroSlide);

// Protected admin routes
router.use(isAuthenticated, restrictTo('admin'));

router.post(
  '/',
  heroController.uploadHeroImage,
  heroController.createHeroSlide
);

router.patch(
  '/:id',
  heroController.uploadHeroImage,
  heroController.updateHeroSlide
);

router.delete('/:id', heroController.deleteHeroSlide);

module.exports = router;