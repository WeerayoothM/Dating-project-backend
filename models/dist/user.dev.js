"use strict";

module.exports = function (sequelize, DataTypes) {
  var model = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthday: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    target: DataTypes.STRING,
    lat: DataTypes.STRING,
    "long": DataTypes.STRING,
    motto: DataTypes.STRING,
    target_minAge: DataTypes.INTEGER,
    target_maxAge: DataTypes.INTEGER,
    mobile_number: DataTypes.STRING,
    showMe: DataTypes.INTEGER,
    max_distance: DataTypes.INTEGER,
    role: DataTypes.STRING
  }, {
    tableName: 'users',
    timestamps: false
  });

  model.associate = function (models) {
    model.belongsToMany(models.User, {
      through: models.Like,
      as: 'Liker',
      foreignKey: 'liker_id'
    });
    model.belongsToMany(models.User, {
      through: models.Like,
      as: 'Liked',
      foreignKey: 'liked_id'
    });
    model.hasMany(models.Photo, {
      foreignKey: 'user_id'
    });
  };

  return model;
};