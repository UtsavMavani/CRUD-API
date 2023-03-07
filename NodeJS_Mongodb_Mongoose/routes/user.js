const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const authUser = require('../middlewares/auth');
const user = require('../controllers/user');


// Upload user image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
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
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg, and .jpeg file format allowed...!"));
    }
  }

}).single('image');


router.post('/auth/signup', user.signup);
router.post('/auth/login', user.login);
router.put('/auth/changePassword', authUser, user.changePassword);
router.put('/auth/updateProfile', authUser, upload, user.updateProfileDetails)
router.get('/profile', authUser, user.getProfileDetails);

module.exports = router;