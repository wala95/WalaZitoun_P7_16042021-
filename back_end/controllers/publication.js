const models = require('../models');
const Publication = models.Publication;


exports.creatPublication = (req, res) => {// création des nouvelles publications
  let utilisateur_id = req.body.utilisateur_id;
  console.log(utilisateur_id)
  let content = req.body.content;
  let img = null;
  if (req.file) {
    img = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }
  const publication = Publication.create({
    utilisateur_id: utilisateur_id,
    content: content,
    image: img,
    like: 0,
    dislike:0
  })// enregistrer la nouvelle publication dans la BDD
    .then(() => res.status(201).json({ message: 'Publication added!' }))
    .catch(error => {
      console.log("eroor",error)
      return res.status(400).json({ error: 'cannot add publication' })
    });
};

exports.getPublication = (req, res, next) => {
//   Publication.findAll({
//     include: [{
//       model: models.User,
//       attributes: [['firstname', 'lastname', 'img']]
//     }, {
//       model: models.Commentaire,
//       attributes: [['content', 'createdAt']],
//       include: [{
//         model: models.User,
//       attributes: [['firstname', 'lastname', 'img']]
//       }]
//     }]
// })
  Publication.findAll({
    include: [{
      model: models.User,
    }, {
      model: models.Commentaire,
      include: [{
        model: models.User,
      }]
    }]
})
  .then(
    (publications) => {
      res.status(200).json(publications);
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
