const models = require('../models');
const User = models.User
const fs = require('fs'); 



exports.getProfil = (req, res, next) => {
  User.findOne({where:{
    id: req.params.id
  }}).then(
    (user) => {
      res.status(200).json(user);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyProfil = (req, res, next) => {
  const imgProfil = req.file ?
    {
      ...JSON.parse(req.body.user),
      img: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  User.save({ id: req.params.id }, { ...imgProfil, id: req.params.id })
    .then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
    .catch(error => res.status(400).json({ error }));
};


exports.deleteProfil = (req, res, next) => {
  User.findOne({ id: req.params.id })
    .then(user => {
      const filename = user.img.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        profil.destroy({ id: req.params.id })
          .then(() => res.status(200).json({ message: 'Utilisateur supprimé!' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

