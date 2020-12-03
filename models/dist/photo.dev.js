"use strict";

module.exports = function (sequelize, DataTypes) {
  var model = sequelize.define('Photo', {
    imageUrl: DataTypes.STRING
  }, {
    tableName: 'photos',
    timestamps: false
  });

  model.associate = function (models) {
    model.belongsTo(models.User, {
      foreignKey: "user_id"
    });
  };

  return model;
};