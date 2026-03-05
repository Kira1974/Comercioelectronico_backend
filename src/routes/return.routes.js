const { Router } = require('express');
const returnController = require('../controllers/return.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const { validate } = require('../middlewares/errorHandler');
const validators = require('../utils/validators');

const router = Router();

/**
 * @swagger
 * /api/returns:
 *   post:
 *     summary: Solicitar devolución de un producto comprado
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, orderItemId, quantity, reason, description]
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 1
 *               orderItemId:
 *                 type: integer
 *                 example: 2
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               reason:
 *                 type: string
 *                 enum: [defecto_fabricacion, daño_envio, producto_incorrecto, no_cumple_expectativas, otro]
 *                 example: defecto_fabricacion
 *               description:
 *                 type: string
 *                 example: El producto llegó con la pantalla rota
 *     responses:
 *       201:
 *         description: Solicitud de devolución creada
 *       400:
 *         description: La orden no está entregada o cantidad inválida
 *       409:
 *         description: Ya existe una devolución activa para este ítem
 */
router.post('/', auth, validators.createReturn, validate, returnController.createReturn);

/**
 * @swagger
 * /api/returns:
 *   get:
 *     summary: Ver mis solicitudes de devolución
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de devoluciones del usuario autenticado
 */
router.get('/', auth, returnController.getUserReturns);

/**
 * @swagger
 * /api/returns/{id}:
 *   get:
 *     summary: Ver detalle de una devolución
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la devolución
 *       404:
 *         description: Devolución no encontrada
 */
router.get('/:id', auth, returnController.getReturnById);

/**
 * @swagger
 * /api/returns/{id}:
 *   delete:
 *     summary: Cancelar mi solicitud de devolución (solo si está en estado "solicitada")
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitud cancelada
 *       400:
 *         description: No se puede cancelar en el estado actual
 */
router.delete('/:id', auth, returnController.cancelReturn);

/**
 * @swagger
 * /api/returns/admin/all:
 *   get:
 *     summary: (Admin) Ver todas las solicitudes de devolución
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [solicitada, en_revision, aprobada, rechazada, completada]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista paginada de devoluciones
 */
router.get('/admin/all', auth, role('admin'), returnController.getAllReturns);

/**
 * @swagger
 * /api/returns/admin/{id}/status:
 *   patch:
 *     summary: (Admin) Aprobar, rechazar o actualizar estado de una devolución
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [en_revision, aprobada, rechazada, completada]
 *                 example: aprobada
 *               adminComment:
 *                 type: string
 *                 example: Devolución aprobada, se procederá al reembolso
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch('/admin/:id/status', auth, role('admin'), validators.updateReturnStatus, validate, returnController.updateReturnStatus);

module.exports = router;
