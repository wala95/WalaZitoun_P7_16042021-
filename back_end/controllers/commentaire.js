const models = require('../models');
const Commentaire = models.Commentaire;


exports.creatCommentaire = (req, res) => {// création des nouvelles publications
  let utilisateur_id = req.body.utilisateur_id;
  let publication_id = req.body.publication_id;
  let content = req.body.content;
  
  const commentaire = Commentaire.create({
    utilisateur_id: utilisateur_id,
    publication_id: publication_id,
    content: content,
  })// enregistrer la nouvelle publication dans la BDD
    .then(() => res.status(201).json({ message: 'commentaire added!' }))
    .catch(error => {
      console.log("eroor",error)
      return res.status(400).json({ error: 'cannot add commentaire' })
    });
};



exports.getCommentaire = (req, res, next) => {

      Commentaire.findAll({
        include: [{
          model: models.User,
        }, {
          model: models.publication,
          include: [{
            model: models.User,
          }]
        }]
    })
      .then(
        (commentaires) => {
          res.status(200).json(commentaires);
        }
      ).catch(
        (error) => {
          console.log("error", error)
          res.status(400).json({
            'error': error
          });
        }
      );
    };