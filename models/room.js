module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define(
        'Room',
        {
            participants: DataTypes.STRING,
        },
        {
            tableName: 'rooms',
            timestamps: false,
        }
    );
    model.associate = (models) => {
        model.hasMany(models.ChatLine, {
            foreignKey: "room_id",
        });
    }

    return model;
};