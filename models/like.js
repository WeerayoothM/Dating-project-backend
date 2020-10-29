module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    'Like',
    {
      status: DataTypes.STRING,
    },
    {
      tableName: 'likes',
      timestamps: false,
    }
  );
  // model.associate = (models) => {
  //   model.belongsToMany(models.User, {
  //     through: 'target_id',
  //   });
  // };

  return model;
};
