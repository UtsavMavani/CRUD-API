const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middleware/auth.js');
const user = require('../controllers/user.js');

// To upload a user image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/userImages');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
      cb(null, true);
    } else{
      cb(null, false);
      return cb(new Error("Only .png, .jpg, and .jpeg File Format Allowed...!"));
    } 
  },

}).single('image');


router.post('/auth/signup', upload, user.signup);
router.post('/auth/login', user.login);
router.post('/auth/changePassword', verifyToken, user.changePassword);
router.get('/allUsers', verifyToken, user.getUsersDetails);
router.get('/profile', verifyToken, user.getProfileDetails);
router.put('/:id', verifyToken, upload, user.updateUserDetails);
router.delete('/:id', verifyToken, user.deleteUserDetails);

module.exports = router;