const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'),
        defaultValue: 'pendiente',
    },
    shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'shipping_address',
    },
}, {
    tableName: 'orders',
    timestamps: true,
});

module.exports = Order;
