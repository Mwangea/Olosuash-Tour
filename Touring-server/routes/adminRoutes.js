const express = require('express');
const adminController = require('../controllers/adminController');
const { validateSignUp } = require('../middleware/validation');




const router = express.Router();


//create admin route
router.post('/create', validateSignUp, adminController.createAdmin);

module.exports = router;