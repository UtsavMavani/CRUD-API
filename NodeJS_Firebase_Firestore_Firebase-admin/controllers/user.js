const Boom = require('@hapi/boom');
const { message } = require('../utils/message');  
const bcrypt = require('bcrypt');
const ref = require('../database/config');

// Signup user
const signup = async (req, res, next) => {
  try {
    const { name, email, password, interest } = req.body;

    const user = await ref.where("email", "==", email).get();
    if (!user.empty) {
      return next(Boom.notFound(message.RECORD_ALREADY_EXIST));
    }

    const hashPassword = password ? await bcrypt.hash(password, 10) : password;

    const userData = {
      name,
      email: email.toLowerCase(),
      password: hashPassword,
      interest,
      active: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    await ref.add(userData);

    res.status(201).json({
      statusCode: 201,
      message: 'User created successfully',
      data: user
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
};

// Get all users
const getUsersDetails = async (req, res, next) => {
  try {
    const users = await ref.get();
    const usersList = users.docs.map((doc) => doc.data());
    if (!usersList.length) {
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Users found successfully',
      data: usersList
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
};

// Get single user
const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await ref.doc(id).get();
    if (!user.exists) {
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    res.status(200).json({
      statusCode: 200,
      message: 'User details found successfully',
      data: user.data()
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
};

// Update user
const updateUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const user = await ref.doc(id).get();
    if (!user.exists) {
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    if (data.password) {
      const hashPassword = await bcrypt.hash(data.password, 10);
      data.password = hashPassword;
    }

    await ref.doc(id).update(data);

    res.status(200).send({ 
      statusCode: 200, 
      message: 'User updated successfully', 
      data: user.data(),
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
};

// Delete user
const deleteUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await ref.doc(id).get();
    if (!user.exists) {
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    await ref.doc(id).delete();

    res.status(200).send({ 
      statusCode: 200, 
      message: 'User deleted successfully',
      data: user.data()
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
};

module.exports = {
  signup,
  getUsersDetails,
  getUserDetails,
  updateUserDetails,
  deleteUserDetails,
};