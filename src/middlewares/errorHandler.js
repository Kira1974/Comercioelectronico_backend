const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware para manejar errores de validación de express-validator
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
        }));
        return ApiResponse.error(res, 'Errores de validación', 422, extractedErrors);
    }
    next();
};

/**
 * Middleware global de manejo de errores
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map((e) => ({
            field: e.path,
            message: e.message,
        }));
        return ApiResponse.error(res, 'Error de validación en base de datos', 422, errors);
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        const errors = err.errors.map((e) => ({
            field: e.path,
            message: `El valor '${e.value}' ya existe`,
        }));
        return ApiResponse.error(res, 'Registro duplicado', 409, errors);
    }

    return ApiResponse.error(
        res,
        process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor',
        err.statusCode || 500
    );
};

module.exports = { validate, errorHandler };
