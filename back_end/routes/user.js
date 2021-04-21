const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');


const userCtrl = require('../controllers/user');// associer les fonction aux differentes routes

router.post('/signup', multer, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;