const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
    async register(req, res, next) {
        try {
            const { user, token } = await authService.register(req.body);
            return ApiResponse.created(res, { user, token }, 'Usuario registrado exitosamente');
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { user, token } = await authService.login(req.body);
            return ApiResponse.success(res, { user, token }, 'Inicio de sesión exitoso');
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const user = await authService.getProfile(req.user.id);
            return ApiResponse.success(res, { user });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
