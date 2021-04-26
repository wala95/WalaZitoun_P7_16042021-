const express = require('express');
const router = express.Router();

const publicationCtrl = require('../controllers/publication');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');



router.post('/', auth, multer, publicationCtrl.creatPublication);


module.exports = router;