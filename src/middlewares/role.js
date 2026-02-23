const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware para verificar rol del usuario
 * @param  {...string} roles - Roles permitidos
 */
const role = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return ApiResponse.error(res, 'No autenticado', 401);
        }

        if (!roles.includes(req.user.role)) {
            return ApiResponse.error(res, 'No tienes permisos para realizar esta acción', 403);
        }

        next();
    };
};

module.exports = role;
