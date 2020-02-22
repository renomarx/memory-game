const models  = require('./models');
const express = require('express');
const app = express();
const port = 3333;

app.use(express.json());

app.get('/scores', (req, res) => {
  models.Score.findAll().then(function(scores) {
    res.status(200).json(scores)
  });
});

app.post('/scores', (req, res) => {
  let score = req.body
  console.log(score.duration)
  models.Score.create(score).then((score) => {
    res.status(200).json(score);
  }).catch(err => {
    console.log(err)
    res.status(500)
  })

});

models.sequelize.sync().then(() => {
  console.log("Database models were synchronized successfully.");

  app.listen(port, () => console.log(`Memory server listening on port ${port}!`));
})
