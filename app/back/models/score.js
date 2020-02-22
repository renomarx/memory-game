'use strict';
module.exports = (sequelize, DataTypes) => {
  var Score = sequelize.define('Score', {
    duration: DataTypes.INTEGER
  });

  return Score;
};
