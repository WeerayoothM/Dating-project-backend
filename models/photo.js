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
  return model;
};
