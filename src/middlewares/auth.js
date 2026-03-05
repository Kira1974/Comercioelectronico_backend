const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ApiResponse.error(res, 'Token no proporcionado', 401);
        }

        const token = authHeader.split(' ')[1];

        // Verificar longitud mínima para evitar tokens malformados
        if (!token || token.length < 10) {
            return ApiResponse.error(res, 'Token inválido', 401);
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET no está definido en las variables de entorno');
            return ApiResponse.error(res, 'Error interno del servidor', 500);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256'], // Forzar solo el algoritmo esperado
        });

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return ApiResponse.error(res, 'Token expirado', 401);
        }
        // No revelar detalles del error de JWT
        return ApiResponse.error(res, 'Token inválido', 401);
    }
};

module.exports = auth;
