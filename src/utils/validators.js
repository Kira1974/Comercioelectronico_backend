const { body, param, query } = require('express-validator');

const validators = {
    // Auth
    register: [
        body('name').trim().notEmpty().withMessage('El nombre es requerido'),
        body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
        body('password')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres'),
    ],

    login: [
        body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
        body('password').notEmpty().withMessage('La contraseña es requerida'),
    ],

    // Products
    createProduct: [
        body('name').trim().notEmpty().withMessage('El nombre del producto es requerido'),
        body('description').optional().trim(),
        body('price')
            .isFloat({ min: 0.01 })
            .withMessage('El precio debe ser mayor a 0'),
        body('stock')
            .isInt({ min: 0 })
            .withMessage('El stock debe ser un número entero positivo'),
        body('categoryId')
            .isInt({ min: 1 })
            .withMessage('La categoría es requerida'),
        body('imageUrl').optional().isURL().withMessage('URL de imagen inválida'),
    ],

    updateProduct: [
        param('id').isInt().withMessage('ID de producto inválido'),
        body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
        body('price')
            .optional()
            .isFloat({ min: 0.01 })
            .withMessage('El precio debe ser mayor a 0'),
        body('stock')
            .optional()
            .isInt({ min: 0 })
            .withMessage('El stock debe ser un número entero positivo'),
        body('categoryId')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Categoría inválida'),
    ],

    // Categories
    createCategory: [
        body('name').trim().notEmpty().withMessage('El nombre de la categoría es requerido'),
        body('description').optional().trim(),
    ],

    // Cart
    addCartItem: [
        body('productId')
            .isInt({ min: 1 })
            .withMessage('El ID del producto es requerido'),
        body('quantity')
            .isInt({ min: 1 })
            .withMessage('La cantidad debe ser al menos 1'),
    ],

    updateCartItem: [
        param('id').isInt().withMessage('ID de item inválido'),
        body('quantity')
            .isInt({ min: 1 })
            .withMessage('La cantidad debe ser al menos 1'),
    ],

    // Orders
    createOrder: [
        body('shippingAddress')
            .trim()
            .notEmpty()
            .withMessage('La dirección de envío es requerida'),
    ],

    updateOrderStatus: [
        param('id').isInt().withMessage('ID de orden inválido'),
        body('status')
            .isIn(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'])
            .withMessage('Estado inválido. Valores permitidos: pendiente, procesando, enviado, entregado, cancelado'),
    ],

    // Payments
    processPayment: [
        body('orderId')
            .isInt({ min: 1 })
            .withMessage('El ID de la orden es requerido'),
        body('method')
            .isIn(['tarjeta', 'transferencia', 'paypal'])
            .withMessage('Método de pago inválido. Valores permitidos: tarjeta, transferencia, paypal'),
    ],

    // Pagination
    pagination: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('La página debe ser un número positivo'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('El límite debe ser entre 1 y 100'),
    ],

    // Param ID
    paramId: [
        param('id').isInt({ min: 1 }).withMessage('ID inválido'),
    ],
};

module.exports = validators;
