const jwt = require('jsonwebtoken');
const { User, Cart } = require('../models');

class AuthService {
    async register({ name, email, password, role }) {
        // Verificar si el email ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            const error = new Error('El email ya está registrado');
            error.statusCode = 409;
            throw error;
        }

        // Crear usuario
        const user = await User.create({ name, email, password, role: role || 'customer' });

        // Crear carrito para el usuario
        await Cart.create({ userId: user.id });

        // Generar token
        const token = this.generateToken(user);

        return { user, token };
    }

    async login({ email, password }) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401;
            throw error;
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401;
            throw error;
        }

        const token = this.generateToken(user);
        return { user, token };
    }

    async getProfile(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            const error = new Error('Usuario no encontrado');
            error.statusCode = 404;
            throw error;
        }
        return user;
    }

    generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
    }
}

module.exports = new AuthService();
