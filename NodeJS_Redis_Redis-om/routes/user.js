const router = require('express').Router();
const user = require('../controllers/user');

router.post('/addUser', user.signup);
router.get('/getAllUser', user.getUsersDetails);
router.get('/getSingleUser/:id', user.getUserDetails);
router.put('/updateUser/:id', user.updateUserDetails);
router.delete('/deleteUser/:id', user.deleteUserDetails);

module.exports = router;