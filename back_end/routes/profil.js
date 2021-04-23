const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/profil');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');




router.get('/:id', auth, sauceCtrl.getProfil);

router.put('/:id', auth, multer, sauceCtrl.modifyProfil);

router.delete('/:id', auth, sauceCtrl.deleteProfil);


module.exports = router;