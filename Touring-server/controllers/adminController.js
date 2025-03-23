const { AppError } = require("../middleware/errorHandler");
const userModel = require("../models/userModel");
const authService = require('../services/authService');



/**
 * @desc    Create admin account
 * @route   POST /api/admin/create
 * @access  Public (but protected by secret key)
 */


const createAdmin = async (req,res,next) => {
    try{
        const { username, email, password, secretKey } = req.body;

        //check if admin already exists
        if(await userModel.adminExists()) {
            return next(new AppError('Admin account already exists', 400));
        }

        //create admin
        const admin = await userModel.createAdmin(
            { username, email, password },
            secretKey
        );

        //Generate token
        const token = authService.createToken(admin.id);

        res.status(201).json({
            status:'success',
            message: 'Admin account created successfully',
            data:{
                user:{
                    id:admin.id,
                    username:admin.username,
                    email:admin.email,
                    role:admin.role
                },
                token
            }
        });
    } catch (error) {
        if (error.message === "Invalid admin secret key") {
            return next(new AppError("Invalid admin secret key", 401));
        }
        next(error);
    }
};

module.exports = {
    createAdmin
};