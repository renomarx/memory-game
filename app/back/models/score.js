'use strict';

// On déclare un modèle représentant la table scores:
// Ex: Table scores:
// id     duration    createdAt              updatedAt
// 1      38000       2020-02-22T09:34:02Z    2020-02-22T09:34:02Z
// 2      42000       2020-02-22T12:27:53Z    2020-02-22T12:27:53Z
//
// Les champs id, createdAt et updatedAt sont automatiquement créés par Sequelize
// (même si dans notre cas updatedAt sera inutile)
module.exports = (sequelize, DataTypes) => {
  var Score = sequelize.define('Score', {
    duration: DataTypes.INTEGER
  });

  return Score;
};
