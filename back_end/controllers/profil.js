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

exports.modifyProfil = (req, res) => {
  let user =  null;
  if(req.file){
user = {
    ...req.body,
    img: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
}}
  else{ 
    user = {
    ...req.body 
  }}
  User.update(user, {
    where: {
      id: req.params.id
    }
  }).then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
  .catch(error => res.status(400).json({ error }));
};


exports.deleteProfil = (req, res) => {
  User.findOne({where:{
    id: req.params.id
  }})
    .then(user => {
      const filename = user.img.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        User.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(() => res.status(200).json({ message: 'Utilisateur supprimé!' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

