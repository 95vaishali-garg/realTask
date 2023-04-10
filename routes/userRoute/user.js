const express = require('express');
const router = express.Router();
const usercontroller = require('../../controller/userController.js');

//get all users
router.get('/', usercontroller.getUsersList);

router.post('/register', usercontroller.userRegister);

router.post('/login', usercontroller.userLogin);
router.post('/logout', usercontroller.userLogout);


router.get('/profile', usercontroller.getUserProfileById);

router.post('/updateSocketStatus', usercontroller.updateSocketStatus);

//user everything
// router.get('/everything', usercontroller.userEverything);

module.exports = router;