# My Store

Backend REST API para una tienda que gestiona usuarios, clientes, categorías, productos, pedidos y los ítems de pedido. Está construida con Express y Sequelize, y utiliza PostgreSQL como base de datos principal.

## Descripción

Aplicación backend modular que expone un conjunto de endpoints para el manejo de la información de una tienda. Incluye validación de datos con Joi, manejo centralizado de errores con middleware y persistencia estructurada a través de Sequelize.

## Características

- CRUD de categorías
- CRUD de productos
- CRUD de usuarios
- CRUD de clientes
- CRUD de pedidos
- Añadir ítems a pedidos
- Validación de entrada con Joi
- Manejo centralizado de errores con middleware
- Persistencia con PostgreSQL y Sequelize
- Soporte de paginación con `limit` y `offset`
- Configuración de entorno compatible con Docker Compose

## Tecnologías utilizadas

| Tecnología | Propósito |
| --- | --- |
| Node.js | Entorno de ejecución backend |
| Express | Framework HTTP para API REST |
| Sequelize | ORM para PostgreSQL |
| PostgreSQL | Base de datos relacional |
| pg / pg-hstore | Drivers de PostgreSQL |
| Joi | Validación de request params y body |
| @hapi/boom | Generación de errores HTTP consistentes |
| CORS | Configuración de orígenes permitidos |
| Docker Compose | Orquestación de servicios de base de datos |
| sequelize-cli | Migrations y administración de BD |
| ESLint / Prettier | Calidad y formato de código |

## Arquitectura

El proyecto está organizado en capas claras:

- `index.js`: arranque del servidor Express, configuración de CORS y middleware global.
- `routes/`: definición de rutas por recurso.
- `services/`: lógica de negocio y operaciones de base de datos.
- `schemas/`: validación de datos de requests con Joi.
- `middlewares/`: validación y manejo centralizado de errores.
- `db/models/`: definición de modelos Sequelize y asociaciones entre entidades.
- `libs/sequelize.js`: conexión y configuración de Sequelize.
- `db/migrations/`: scripts de migración para crear las tablas.

La API se monta bajo el prefijo `/api/v1`.

## Estructura de carpetas

```
.
├── config/
│   └── config.js                 # Configuración de entorno para la aplicación
├── db/
│   ├── config.cjs                # Configuración Sequelize para migraciones
│   ├── migrations/               # Migraciones Sequelize
│   └── models/                   # Modelos Sequelize y esquemas de tablas
├── libs/
│   ├── postgres.pool.js          # Pool PostgreSQL alternativo
│   └── sequelize.js              # Inicialización de Sequelize
├── middlewares/
│   ├── error.handler.js          # Middlewares de manejo de errores
│   └── validator.handler.js      # Middleware de validación con Joi
├── routes/
│   ├── categories.router.js
│   ├── customer.router.js
│   ├── orders.router.js
│   ├── products.router.js
│   ├── users.router.js
│   └── index.js                  # Enrutador principal con `/api/v1`
├── schemas/
│   ├── category.schema.js
│   ├── customer.schema.js
│   ├── order.schema.js
│   ├── product.schema.js
│   └── user.schema.js
├── services/
│   ├── category.service.js
│   ├── customers.service.js
│   ├── order.service.js
│   ├── product.service.js
│   └── user.service.js
├── docker-compose.yml            # Definición de contenedores Docker
├── index.js                      # Entrada principal de la aplicación
├── package.json
└── README.md
```

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <repositorio> my-store-data
   cd my-store-data
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno en un archivo `.env`.
4. Ejecutar migraciones:
   ```bash
   npm run db:migrate
   ```
5. Iniciar el servidor:
   ```bash
   npm run dev
   ```

## Configuración

El proyecto utiliza variables de entorno para configurar la conexión a la base de datos y el puerto del servidor.

### Variables de entorno

- `NODE_ENV`: entorno de ejecución (`dev`, `production`, etc.)
- `PORT`: puerto donde corre Express
- `DB_USER`: usuario de PostgreSQL
- `DB_PASSWORD`: contraseña de PostgreSQL
- `DB_HOST`: host de PostgreSQL
- `DB_NAME`: nombre de la base de datos PostgreSQL
- `DB_PORT`: puerto de PostgreSQL

> No identificado en el proyecto analizado: valores predeterminados exactos de variables de entorno en un archivo `.env`.

## Docker

El proyecto incluye un `docker-compose.yml` con los siguientes servicios:

- `postgres`
  - imagen: `postgres:13`
  - base de datos: `my_store`
  - usuario: `jefred`
  - contraseña: `admin123`
  - puerto local: `5433`
