const { Router } = require('express');
const cartController = require('../controllers/cart.controller');
const auth = require('../middlewares/auth');
const { validate } = require('../middlewares/errorHandler');
const validators = require('../utils/validators');

const router = Router();

// Todas las rutas del carrito requieren autenticación
router.use(auth);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Ver el carrito del usuario
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contenido del carrito
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Agregar producto al carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Producto agregado
 */
router.post('/items', validators.addCartItem, validate, cartController.addItem);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   put:
 *     summary: Actualizar cantidad de un item
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 */
router.put('/items/:id', validators.updateCartItem, validate, cartController.updateItem);

/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Eliminar un item del carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/items/:id', validators.paramId, validate, cartController.removeItem);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Vaciar el carrito
 *     tags: [Carrito]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/clear', cartController.clearCart);

module.exports = router;
