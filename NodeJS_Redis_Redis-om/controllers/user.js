const Boom = require('@hapi/boom');
const { message } = require('../utils/message');
const userRepository = require('../models/user');

// Signup user
const signup = async (req, res, next) => {
  try {
    const { name, email, password, interest } = req.body;

    const userData = {
      name,
      email,
      password,
      interest,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date() 
    }

    const user = await userRepository.createAndSave(userData);

    res.status(201).json({
      statusCode: 201,
      message: 'User created successfully',
      data: user
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
};

// Get all user
const getUsersDetails = async (req, res, next) => {
  try {
    await userRepository.createIndex();

    const users = await userRepository.search().returnAll();
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

// Get single user
const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userRepository.fetch(id);
    if(!user.email){
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    res.status(200).json({
      statusCode: 200,
      message: 'User details found successfully',
      data: user
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
}

// Update user 
const updateUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, interest, active } = req.body;

    const user = await userRepository.fetch(id);
    if(!user.email){
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }
    
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.password = password ? password : user.password;
    user.interest = interest ? interest : user.interest;
    user.active = (active === false) ? false : true;
    user.updatedAt = new Date();

    await userRepository.save(user);

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
const deleteUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userRepository.fetch(id);
    if(!user.email){
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    await userRepository.remove(id);

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
  getUsersDetails,
  getUserDetails,
  updateUserDetails,
  deleteUserDetails,
};