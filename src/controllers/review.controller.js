const reviewService = require('../services/review.service');
const ApiResponse = require('../utils/apiResponse');

class ReviewController {
    async createReview(req, res, next) {
        try {
            const { productId } = req.params;
            const { rating, comment } = req.body;
            const { review, updated } = await reviewService.createReview(req.user.id, productId, { rating, comment });
            const message = updated ? 'Reseña actualizada exitosamente' : 'Reseña creada exitosamente';
            return updated
                ? ApiResponse.success(res, { review }, message)
                : ApiResponse.created(res, { review }, message);
        } catch (error) {
            next(error);
        }
    }

    async getProductReviews(req, res, next) {
        try {
            const { productId } = req.params;
            const data = await reviewService.getProductReviews(productId);
            return ApiResponse.success(res, data, 'Reseñas obtenidas exitosamente');
        } catch (error) {
            next(error);
        }
    }

    async getUserReview(req, res, next) {
        try {
            const { productId } = req.params;
            const review = await reviewService.getUserReview(req.user.id, productId);
            return ApiResponse.success(res, { review });
        } catch (error) {
            next(error);
        }
    }

    async deleteReview(req, res, next) {
        try {
            const { productId } = req.params;
            await reviewService.deleteReview(req.user.id, productId);
            return ApiResponse.success(res, null, 'Reseña eliminada exitosamente');
        } catch (error) {
            next(error);
        }
    }

    async adminDeleteReview(req, res, next) {
        try {
            const { id } = req.params;
            await reviewService.deleteReviewById(id);
            return ApiResponse.success(res, null, 'Reseña eliminada exitosamente');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReviewController();
