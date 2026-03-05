// Reseñas y calificaciones de productos por parte de los usuarios
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: { args: [1], msg: 'La calificación mínima es 1' },
            max: { args: [5], msg: 'La calificación máxima es 5' },
        },
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_id',
    },
}, {
    tableName: 'reviews',
    timestamps: true,
    indexes: [
        {
            // Un usuario solo puede dejar una reseña por producto
            unique: true,
            fields: ['user_id', 'product_id'],
        },
    ],
});

module.exports = Review;
