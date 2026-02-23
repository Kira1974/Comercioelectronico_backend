const { Router } = require('express');
const paymentController = require('../controllers/payment.controller');
const auth = require('../middlewares/auth');
const { validate } = require('../middlewares/errorHandler');
const validators = require('../utils/validators');

const router = Router();

// Todas las rutas de pagos requieren autenticación
router.use(auth);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Procesar pago (simulación)
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, method]
 *             properties:
 *               orderId:
 *                 type: integer
 *               method:
 *                 type: string
 *                 enum: [tarjeta, transferencia, paypal]
 *     responses:
 *       200:
 *         description: Pago aprobado
 *       402:
 *         description: Pago rechazado
 */
router.post('/', validators.processPayment, validate, paymentController.processPayment);

/**
 * @swagger
 * /api/payments/{orderId}:
 *   get:
 *     summary: Consultar pagos de una orden
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pagos de la orden
 */
router.get('/:orderId', paymentController.getByOrderId);

module.exports = router;
