const { Order, OrderItem, Product, Payment, User, sequelize } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

class DashboardService {
    /**
     * Resumen general: total ventas, pedidos, productos, usuarios
     */
    async getStats() {
        const [totalSales, totalOrders, totalProducts, totalUsers, pendingOrders] = await Promise.all([
            Payment.sum('amount', { where: { status: 'aprobado' } }),
            Order.count(),
            Product.count({ where: { active: true } }),
            User.count({ where: { role: 'customer' } }),
            Order.count({ where: { status: 'pendiente' } }),
        ]);

        return {
            totalSales: parseFloat(totalSales || 0).toFixed(2),
            totalOrders,
            totalProducts,
            totalUsers,
            pendingOrders,
        };
    }

    /**
     * Ventas por período
     */
    async getSales({ startDate, endDate, groupBy = 'day' }) {
        const where = { status: 'aprobado' };

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt[Op.gte] = new Date(startDate);
            if (endDate) where.createdAt[Op.lte] = new Date(endDate + 'T23:59:59');
        }

        let dateFormat;
        switch (groupBy) {
            case 'month':
                dateFormat = 'YYYY-MM';
                break;
            case 'year':
                dateFormat = 'YYYY';
                break;
            default:
                dateFormat = 'YYYY-MM-DD';
        }

        const sales = await Payment.findAll({
            where,
            attributes: [
                [fn('to_char', col('created_at'), dateFormat), 'period'],
                [fn('SUM', col('amount')), 'totalSales'],
                [fn('COUNT', col('id')), 'totalTransactions'],
            ],
            group: [fn('to_char', col('created_at'), dateFormat)],
            order: [[fn('to_char', col('created_at'), dateFormat), 'ASC']],
            raw: true,
        });

        return sales;
    }

    /**
     * Estado del inventario
     */
    async getInventory({ lowStockThreshold = 10 }) {
        const [lowStock, outOfStock, totalValue] = await Promise.all([
            Product.findAll({
                where: {
                    active: true,
                    stock: { [Op.gt]: 0, [Op.lte]: lowStockThreshold },
                },
                attributes: ['id', 'name', 'stock', 'price'],
                order: [['stock', 'ASC']],
            }),
            Product.findAll({
                where: { active: true, stock: 0 },
                attributes: ['id', 'name', 'price'],
            }),
            Product.findOne({
                where: { active: true },
                attributes: [[fn('SUM', literal('"price" * "stock"')), 'totalValue']],
                raw: true,
            }),
        ]);

        return {
            lowStock,
            outOfStock,
            totalInventoryValue: parseFloat(totalValue?.totalValue || 0).toFixed(2),
            lowStockCount: lowStock.length,
            outOfStockCount: outOfStock.length,
        };
    }

    /**
     * Productos más vendidos
     */
    async getTopProducts({ limit = 10 }) {
        const topProducts = await OrderItem.findAll({
            attributes: [
                'productId',
                [fn('SUM', col('quantity')), 'totalSold'],
                [fn('SUM', literal('"quantity" * "unit_price"')), 'totalRevenue'],
            ],
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'stock', 'imageUrl'],
            }],
            group: ['productId', 'product.id'],
            order: [[fn('SUM', col('quantity')), 'DESC']],
            limit: parseInt(limit),
            raw: false,
        });

        return topProducts;
    }
}

module.exports = new DashboardService();
