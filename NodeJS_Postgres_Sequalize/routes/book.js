const router = require('express').Router();
const verifyToken = require('../middleware/auth.js');
const book = require('../controllers/book.js');


router.post('/book', verifyToken, book.addBook);
router.get('/books', verifyToken, book.getBooksDetails);
router.get('/books/:id', verifyToken, book.getBookDetails);
router.put('/books/:id', verifyToken, book.updateBookDetails);
router.delete('/books/:id', verifyToken, book.deleteBookDetails);

module.exports = router;