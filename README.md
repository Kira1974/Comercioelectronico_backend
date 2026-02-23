# Comercio Electrónico - Backend API

API REST para plataforma de comercio electrónico desarrollada con **Node.js**, **Express** y **PostgreSQL**.

## Tecnologías

| Tecnología | Uso |
|---|---|
| Node.js + Express | Framework backend |
| PostgreSQL | Base de datos relacional |
| Sequelize | ORM |
| JWT | Autenticación |
| Socket.IO | WebSockets (cambio reactivo de estado) |
| Swagger | Documentación de API |
| Docker | Infraestructura local |

## Instalación y Configuración

### 1. Requisitos Previos
- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Levantar la Base de Datos
```bash
docker-compose up -d
```
Esto levanta:
- **PostgreSQL** en `localhost:5432`
- **pgAdmin** en `http://localhost:5050` (admin@ecommerce.com / admin123)

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Ejecutar el Seed (Datos de Prueba)
```bash
npm run seed
```

### 5. Iniciar el Servidor
```bash
npm run dev
```

El servidor arrancará en `http://localhost:3000`

## Documentación API

Una vez el servidor esté corriendo, accede a la documentación interactiva de Swagger:

**http://localhost:3000/api/docs**

También puedes importar los endpoints en **Postman** o usar cURL.

## Credenciales de Prueba

| Rol | Email | Contraseña |
|---|---|---|
| Admin | admin@ecommerce.com | admin123 |
| Cliente | carlos@email.com | password123 |
| Cliente | maria@email.com | password123 |

## Endpoints Principales

### Auth
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login → JWT token |
| GET | `/api/auth/profile` | Perfil (auth requerido) |

### Catálogo (Productos)
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/api/products` | No | Listar productos (filtros, paginación) |
| GET | `/api/products/:id` | No | Detalle de producto |
| POST | `/api/products` | Admin | Crear producto |
| PUT | `/api/products/:id` | Admin | Actualizar producto |
| DELETE | `/api/products/:id` | Admin | Eliminar producto (soft-delete) |

### Categorías
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/api/categories` | No | Listar categorías |
| POST | `/api/categories` | Admin | Crear categoría |
| PUT | `/api/categories/:id` | Admin | Actualizar categoría |
| DELETE | `/api/categories/:id` | Admin | Eliminar categoría |

### Carrito
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/cart` | Ver carrito |
| POST | `/api/cart/items` | Agregar producto |
| PUT | `/api/cart/items/:id` | Actualizar cantidad |
| DELETE | `/api/cart/items/:id` | Eliminar item |
| DELETE | `/api/cart/clear` | Vaciar carrito |

### Pedidos
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/orders` | Customer | Crear orden desde carrito |
| GET | `/api/orders` | Customer | Mis pedidos |
| GET | `/api/orders/:id` | Auth | Detalle de pedido |
| GET | `/api/orders/all` | Admin | Todos los pedidos |
| PUT | `/api/orders/:id/status` | Admin | Cambiar estado → **WebSocket** |

### Pagos (Simulación)
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/payments` | Procesar pago (80% aprobación) |
| GET | `/api/payments/:orderId` | Consultar pagos de una orden |

### Dashboard (Admin)
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/dashboard/stats` | Resumen general |
| GET | `/api/dashboard/sales` | Ventas por período |
| GET | `/api/dashboard/inventory` | Estado del inventario |
| GET | `/api/dashboard/top-products` | Productos más vendidos |

## WebSocket - Seguimiento Reactivo de Pedidos

El servidor usa **Socket.IO** para notificar a los clientes en tiempo real cuando el estado de un pedido cambia.

### Conectarse
```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'TU_JWT_TOKEN' }
});

socket.on('order:statusUpdated', (data) => {
  console.log('Pedido actualizado:', data);
  // { orderId, previousStatus, newStatus, updatedAt }
});
```

Cuando un admin cambia el estado de un pedido via `PUT /api/orders/:id/status`, el evento `order:statusUpdated` se emite automáticamente al usuario dueño del pedido.

## Estructura del Proyecto

```
src/
├── app.js                 # Express + Swagger setup
├── server.js              # Entry point + Socket.IO
├── config/database.js     # Sequelize config
├── middlewares/
│   ├── auth.js            # JWT verification
│   ├── role.js            # Role-based access
│   └── errorHandler.js    # Error handling + validation
├── models/                # 8 modelos Sequelize
├── services/              # Lógica de negocio
├── controllers/           # Request handlers
├── routes/                # Express Router + Swagger docs
├── sockets/orderSocket.js # WebSocket handlers
└── utils/                 # Helpers (apiResponse, validators)
```

## Probar con Postman

1. **Login** → `POST /api/auth/login` con `{ email, password }`
2. Copiar el `token` de la respuesta
3. En las demás peticiones, agregar header: `Authorization: Bearer <token>`
4. Seguir el flujo: Catálogo → Carrito → Orden → Pago → Seguimiento

## Variables de Entorno

Ver archivo `.env.example` para referencia.
