const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Boom = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const { message } = require('../utils/message');
const UserModel = require("../models/user");

// Function for delete user image 
const imageDir = path.join(__dirname, '../public/images/');
const deleteUserImage = (name) => {
  fs.unlinkSync(imageDir + name);
}

// Signup user
const signup = async(req, res, next) => {
  try {
    const data = req.body;

    // Find old user
    const userExist = await UserModel.findOne({ email: data.email });
    if (userExist) {
      return next(Boom.badRequest(message.RECORD_ALREADY_EXIST));
    }

    // Check password length > 8 or not
    if(data.password.length < 8) {
      return next(Boom.badData("Password must be at least 8 characters long"));
    }

    // Store hash password
    const hashPassword = await bcrypt.hash(data.password, 10);
    data.password = hashPassword;

    // Store hole user
    const newUser = new UserModel(data);
    const user = await newUser.save();

    // Generate token
    const token = jwt.sign(
      { user: { id: user._id, email: user.email } },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      statusCode: 201,
      message: 'User created successfully',
      data: { user, token }
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check email & password required
    if(!email || !password){
      return next(Boom.badRequest(message.EMAIL_PASSWORD_REQUIRED));
    }

    // Find the user is exist or not
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(Boom.badRequest(message.RECORD_NOT_FOUND));
    }

    // Compare db password & user password 
    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (isMatchPassword) {
      // Generate token
      const token = jwt.sign(
        { user: { id: user._id, email: user.email } },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        statusCode: 200,
        message: "User logged in successfully", 
        token: { user, token }
      });    
    }

    return next(Boom.unauthorized(message.INVALID_CREDENTIALS));

  } catch (error) {
    return next(Boom.badImplementation());
  }
};

// Change user password   
const changePassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword, conPassword } = req.body;

    if(!oldPassword || !newPassword || !conPassword){
      return next(Boom.badRequest(message.OLD_NEW_CONF_PASSWORD_REQUIRED));
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return next(Boom.badRequest(message.RECORD_NOT_FOUND));
    }

    if(newPassword.length < 8) {
      return next(Boom.badData("Password must be at least 8 characters long"));
    }

    const isMatchPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isMatchPassword) {
      return next(Boom.forbidden(message.OLD_PASSWORD_NOT_MATCH));
    }

    if (newPassword !== conPassword) {
      return next(Boom.unauthorized(message.NEW_CONF_PASSWORD_NOT_MATCH));
    }

    const hashPassword = await bcrypt.hash(data.newPassword, 10);
    user.password = hashPassword;

    await user.save();

    res.status(200).send({ 
      statusCode: 200,
      message: "Password changed successfully" 
    });

  } catch (error) {
      return next(Boom.forbidden(message.OLD_PASSWORD_NOT_MATCH));
  }
}

// Update user profile   
const updateProfileDetails = async (req, res, next) => {
  try {
    const { id } = req.user;
    const data = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return next(Boom.unauthorized("User not logged in"));
    }

    // Update user image
    if(req.file && user.image){
      deleteUserImage(user.image);
    }
    data.image = req.file ? req.file.filename : user.image;

    const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    }).select("-password");

    res.status(200).json({ 
      statusCode: 200,
      message: 'Profile updated successfully',
      data: updatedUser 
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
}

// Get user profile
const getProfileDetails = async (req, res, next) => {
  try {
    const { id } = req.user;

    const userProfile = await UserModel.findById(id).select("-password");
    if (!user) {
      return next(Boom.unauthorized("User not logged in"));
    }

    res.status(200).json({ 
      statusCode: 200,
      message: 'User profile found successfully',
      data: userProfile 
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
}


module.exports = {
  signup,
  login,
  changePassword,
  updateProfileDetails,
  getProfileDetails,
};