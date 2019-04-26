'use strict';
module.exports = (sequelize, DataTypes) => {
  const urlmapings = sequelize.define('urlmapings', {
    shorturl: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    fullurl: DataTypes.STRING
  }, {});
  urlmapings.associate = function (models) {
    // associations can be defined here
  };
  return urlmapings;
};