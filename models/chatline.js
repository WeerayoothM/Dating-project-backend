module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
        'ChatLine',
        {
            message: DataTypes.STRING,
        },
        {
            tableName: 'chatlines'
        }
    );
    model.associate = (models) => {
        model.belongsTo(models.Room, {
            foreignKey: "room_id",
        });
        model.belongsTo(models.User, {
            foreignKey: "user_id",
        });

    };

    return model;
};