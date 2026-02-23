const cartService = require('../services/cart.service');
const ApiResponse = require('../utils/apiResponse');

class CartController {
    async getCart(req, res, next) {
        try {
            const cart = await cartService.getCart(req.user.id);
            return ApiResponse.success(res, { cart }, 'Carrito obtenido');
        } catch (error) {
            next(error);
        }
    }

    async addItem(req, res, next) {
        try {
            const cart = await cartService.addItem(req.user.id, req.body);
            return ApiResponse.success(res, { cart }, 'Producto agregado al carrito');
        } catch (error) {
            next(error);
        }
    }

    async updateItem(req, res, next) {
        try {
            const cart = await cartService.updateItem(req.user.id, req.params.id, req.body);
            return ApiResponse.success(res, { cart }, 'Cantidad actualizada');
        } catch (error) {
            next(error);
        }
    }

    async removeItem(req, res, next) {
        try {
            const cart = await cartService.removeItem(req.user.id, req.params.id);
            return ApiResponse.success(res, { cart }, 'Producto eliminado del carrito');
        } catch (error) {
            next(error);
        }
    }

    async clearCart(req, res, next) {
        try {
            const cart = await cartService.clearCart(req.user.id);
            return ApiResponse.success(res, { cart }, 'Carrito vaciado');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CartController();
