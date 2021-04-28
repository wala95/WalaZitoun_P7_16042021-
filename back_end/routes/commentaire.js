const express = require('express');
const router = express.Router();

const commentaireCtrl = require('../controllers/commentaire');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');



router.post('/', auth, multer, commentaireCtrl.creatCommentaire);

router.get('/', auth, multer, commentaireCtrl.getCommentaire);


module.exports = router;