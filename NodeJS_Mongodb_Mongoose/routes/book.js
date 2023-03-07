const router = require("express").Router();
const authUser = require('../middlewares/auth');
const book = require("../controllers/book");

router.post('/book/new', authUser, book.addBook);
router.get('/books', authUser, book.getBooksDetails);
router.get('/book/:id', authUser, book.getBookDetails);
router.put('/book/:id', authUser, book.updateBookDetails);
router.delete('/book/:id', authUser, book.deleteBookDetails);

module.exports = router;