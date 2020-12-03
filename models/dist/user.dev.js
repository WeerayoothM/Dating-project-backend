"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = function (sequelize, DataTypes) {
  var _sequelize$define;

  var model = sequelize.define("User", (_sequelize$define = {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthday: DataTypes.DATEONLY,
    gender: DataTypes.STRING,
    target: DataTypes.STRING,
    lat: DataTypes.STRING,
    "long": DataTypes.STRING,
    motto: DataTypes.STRING,
    target_minAge: DataTypes.INTEGER,
    target_maxAge: DataTypes.INTEGER,
    mobile_number: DataTypes.STRING,
    showMe: DataTypes.BOOLEAN,
    max_distance: DataTypes.INTEGER,
    role: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, _defineProperty(_sequelize$define, "role", DataTypes.INTEGER), _defineProperty(_sequelize$define, "passions", DataTypes.STRING), _defineProperty(_sequelize$define, "job_title", DataTypes.STRING), _defineProperty(_sequelize$define, "company", DataTypes.STRING), _defineProperty(_sequelize$define, "school", DataTypes.STRING), _sequelize$define), {
    tableName: "users",
    timestamps: false
  });

  model.associate = function (models) {
    model.belongsToMany(models.User, {
      through: models.Like,
      as: "Liker",
      foreignKey: "liker_id"
    });
    model.belongsToMany(models.User, {
      through: models.Like,
      as: "Liked",
      foreignKey: "liked_id"
    });
    model.hasMany(models.Photo, {
      foreignKey: "user_id"
    });
  };

  return model;
};