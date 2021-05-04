const bcrypt = require('bcrypt'); 
const models = require('../models');
const User = models.User
const fs = require('fs');
const { assert } = require('console');



exports.getProfil = (req, res, next) => {
  User.findOne({
    where: {
      id: res.locals.userId
    }
  }).then(
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
  let user = null;
  if (req.file) {
    user = {
      ...req.body,
      img: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
  }
  else {
    user = {
      ...req.body
    }
  }
  User.update(user, {
    where: {
      id: res.locals.userId
    }
  }).then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
    .catch(error => {
      console.log(error);
      res.status(400).json({ error : error })});
    
};


exports.deleteProfil = (req, res) => {
  User.findOne({
      where: {
        id: res.locals.userId
      }
    })
    .then(user => {
      if (!user) { // si user non trouvé
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.pw, user.pw) //  comparer le MDP avec ceux enregistré dans BD
        .then(valid => {
          if (!valid) {// si mauvais MDP
            return res.status(401).json({ message: 'Mot de passe incorrect !' });
          } else {
            const filename = user.img.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
              User.destroy({
                where: {
                  id: res.locals.userId
                }
              }).then(() => res.status(200).json({ message: 'Utilisateur supprimé!' }))
                .catch(error => res.status(400).json({"error": error }));
            })
          }
        }).catch(error => res.status(500).json({ "error": error }));
    })
    .catch(error => {
      res.status(300).json({ "error": error });
   });
};

