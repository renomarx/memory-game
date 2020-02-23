const models  = require('./models');

// Permet à l'ORM sequelize de créer automatiquement les tables en BDD, si elles n'existent pas déjà
// Sequelize se base sur les objets déclarés dans models/*.js
models.sequelize.sync().then(() => {
  // Si la synchronisation de la BDD s'est bien passé, on peut lancer le serveur API
  console.log("Database models were synchronized successfully.");

  const server = require("./server");
  let port = 3333;
  server.listen(port, () => console.log(`Memory server listening on port ${port}!`))
})