- `pgadmin4`
  - imagen: `dpage/pgadmin4`
  - email: `admin@mail.com`
  - password: `root`
  - puerto local: `5050`
- `mysql`
  - imagen: `mysql:latest`
  - base de datos: `my_store`
  - usuario: `jefred`
  - contraseña: `admin123`
  - puerto local: `3307`
- `phpmyadmin`
  - imagen: `phpmyadmin:latest`
  - puerto local: `8081`

### Levantar el entorno con Docker Compose

```bash
docker compose up -d
```

> Nota: aunque Docker Compose define servicios para MySQL y phpMyAdmin, el backend actual utiliza PostgreSQL como persistencia principal.

## Base de datos

La aplicación utiliza PostgreSQL y Sequelize. Las tablas definidas son:

- `users`
- `customers`
- `categories`
- `products`
- `orders`
- `orders_products`

### Entidades principales

- `User`
  - `id`, `email`, `password`, `role`, `create_at`
- `Customer`
  - `id`, `name`, `last_name`, `phone`, `user_id`, `created_at`
- `Category`
  - `id`, `name`, `image`, `created_at`
- `Product`
  - `id`, `name`, `image`, `description`, `price`, `category_id`, `created_at`
- `Order`
  - `id`, `customer_id`, `created_at`
- `OrderProduct`
  - `id`, `amount`, `order_id`, `product_id`, `created_at`

## Modelos y relaciones

### User

- Tabla: `users`
- Campos: `id`, `email`, `password`, `role`, `create_at`
- Relación: `hasOne(Customer)`

### Customer

- Tabla: `customers`
- Campos: `id`, `name`, `last_name`, `phone`, `user_id`, `created_at`
- Relaciones:
  - `belongsTo(User)`
  - `hasMany(Order)`

### Category

- Tabla: `categories`
- Campos: `id`, `name`, `image`, `created_at`
- Relación: `hasMany(Product)`

### Product

- Tabla: `products`
- Campos: `id`, `name`, `image`, `description`, `price`, `category_id`, `created_at`
- Relación: `belongsTo(Category)`

### Order

- Tabla: `orders`
- Campos: `id`, `customer_id`, `created_at`
- Relaciones:
  - `belongsTo(Customer)`
  - `belongsToMany(Product)` a través de `OrderProduct`
- Campo virtual:
  - `total` calculado desde los ítems del pedido

### OrderProduct

- Tabla: `orders_products`
- Campos: `id`, `amount`, `order_id`, `product_id`, `created_at`
- Función: tabla asociativa entre pedidos y productos

## Migraciones

Las migraciones se encuentran en `db/migrations/` y crean las tablas correspondientes a los modelos definidos en `db/models/`.

### Comandos de migración

- Ejecutar migraciones:
  ```bash
  npm run db:migrate
  ```
- Revertir la última migración:
  ```bash
  npm run db:migrate:undo
  ```
- Generar nueva migración:
  ```bash
  npm run migrations:generate -- <nombre-de-migracion>
  ```

> No se encontraron seeders en el proyecto analizado.

## API REST

La API está disponible en `/api/v1`.

### Endpoints documentados

#### Categorías

- `GET /api/v1/categories`
  - Descripción: lista categorías.
  - Query params: `limit`, `offset`.

- `GET /api/v1/categories/:id`
  - Descripción: obtiene una categoría por `id`.
  - Path params: `id`.

- `POST /api/v1/categories`
  - Descripción: crea una categoría.
  - Body esperado:
    ```json
    {
      "name": "Electrónica",
      "image": "https://example.com/image.png"
    }
    ```

- `PATCH /api/v1/categories/:id`
  - Descripción: actualiza una categoría.
  - Body parcial: `name`, `image`.

- `DELETE /api/v1/categories/:id`
  - Descripción: elimina una categoría.

#### Productos

- `GET /api/v1/products`
  - Descripción: lista productos.
  - Query params: `limit`, `offset`, `price`, `price_min`, `price_max`.

- `GET /api/v1/products/:id`
  - Descripción: obtiene un producto por `id`.

- `POST /api/v1/products`
  - Descripción: crea un producto.
  - Body esperado:
    ```json
    {
      "name": "Teclado mecánico",
      "price": 120,
      "description": "Teclado mecánico RGB para gaming.",
      "image": "https://example.com/keyboard.png",
      "categoryId": 1
    }
    ```

- `PATCH /api/v1/products/:id`
  - Descripción: actualiza un producto.
  - Body parcial: `name`, `price`, `description`, `image`, `categoryId`.

- `DELETE /api/v1/products/:id`
  - Descripción: elimina un producto.

#### Usuarios

- `GET /api/v1/users`
  - Descripción: lista usuarios.
  - Query params: `limit`, `offset`.

