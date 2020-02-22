const models  = require('./models');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3333;

// Middleware permettant de décoder le json du body d'une requête,
// avant de le passer au handler de route
app.use(express.json());

// Middleware permettant de donner les bons headers CORS à chaque réponse
app.use(cors())

// Route pour récupérer tous les scores
app.get('/scores', (req, res) => {
  models.Score.findAll().then(function(scores) {
    res.status(200).json(scores)
  });
});

// Route pour insérer un nouveau score
app.post('/scores', (req, res) => {
  let score = req.body
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
    console.log(err)
    res.status(500)
  })

});

// Permet à l'ORM sequelize de créer automatiquement les tables en BDD, si elles n'existent pas déjà
// Sequelize se base sur les objets déclarés dans models/*.js
models.sequelize.sync().then(() => {
  // Si la synchronisation de la BDD s'est bien passé, on peut lancer le serveur API
  console.log("Database models were synchronized successfully.");

  app.listen(port, () => console.log(`Memory server listening on port ${port}!`));
})
