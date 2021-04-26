const models = require('../models');
const Publication = models.Publication;


exports.creatPublication = (req, res) => {// création des nouvelles publications
  let utilisateur_id = req.body.utilisateur_id;
  console.log(utilisateur_id)
  let content = req.body.content;
  let img = `${req.protocol}://${req.get('host')}/images/no_photo_profil.png`;
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