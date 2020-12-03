module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    'Photo',
    {
      imageUrl: DataTypes.STRING,
    },
    {
      tableName: 'photos',
      timestamps: false,
    }
  );
  model.associate = (models) => {
    model.belongsTo(models.User, {
      foreignKey: "user_id",
    });
  }
  return model;
};
