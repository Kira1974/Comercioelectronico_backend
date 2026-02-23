const { Router } = require('express');
const categoryController = require('../controllers/category.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const { validate } = require('../middlewares/errorHandler');
const validators = require('../utils/validators');

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Listar todas las categorías
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/', categoryController.getAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener una categoría
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
router.get('/:id', validators.paramId, validate, categoryController.getById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear categoría (Solo admin)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada
 */
router.post('/', auth, role('admin'), validators.createCategory, validate, categoryController.create);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar categoría (Solo admin)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', auth, role('admin'), validators.paramId, validate, categoryController.update);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar categoría (Solo admin)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', auth, role('admin'), validators.paramId, validate, categoryController.delete);

module.exports = router;