- `GET /api/v1/users/:id`
  - Descripción: obtiene un usuario por `id`.

- `POST /api/v1/users`
  - Descripción: crea un usuario.
  - Body esperado:
    ```json
    {
      "email": "admin@example.com",
      "password": "password123",
      "role": "admin"
    }
    ```

- `PATCH /api/v1/users/:id`
  - Descripción: actualiza un usuario.

- `DELETE /api/v1/users/:id`
  - Descripción: elimina un usuario.

#### Clientes

- `GET /api/v1/customers`
  - Descripción: lista clientes.
  - Query params: `limit`, `offset`.

- `POST /api/v1/customers`
  - Descripción: crea un cliente.
  - Body esperado:
    ```json
    {
      "name": "Carlos",
      "lastName": "Pérez",
      "phone": "123456789",
      "user": {
        "email": "carlos@example.com",
        "password": "secret123"
      }
    }
    ```
  - Nota: se puede enviar `userId` en lugar de `user` siempre que uno de los dos campos sea provisto.

- `PATCH /api/v1/customers/:id`
  - Descripción: actualiza un cliente.

- `DELETE /api/v1/customers/:id`
  - Descripción: elimina un cliente.

#### Pedidos

- `GET /api/v1/orders`
  - Descripción: lista pedidos.
  - Query params: `limit`, `offset`.

- `GET /api/v1/orders/:id`
  - Descripción: obtiene un pedido por `id`.

- `POST /api/v1/orders`
  - Descripción: crea un pedido.
  - Body esperado:
    ```json
    {
      "customerId": 1
    }
    ```

- `PATCH /api/v1/orders/:id`
  - Descripción: actualiza un pedido.

- `DELETE /api/v1/orders/:id`
  - Descripción: elimina un pedido.

- `POST /api/v1/orders/add-item`
  - Descripción: añade un ítem a un pedido.
  - Body esperado:
    ```json
    {
      "orderId": 1,
      "productId": 2,
      "amount": 3
    }
    ```

## Validaciones

Las validaciones se implementan mediante Joi en los esquemas de `schemas/`:

- `category.schema.js`
  - `name`: string 3-15 caracteres
  - `image`: URI
  - `limit`, `offset`: entero
- `product.schema.js`
  - `name`: string 3-15
  - `price`: entero mínimo 10
  - `description`: string 10-100
  - `image`: URI
  - `categoryId`: entero
  - `price_min` y `price_max`: rango condicional
- `user.schema.js`
  - `email`: email válido
  - `password`: mínimo 8 caracteres
  - `role`: string
- `order.schema.js`
  - `customerId`: entero requerido
  - `orderId`, `productId`, `amount`: entero requerido para `add-item`
- `customer.schema.js`
  - `name`, `lastName`, `phone`: strings
  - `userId`: entero
  - `user`: objeto con `email` y `password`
  - `xor('userId','user')`: exige una sola de las dos opciones

## Paginación

Los endpoints que soportan `limit` y `offset` son:

- `GET /api/v1/categories`
- `GET /api/v1/products`
- `GET /api/v1/users`
- `GET /api/v1/customers`
- `GET /api/v1/orders`

## Manejo de errores

El flujo de manejo de errores en `index.js` utiliza:

1. `logErrors`: registra el error en consola.
2. `ormErrorHandler`: captura errores de Sequelize (`ValidationError`) y responde con `409`.
3. `boomErrorHandler`: formatea errores `boom` con su status HTTP.
4. `errorHandler`: responde con `500` para errores no manejados.

## Scripts disponibles

Extraídos de `package.json`:

- `npm run dev`: ejecuta `node --env-file=.env --watch index.js`
- `npm start`: ejecuta `node --env-file=.env index.js`
- `npm run lint`: ejecuta `eslint`
- `npm run migrations:generate`: genera una migración con `sequelize-cli`
- `npm run db:migrate`: aplica migraciones
- `npm run db:migrate:undo`: revierte la última migración

## Flujo de desarrollo

1. Instalar dependencias.
2. Configurar variables de entorno en `.env`.
3. Levantar la base de datos con Docker Compose o una instancia local.
4. Ejecutar las migraciones con `npm run db:migrate`.
5. Iniciar el servidor con `npm run dev`.
6. Desarrollar en las capas de rutas, servicios, validaciones y modelos según corresponda.

## Consideraciones técnicas

- Separación clara entre rutas, servicios y modelos.
- Uso de Joi para validación de requests.
- Manejo centralizado de errores con middleware.
- Relaciones explícitas de Sequelize entre entidades.
- Transacciones utilizadas en el servicio de clientes para crear usuario y cliente juntos.
- API montada bajo `/api/v1`.

## Autor

Jefred Bedoya S.
