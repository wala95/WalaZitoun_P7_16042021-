const bcrypt = require('bcrypt'); //crypter le mot de passe
const jwt = require('jsonwebtoken');//vérifier les tokens d'authentification
const models = require('../models');
const User = models.User

const emailRegEx = /\w+@\w+\.\w{2,10}/;
const passwordRegEx = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
const textRegEex = new RegExp("[a-zA-Z]{2,}");

exports.signup = (req, res) => {// création des nouveaux users
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let pw = req.body.pw;
  let img = `${req.protocol}://${req.get('host')}/images/no_photo_profil.png`;
  if (req.file) {
    img = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }
  let bio=  req.body.bio;

  console.log(firstname, lastname, email, pw, img, bio);
 
 if (!(emailRegEx.test(email) && passwordRegEx.test(pw) && textRegEex.test(firstname) && textRegEex.test(lastname)))  {
    return res.status(400).json({ message: "email or password not valid" });
  } else {
  User.findOne({
    attributes :['email'],
    where: {email: email}
  })
  .then(function(userFound){
    if (!userFound) {
      bcrypt.hash(pw, 10)//hacher(crypter) le mot de passe(fonction asynchrone)
      .then(hash => {//créer un nouveau user avec le mot de passe crypté
        const user = User.create({
          firstname : firstname,
          lastname : lastname,
          email:email,
          pw: hash,
          img :img,
          bio :  bio,
        })// enregistrer le nouveau user dans la BDD
          .then(() => res.status(201).json({ message: 'User addd!' }))
          .catch(error => {
            return res.status(400).json({ error: 'cannot add user'})
          });
      });
    }else {
      return res.status(409).json({ 'error': "user already exist" });
    }
  })
  };
};

exports.login = (req, res, next) => { // permettre au utilisateur de se connecter
  //TODO add control email and password not empty

  User.findOne({where: { email: req.body.email }})// trouver l'utilisateur
    .then(user => { 
// vérifier si on a trouvé un user ou non
      if (!user) { // si user non trouvé
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.pw, user.pw) // user trouvé : comparer le MDP avec ceux enregistré dans BD
        .then(valid => {
          if (!valid) {// si mauvais MDP
            return res.status(401).json({ message: 'Mot de passe incorrect !' });
          }
          res.status(200).json({ //bon MDP et renvoyer un objet JSON
            userId: user.id,
            token: jwt.sign(
              { userId: user.id, 
                admin: user.admin 
              },// identifiant utilisateur
              process.env.SECRET_JWT,// clée secrete pour l'encoudage
              { expiresIn: '24h' }// duréé de token
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));// un problème de connexion lié à mongooDB
};