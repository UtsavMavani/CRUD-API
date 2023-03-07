const Boom = require('@hapi/boom');
const { message } = require('../utils/message');
const BookModel = require("../models/book");

// Add book
const addBook = async (req, res, next) => {
  try{
    // const { userId } = req.user;
    const data = req.body;
    // data.userId = userId;

    const book = await BookModel.create(data);

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
  try{
    let page = req.query.page || 1;
    let limit = req.query.limit || 5;
    let offset = 0;
    offset = limit * (page - 1);

    const books = await BookModel.find().limit(limit).skip(offset);
    if (!books.length) {
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Books found successfully',
      data: books
    })

  } catch (error) {
    return next(Boom.badImplementation());
  }
}

// Get single book
const getBookDetails = async (req, res, next) => {
  try{
    const { id } = req.params;

    const book = await BookModel.findById(id);
    if (!book) {
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
  try{
    const { id } = req.params;
    const data = req.body;

    let book = await BookModel.findById(id);
    if (!book) {
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    book = await BookModel.findByIdAndUpdate(id, data, { 
      new: true, 
      runValidators: true, 
      useFindAndModify: false 
    });

    res.status(200).send({ 
      statusCode: 200, 
      message: 'Book updated successfully', 
      data: book,
    });

  } catch (error) {
    return next(Boom.badImplementation());
  }
}

// Delete Book
const deleteBookDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    let book = await BookModel.findById(id);
    if (!book) {
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    }

    book = await BookModel.findByIdAndDelete(id); 

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