const returnService = require('../services/return.service');
const ApiResponse = require('../utils/apiResponse');

class ReturnController {
    async createReturn(req, res, next) {
        try {
            const returnRequest = await returnService.createReturn(req.user.id, req.body);
            return ApiResponse.created(res, { return: returnRequest }, 'Solicitud de devolución creada exitosamente');
        } catch (error) {
            next(error);
        }
    }

    async getUserReturns(req, res, next) {
        try {
            const returns = await returnService.getUserReturns(req.user.id);
            return ApiResponse.success(res, { returns }, 'Devoluciones obtenidas exitosamente');
        } catch (error) {
            next(error);
        }
    }

    async getReturnById(req, res, next) {
        try {
            const returnRequest = await returnService.getReturnById(req.user.id, req.params.id);
            return ApiResponse.success(res, { return: returnRequest });
        } catch (error) {
            next(error);
        }
    }

    async cancelReturn(req, res, next) {
        try {
            await returnService.cancelReturn(req.user.id, req.params.id);
            return ApiResponse.success(res, null, 'Solicitud de devolución cancelada');
        } catch (error) {
            next(error);
        }
    }

    // Admin
    async getAllReturns(req, res, next) {
        try {
            const { status, page, limit } = req.query;
            const data = await returnService.getAllReturns({ status, page, limit });
            return ApiResponse.paginated(res, data.returns, data.total, data.page, data.limit, 'Devoluciones obtenidas exitosamente');
        } catch (error) {
            next(error);
        }
    }

    async updateReturnStatus(req, res, next) {
        try {
            const returnRequest = await returnService.updateReturnStatus(req.params.id, req.body);
            return ApiResponse.success(res, { return: returnRequest }, 'Estado de devolución actualizado exitosamente');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReturnController();
