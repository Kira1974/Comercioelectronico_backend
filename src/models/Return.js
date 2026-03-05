// Solicitudes de devolución de productos por parte de los usuarios
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Return = sequelize.define('Return', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    returnNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: 'return_number',
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id',
    },
    orderItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_item_id',
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: { args: [1], msg: 'La cantidad debe ser al menos 1' },
        },
    },
    reason: {
        type: DataTypes.ENUM(
            'defecto_fabricacion',
            'daño_envio',
            'producto_incorrecto',
            'no_cumple_expectativas',
            'otro'
        ),
        allowNull: false,
        field: 'reason',
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('solicitada', 'en_revision', 'aprobada', 'rechazada', 'completada'),
        defaultValue: 'solicitada',
    },
    adminComment: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'admin_comment',
    },
}, {
    tableName: 'returns',
    timestamps: true,
    hooks: {
        beforeValidate: (ret) => {
            if (!ret.returnNumber) {
                const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
                ret.returnNumber = `DEV-${Date.now().toString().slice(-6)}-${rand}`;
            }
        },
    },
});

module.exports = Return;
