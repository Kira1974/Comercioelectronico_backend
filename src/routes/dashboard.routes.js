const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

const router = Router();

// Todas las rutas del dashboard requieren autenticación admin
router.use(auth, role('admin'));

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Resumen general (ventas totales, pedidos, productos, usuarios)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generales
 */
router.get('/stats', dashboardController.getStats);

/**
 * @swagger
 * /api/dashboard/sales:
 *   get:
 *     summary: Ventas por período
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, month, year]
 *     responses:
 *       200:
 *         description: Reporte de ventas
 */
router.get('/sales', dashboardController.getSales);

/**
 * @swagger
 * /api/dashboard/inventory:
 *   get:
 *     summary: Estado del inventario
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lowStockThreshold
 *         schema:
 *           type: integer
 *         description: Umbral de stock bajo (default 10)
 *     responses:
 *       200:
 *         description: Estado del inventario
 */
router.get('/inventory', dashboardController.getInventory);

/**
 * @swagger
 * /api/dashboard/top-products:
 *   get:
 *     summary: Productos más vendidos
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de productos (default 10)
 *     responses:
 *       200:
 *         description: Top productos
 */
router.get('/top-products', dashboardController.getTopProducts);

module.exports = router;
