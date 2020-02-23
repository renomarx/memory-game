const models  = require('./models');
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware permettant de décoder le json du body d'une requête,
// avant de le passer au handler de route
app.use(express.json());

// Middleware permettant de donner les bons headers CORS à chaque réponse
app.use(cors())

// Route pour récupérer tous les scores
app.get('/scores', (req, res) => {
  let options = {
    order: [
      ['duration', 'ASC'], // Pour avoir les meilleurs en premier
    ],
    limit: 10, // Par défaut, on limite à 10 résultats
  }
  // On permet de surcharger la limite par un paramètre GET
  if (req.query.limit) {
    options.limit = req.query.limit;
  }
  // Sequelize gènèrera le SQL permettant d'aller chercher les scores, selon nos options
  models.Score.findAll(options).then(function(scores) {
    res.status(200).json(scores)
  });
});

// Route pour insérer un nouveau score
app.post('/scores', (req, res) => {
  let score = req.body;
  // On contrôle si on a bien un score différent de 0ms (faut pas déconner)
  if (score.duration === undefined || score.duration === 0) {
    return res.status(400).json({ error: "Score duration cannot be 0."})
  }
  // L'ORM sequelize s'occupe de transformer cet appel create en requête SQL,
  // en fonction du model déclaré dans models/score.js
  models.Score.create(score).then((score) => {
    // Si tout s'est bien passé, on renvoie un statut 200 OK,
    // avec l'objet score nouvellement créé, encodé en json, en contenu de la réponse
    res.status(200).json(score);
  }).catch(err => {
    // Si une erreur quelconque arrive, on loggue dans la console,
    // et on renvoie un code d'erreur 500, pour que le client soit informé
    // (sinon il attendrait indéfiniment une réponse en cas d'erreur)
    console.error(err);
    res.status(500).json({ error: "An error occured during save."});
  })

});

const server = app;

module.exports = server;
