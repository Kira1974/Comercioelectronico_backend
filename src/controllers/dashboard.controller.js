const dashboardService = require('../services/dashboard.service');
const ApiResponse = require('../utils/apiResponse');

class DashboardController {
    async getStats(req, res, next) {
        try {
            const stats = await dashboardService.getStats();
            return ApiResponse.success(res, { stats }, 'Estadísticas generales');
        } catch (error) {
            next(error);
        }
    }

    async getSales(req, res, next) {
        try {
            const { startDate, endDate, groupBy } = req.query;
            const sales = await dashboardService.getSales({ startDate, endDate, groupBy });
            return ApiResponse.success(res, { sales }, 'Reporte de ventas');
        } catch (error) {
            next(error);
        }
    }

    async getInventory(req, res, next) {
        try {
            const { lowStockThreshold } = req.query;
            const inventory = await dashboardService.getInventory({
                lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : 10,
            });
            return ApiResponse.success(res, { inventory }, 'Estado del inventario');
        } catch (error) {
            next(error);
        }
    }

    async getTopProducts(req, res, next) {
        try {
            const { limit } = req.query;
            const topProducts = await dashboardService.getTopProducts({
                limit: limit ? parseInt(limit) : 10,
            });
            return ApiResponse.success(res, { topProducts }, 'Productos más vendidos');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DashboardController();
