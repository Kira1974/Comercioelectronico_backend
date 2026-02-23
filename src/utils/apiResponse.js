/**
 * Helper para respuestas API estandarizadas
 */
class ApiResponse {
    static success(res, data = null, message = 'Operación exitosa', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static created(res, data = null, message = 'Recurso creado exitosamente') {
        return res.status(201).json({
            success: true,
            message,
            data,
        });
    }

    static error(res, message = 'Error interno del servidor', statusCode = 500, errors = null) {
        const response = {
            success: false,
            message,
        };
        if (errors) response.errors = errors;
        return res.status(statusCode).json(response);
    }

    static paginated(res, data, total, page, limit, message = 'Operación exitosa') {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    }
}

module.exports = ApiResponse;
