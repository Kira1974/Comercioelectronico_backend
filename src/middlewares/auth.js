const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ApiResponse.error(res, 'Token no proporcionado', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return ApiResponse.error(res, 'Token expirado', 401);
        }
        return ApiResponse.error(res, 'Token inválido', 401);
    }
};

module.exports = auth;
