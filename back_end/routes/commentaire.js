const express = require('express');
const router = express.Router();

const commentaireCtrl = require('../controllers/commentaire');
const auth = require('../middleware/auth');


router.post('/', auth, commentaireCtrl.creatCommentaire);

router.delete('/:id', auth, commentaireCtrl.deleteCommentaire);


module.exports = router;