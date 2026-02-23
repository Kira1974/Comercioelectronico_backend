const { Cart, CartItem, Product, Category } = require('../models');

class CartService {
    async getCart(userId) {
        let cart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price', 'stock', 'imageUrl', 'active'],
                    include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
                }],
            }],
        });

        if (!cart) {
            cart = await Cart.create({ userId });
            cart = await Cart.findOne({
                where: { userId },
                include: [{
                    model: CartItem,
                    as: 'items',
                    include: [{
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'price', 'stock', 'imageUrl', 'active'],
                        include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
                    }],
                }],
            });
        }

        // Calcular totales
        const cartData = cart.toJSON();
        cartData.totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
        cartData.totalPrice = cartData.items.reduce(
            (sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0
        ).toFixed(2);

        return cartData;
    }

    async addItem(userId, { productId, quantity }) {
        // Verificar producto
        const product = await Product.findOne({ where: { id: productId, active: true } });
        if (!product) {
            const error = new Error('Producto no encontrado o no disponible');
            error.statusCode = 404;
            throw error;
        }

        if (product.stock < quantity) {
            const error = new Error(`Stock insuficiente. Disponible: ${product.stock}`);
            error.statusCode = 400;
            throw error;
        }

        // Obtener o crear carrito
        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId });
        }

        // Verificar si el item ya existe en el carrito
        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId },
        });

        if (cartItem) {
            const newQuantity = cartItem.quantity + quantity;
            if (newQuantity > product.stock) {
                const error = new Error(`Stock insuficiente. Disponible: ${product.stock}, en carrito: ${cartItem.quantity}`);
                error.statusCode = 400;
                throw error;
            }
            await cartItem.update({ quantity: newQuantity });
        } else {
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId,
                quantity,
            });
        }

        return this.getCart(userId);
    }

    async updateItem(userId, itemId, { quantity }) {
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            const error = new Error('Carrito no encontrado');
            error.statusCode = 404;
            throw error;
        }

        const cartItem = await CartItem.findOne({
            where: { id: itemId, cartId: cart.id },
            include: [{ model: Product, as: 'product' }],
        });

        if (!cartItem) {
            const error = new Error('Item no encontrado en el carrito');
            error.statusCode = 404;
            throw error;
        }

        if (quantity > cartItem.product.stock) {
            const error = new Error(`Stock insuficiente. Disponible: ${cartItem.product.stock}`);
            error.statusCode = 400;
            throw error;
        }

        await cartItem.update({ quantity });
        return this.getCart(userId);
    }

    async removeItem(userId, itemId) {
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            const error = new Error('Carrito no encontrado');
            error.statusCode = 404;
            throw error;
        }

        const cartItem = await CartItem.findOne({
            where: { id: itemId, cartId: cart.id },
        });

        if (!cartItem) {
            const error = new Error('Item no encontrado en el carrito');
            error.statusCode = 404;
            throw error;
        }

        await cartItem.destroy();
        return this.getCart(userId);
    }

    async clearCart(userId) {
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            const error = new Error('Carrito no encontrado');
            error.statusCode = 404;
            throw error;
        }

        await CartItem.destroy({ where: { cartId: cart.id } });
        return this.getCart(userId);
    }
}

module.exports = new CartService();
