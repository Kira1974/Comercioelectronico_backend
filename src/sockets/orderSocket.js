const jwt = require('jsonwebtoken');

/**
 * Configuración de Socket.IO para el seguimiento reactivo de pedidos
 */
const setupOrderSocket = (io) => {
    // Middleware de autenticación para WebSocket
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.query.token;

        if (!token) {
            return next(new Error('Token no proporcionado'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            return next(new Error('Token inválido'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 Usuario conectado: ${socket.user.email} (${socket.user.role})`);

        // Unir al usuario a su canal personal para recibir actualizaciones
        socket.join(`user_${socket.user.id}`);

        // Si es admin, unirlo también al canal de admin
        if (socket.user.role === 'admin') {
            socket.join('admin_channel');
        }

        // Evento de ping para verificar conexión
        socket.on('ping', () => {
            socket.emit('pong', { message: 'Conexión activa', timestamp: new Date() });
        });

        socket.on('disconnect', () => {
            console.log(`❌ Usuario desconectado: ${socket.user.email}`);
        });
    });

    console.log('📡 Socket.IO configurado para seguimiento de pedidos');
};

module.exports = setupOrderSocket;
