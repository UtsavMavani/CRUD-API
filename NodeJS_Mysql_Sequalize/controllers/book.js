const db = require('../models/index.js');
const Boom = require('@hapi/boom');
const Joi = require('joi');
const { message } = require('../utils/message');
const Book = db.books;

// Add book
const addBook = async (req, res, next) => {
  try {
    // Get user input
    const data = req.body;

    // Joi validation schema
    const bookSchema = Joi.object().keys({
      userId: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      noOfPage: Joi.number().required(),
      author: Joi.string().required(),
      category: Joi.string().required(),
      price: Joi.number().required(),
      releasedYear: Joi.number().required(),
      status: Joi.boolean().required()
    });

    // Validate the user data
    const { error } = bookSchema.validate(data);
    if (error) {
      return next(Boom.badData(error.message));
    }

    const book = await Book.create(data);

    res.status(201).json({
      statusCode: 201,
      message: 'Book added successfully',
      data: book
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
}

// Get all books
const getBooksDetails = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    let offset = 0;
    offset = limit * (page - 1);

    const books = await Book.findAll({ limit, offset });

    if(!books.length){
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Books found successfully',
      data: books
    });
    
  } catch (error) {
    return next(Boom.badImplementation());
  }
}

// Get single book
const getBookDetails = async (req, res, next) => {
  try {
    let { id } = req.params;

    let book = await Book.findOne({ where: { id } });
    if(!book){
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Book details found successfully',
      data: book
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
}

// Update book
const updateBookDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Get detilas from database
    const book = await Book.findOne({ where: { id } });
    if (!book) {
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    await Book.update(data, { where: { id } });

    res.status(200).send({ 
      statusCode: 200, 
      message: 'Book updated successfully', 
      data: book,
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
}

// Delete product
const deleteBookDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get detilas from database
    const book = await Book.findOne({ where: { id } });
    if (!book) {
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    await Book.destroy({ where: { id } });

    res.status(200).send({ 
      statusCode: 200, 
      message: 'Book deleted successfully',
      data: book 
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
}


module.exports = {
  addBook,
  getBooksDetails,
  getBookDetails,
  updateBookDetails,
  deleteBookDetails,
};