const db = require('../models/index.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const Boom = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const { message } = require('../utils/message');
const User = db.users;
const Book = db.books;

// Common function for delete user image 
const imageDir = path.join(__dirname, '../public/userImages/');
const deleteUserImage = (name) => {
  fs.unlinkSync(imageDir + name);
}

// Signup user
const signup = async(req, res, next) => {
  try {
    // Get user input
    const data = req.body;

    // check if user already exist
    const userExist = await User.findOne({
      where: { email: data.email }
    });

    if(userExist){
      return next(Boom.badRequest(message.RECORD_ALREADY_EXIST));
    }

    // Joi validation schema
    const userSchema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().lowercase().required(),
      password: Joi.string().required(),
      gender: Joi.string().valid('male', 'female').required(),
      interest: Joi.array().items()
    });

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(data.password, 10);

    // For store user image
    let image = '';
    image = req.file ? req.file.filename : null;

    // Validate the user data
    const { error } = userSchema.validate(data);
    if (error) {
      return next(Boom.badData(error.message));
    }

    const user = await User.create({
      name: data.name, 
      email: data.email, 
      password: encryptedPassword, 
      gender: data.gender, 
      interest: data.interest, 
      image: image
    });
    
    res.status(201).json({
      statusCode: 201,
      message: 'User created successfully',
      data: user
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
}

// Login user
const login = async (req, res, next) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
      return next(Boom.badRequest(message.EMAIL_PASSWORD_REQUIRED));
    }

    // Validate if user exist in our database
    const user = await User.findOne({
      where: { email }
    });

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      return next(Boom.unauthorized(message.INVALID_CREDENTIALS));
    }

    // Create jwt token
    const token = jwt.sign(
      { userId: user.id, userEmail: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      statusCode: 200,
      message: "User logged in successfully", 
      token: token
    });    

  } catch (error) {
    return next(Boom.badImplementation());
  }
}

// Change user password
const changePassword = async (req, res, next) => {
  try {
    // Get user input
    const { oldPass, newPass, conPass} = req.body;
    const { id } = req.user;

    // Validate user input
    if (!(oldPass && newPass && conPass)) {
      return next(Boom.badRequest(message.OLD_NEW_CONF_PASSWORD_REQUIRED));
    }
    
    // Find the user data
    const user = await User.findOne({
      where : { id }
    });

    // Compare the db password to the user input old password
    const result = await bcrypt.compare(oldPass, user.password);
    
    // Set a new password
    if(result){
      if(!(newPass === conPass)){
        return next(Boom.unauthorized(message.NEW_CONF_PASSWORD_NOT_MATCH));
      }

      const encryptedNewPassword = await bcrypt.hash(newPass, 10);

      await User.update({
        password: encryptedNewPassword, 
      }, { 
        where: { id } 
      });

      res.status(200).send({ 
        statusCode: 200,
        message: "Password changed successfully" 
      });

    } else {
      return next(Boom.forbidden(message.OLD_PASSWORD_NOT_MATCH));
    }

  } catch (error) {
    return next(Boom.badImplementation());
  }
}

// Get all users
const getUsersDetails = async(req, res, next) => {
  try {
    // Find all books which is added by perticular user using foreign key (user => books)
    // const users = await User.findAll({
    //   include: {
    //     model: Book
    //   },
    //   where: { id: 2},
    //   attributes: {
    //     exclude: ['password']
    //   }
    // });

    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    });

    if(!users.length){
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Users found successfully',
      data: users
    });
  } catch (error) {
    return next(Boom.badImplementation());
  }
}

// Get user profile
const getProfileDetails = async(req, res, next) => {
  try {
    const { id } = req.user;

    const userProfile = await User.findOne({
      where: { id },
      attributes: {
        exclude: ['password']
      }
    });

    if(!userProfile){
      return next(Boom.notFound('User profile not found'));
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

// Update user
const updateUserDetails = async(req, res, next) => {
  try {
    // Get user id
    const { id } = req.params;

    // Get user input
    const { name, email, password, gender, interest } = req.body;

    // Get detilas from database
    const user = await User.findOne({
      where: { id } 
    });

    // check if user exist or not
    if(!user){
      deleteUserImage(user.image);
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    // Update user image
    let image = user.image ;
    if(req.file){
      image = (image == null) ? req.file.filename : deleteUserImage(user.image);
    }

    // Encrypt user password
    const encryptedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    // Update user in our database
    await User.update({
      id,
      name, 
      email: email ? email.toLowerCase() : user.email, 
      password: encryptedPassword, 
      gender, 
      interest,
      image,
      createdAt: user.createdAt,
      updatedAt: new Date()
    }, { 
      where: { id } 
    });

    res.status(200).send({ 
      statusCode: 200, 
      message: 'User updated successfully', 
      data: user,
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
}


// Delete user
const deleteUserDetails = async(req, res, next) => {
  try {
    let { id } = req.params;

    const user = await User.findOne({ where: { id } });
    if(!user){
      return res.status(404).send("User does not exist !");
    } 

    deleteUserImage(user.image);

    await User.destroy({ where: { id } });

    res.status(200).send({ 
      statusCode: 200, 
      message: 'User deleted successfully',
      data: user 
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
}


module.exports = {
  signup,
  login,
  changePassword,
  getUsersDetails,
  getProfileDetails,
  updateUserDetails,
  deleteUserDetails
};