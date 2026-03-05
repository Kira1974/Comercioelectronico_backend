const { Router } = require('express');
const reviewController = require('../controllers/review.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const { validate } = require('../middlewares/errorHandler');
const validators = require('../utils/validators');

const router = Router();

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Obtener reseñas y calificaciones de un producto
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Lista de reseñas con promedio y distribución de calificaciones
 */
router.get('/product/:productId', reviewController.getProductReviews);

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   post:
 *     summary: Crear o actualizar reseña de un producto
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Excelente producto, muy buena calidad
 *     responses:
 *       201:
 *         description: Reseña creada
 *       200:
 *         description: Reseña actualizada (ya existía una reseña del usuario)
 *       401:
 *         description: No autenticado
 */
router.post('/product/:productId', auth, validators.createReview, validate, reviewController.createReview);

/**
 * @swagger
 * /api/reviews/product/{productId}/my-review:
 *   get:
 *     summary: Obtener mi reseña de un producto
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reseña del usuario autenticado
 *       404:
 *         description: No tienes reseña para este producto
 */
router.get('/product/:productId/my-review', auth, reviewController.getUserReview);

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   delete:
 *     summary: Eliminar mi reseña de un producto
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reseña eliminada
 *       404:
 *         description: Reseña no encontrada
 */
router.delete('/product/:productId', auth, reviewController.deleteReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: (Admin) Eliminar cualquier reseña por ID
 *     tags: [Reviews]
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
 *         description: Reseña eliminada
 *       404:
 *         description: Reseña no encontrada
 */
router.delete('/:id', auth, role('admin'), reviewController.adminDeleteReview);

module.exports = router;
