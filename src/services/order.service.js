const { Order, OrderItem, Cart, CartItem, Product, Payment, User, Category, sequelize } = require('../models');

class OrderService {
    async createFromCart(userId, { shippingAddress }) {
        const transaction = await sequelize.transaction();

        try {
            // Obtener carrito con items
            const cart = await Cart.findOne({
                where: { userId },
                include: [{
                    model: CartItem,
                    as: 'items',
                    include: [{ model: Product, as: 'product' }],
                }],
                transaction,
            });

            if (!cart || cart.items.length === 0) {
                const error = new Error('El carrito está vacío');
                error.statusCode = 400;
                throw error;
            }

            // Verificar stock de todos los productos
            for (const item of cart.items) {
                if (!item.product.active) {
                    const error = new Error(`El producto "${item.product.name}" ya no está disponible`);
                    error.statusCode = 400;
                    throw error;
                }
                if (item.product.stock < item.quantity) {
                    const error = new Error(`Stock insuficiente para "${item.product.name}". Disponible: ${item.product.stock}`);
                    error.statusCode = 400;
                    throw error;
                }
            }

            // Calcular total
            const total = cart.items.reduce(
                (sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0
            );

            // Crear orden
            const order = await Order.create({
                userId,
                total: total.toFixed(2),
                shippingAddress,
                status: 'pendiente',
            }, { transaction });

            // Crear items de la orden y actualizar stock
            for (const item of cart.items) {
                await OrderItem.create({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.product.price,
                }, { transaction });

                // Descontar stock
                await item.product.update({
                    stock: item.product.stock - item.quantity,
                }, { transaction });
            }

            // Vaciar carrito
            await CartItem.destroy({ where: { cartId: cart.id }, transaction });

            await transaction.commit();

            // Retornar orden completa
            return this.getById(order.id, userId);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getByUser(userId, { page = 1, limit = 10 }) {
        const offset = (page - 1) * limit;

        const { count, rows } = await Order.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'imageUrl'],
                    }],
                },
                {
                    model: Payment,
                    as: 'payment',
                    attributes: ['id', 'status', 'method', 'transactionId'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        return { orders: rows, total: count };
    }

    async getById(orderId, userId = null) {
        const where = { id: orderId };
        if (userId) where.userId = userId;

        const order = await Order.findOne({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'imageUrl', 'price'],
                        include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
                    }],
                },
                {
                    model: Payment,
                    as: 'payment',
                },
            ],
        });

        if (!order) {
            const error = new Error('Orden no encontrada');
            error.statusCode = 404;
            throw error;
        }

        return order;
    }

    async getAll({ page = 1, limit = 10, status }) {
        const offset = (page - 1) * limit;
        const where = {};
        if (status) where.status = status;

        const { count, rows } = await Order.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: Payment,
                    as: 'payment',
                    attributes: ['id', 'status', 'method', 'transactionId'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
        });

        return { orders: rows, total: count };
    }

    async updateStatus(orderId, status, io) {
        const order = await Order.findByPk(orderId, {
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        });

        if (!order) {
            const error = new Error('Orden no encontrada');
            error.statusCode = 404;
            throw error;
        }

        const previousStatus = order.status;
        await order.update({ status });

        // Emitir evento WebSocket al usuario
        if (io) {
            io.to(`user_${order.userId}`).emit('order:statusUpdated', {
                orderId: order.id,
                previousStatus,
                newStatus: status,
                updatedAt: new Date(),
            });
        }

        return order.reload({
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'name'] }] },
                { model: Payment, as: 'payment' },
            ],
        });
    }
}

module.exports = new OrderService();
