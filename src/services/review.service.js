const { Review, User, Product } = require('../models');

class ReviewService {
    // Crear o actualizar reseña (un usuario solo puede tener una por producto)
    async createReview(userId, productId, { rating, comment }) {
        const product = await Product.findByPk(productId);
        if (!product || !product.active) {
            const error = new Error('Producto no encontrado');
            error.statusCode = 404;
            throw error;
        }

        // Si ya existe una reseña del mismo usuario para el mismo producto, la actualiza
        const existing = await Review.findOne({ where: { userId, productId } });
        if (existing) {
            await existing.update({ rating, comment });
            return { review: existing, updated: true };
        }

        const review = await Review.create({ userId, productId, rating, comment });
        return { review, updated: false };
    }

    // Obtener todas las reseñas de un producto con promedio de calificación
    async getProductReviews(productId) {
        const product = await Product.findByPk(productId);
        if (!product) {
            const error = new Error('Producto no encontrado');
            error.statusCode = 404;
            throw error;
        }

        const reviews = await Review.findAll({
            where: { productId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        const total = reviews.length;
        const average = total > 0
            ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1))
            : 0;

        // Conteo por cada estrella
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(r => distribution[r.rating]++);

        return { reviews, average, total, distribution };
    }

    // Obtener la reseña del usuario autenticado para un producto
    async getUserReview(userId, productId) {
        const review = await Review.findOne({ where: { userId, productId } });
        if (!review) {
            const error = new Error('No has dejado una reseña para este producto');
            error.statusCode = 404;
            throw error;
        }
        return review;
    }

    // Eliminar reseña propia
    async deleteReview(userId, productId) {
        const review = await Review.findOne({ where: { userId, productId } });
        if (!review) {
            const error = new Error('Reseña no encontrada');
            error.statusCode = 404;
            throw error;
        }
        await review.destroy();
    }

    // Admin: eliminar cualquier reseña por ID
    async deleteReviewById(reviewId) {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            const error = new Error('Reseña no encontrada');
            error.statusCode = 404;
            throw error;
        }
        await review.destroy();
    }
}

module.exports = new ReviewService();
