const { Product, Category } = require('../models');
const { Op } = require('sequelize');

class ProductService {
    async getAll({ page = 1, limit = 10, search, categoryId, minPrice, maxPrice }) {
        const offset = (page - 1) * limit;
        const where = { active: true };

        if (search) {
            where.name = { [Op.iLike]: `%${search}%` };
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = minPrice;
            if (maxPrice) where.price[Op.lte] = maxPrice;
        }

        const { count, rows } = await Product.findAndCountAll({
            where,
            include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']],
        });

        return { products: rows, total: count };
    }

    async getById(id) {
        const product = await Product.findOne({
            where: { id, active: true },
            include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
        });

        if (!product) {
            const error = new Error('Producto no encontrado');
            error.statusCode = 404;
            throw error;
        }

        return product;
    }

    async create(data) {
        // Verificar que la categoría existe
        const category = await Category.findByPk(data.categoryId);
        if (!category) {
            const error = new Error('Categoría no encontrada');
            error.statusCode = 404;
            throw error;
        }

        const product = await Product.create(data);
        return product.reload({
            include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
        });
    }

    async update(id, data) {
        const product = await Product.findByPk(id);
        if (!product) {
            const error = new Error('Producto no encontrado');
            error.statusCode = 404;
            throw error;
        }

        if (data.categoryId) {
            const category = await Category.findByPk(data.categoryId);
            if (!category) {
                const error = new Error('Categoría no encontrada');
                error.statusCode = 404;
                throw error;
            }
        }

        await product.update(data);
        return product.reload({
            include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
        });
    }

    async delete(id) {
        const product = await Product.findByPk(id);
        if (!product) {
            const error = new Error('Producto no encontrado');
            error.statusCode = 404;
            throw error;
        }

        // Soft delete
        await product.update({ active: false });
        return { message: 'Producto eliminado exitosamente' };
    }
}

module.exports = new ProductService();
