const models = require('../models');
const Commentaire = models.Commentaire;


exports.creatCommentaire = (req, res) => {// création d'un nouveau commentaire
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

exports.deleteCommentaire = (req, res, next) => {
    Commentaire.findOne({
        where: {
          id: req.params.id
        }
      })
        .then(commentaire => {
          if (!commentaire) { // si user non trouvé
            return res.status(401).json({ error: 'Commentaire non trouvé !' });
          }
          Commentaire.destroy({
            where: {
              id: req.params.id
            }
          }).then(() => {
                res.status(200).json({ message: 'Commentaire supprimé!' });
          }).catch(error => {
            console.log('erreur', error);
            res.status(400).json({ "error": error });
          });
        })
        .catch(error => {
          console.log('erreur', error)
          res.status(500).json({ "error": error });
    });
}


