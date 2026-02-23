const productService = require('../services/product.service');
const ApiResponse = require('../utils/apiResponse');

class ProductController {
    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, search, categoryId, minPrice, maxPrice } = req.query;
            const { products, total } = await productService.getAll({
                page, limit, search, categoryId, minPrice, maxPrice,
            });
            return ApiResponse.paginated(res, products, total, page, limit, 'Productos obtenidos');
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const product = await productService.getById(req.params.id);
            return ApiResponse.success(res, { product });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const product = await productService.create(req.body);
            return ApiResponse.created(res, { product }, 'Producto creado exitosamente');
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const product = await productService.update(req.params.id, req.body);
            return ApiResponse.success(res, { product }, 'Producto actualizado exitosamente');
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const result = await productService.delete(req.params.id);
            return ApiResponse.success(res, null, result.message);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();
