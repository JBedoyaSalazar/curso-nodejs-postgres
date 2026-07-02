# My Store

Backend REST API para una tienda. El proyecto gestiona usuarios, clientes, categorias, productos y pedidos con Express, Sequelize y PostgreSQL.

## Objetivo

El objetivo del proyecto es exponer una API modular para practicar y organizar un backend Node.js con:

- Rutas REST por recurso.
- Servicios para operaciones de negocio y persistencia.
- Modelos y migraciones con Sequelize.
- Validacion de requests con Joi.
- Autenticacion con Passport, JWT y estrategia local.
- Manejo centralizado de errores con middlewares de Express.

## Tecnologias Utilizadas

- Node.js con modulos ES.
- Express para el servidor HTTP.
- PostgreSQL como base de datos principal.
- Sequelize y Sequelize CLI para modelos, asociaciones y migraciones.
- Joi para validacion de `body`, `params` y `query`.
- Passport, `passport-local` y `passport-jwt` para autenticacion.
- JSON Web Token para emision y verificacion de tokens.
- bcrypt para hashing y verificacion de passwords.
- Nodemailer para envio de correo de recuperacion.
- @hapi/boom para errores HTTP.
- cors para configuracion de origenes permitidos.
- Docker Compose para levantar PostgreSQL y pgAdmin.
- ESLint y Prettier como herramientas de calidad/formato.

## Arquitectura Observada

La aplicacion esta organizada por capas:

- `index.js`: crea la aplicacion Express, configura JSON, CORS, rutas globales y middlewares de error.
- `routes/`: define routers Express por recurso y monta la API bajo `/api/v1`.
- `services/`: concentra las operaciones sobre modelos Sequelize y logica de autenticacion.
- `schemas/`: contiene esquemas Joi para validar entradas HTTP.
- `middlewares/`: contiene validacion, autorizacion simple y manejo de errores.
- `db/models/`: define modelos Sequelize y asociaciones.
- `db/migrations/`: contiene migraciones Sequelize CLI.
- `libs/`: contiene la instancia Sequelize y un pool PostgreSQL.
- `utils/auth/`: registra estrategias Passport local y JWT.
- `examples/`: scripts aislados para probar bcrypt, JWT y Nodemailer.

## Estructura de Carpetas

```text
.
├── config/
│   └── config.js
├── db/
│   ├── config.cjs
│   ├── migrations/
│   └── models/
├── examples/
├── libs/
│   ├── postgres.pool.js
│   └── sequelize.js
├── middlewares/
│   ├── auth.handler.js
│   ├── error.handler.js
│   └── validator.handler.js
├── routes/
│   ├── auth.router.js
│   ├── categories.router.js
│   ├── customer.router.js
│   ├── index.js
│   ├── orders.router.js
│   ├── products.router.js
│   ├── profile.router.js
│   └── users.router.js
├── schemas/
├── services/
├── docker-compose.yml
├── frontend.html
├── index.js
├── package.json
├── Procfile
└── README.md
```

## Requisitos

- Node.js `>=18.11`.
- npm.
- PostgreSQL accesible desde las variables de entorno.
- Docker y Docker Compose, opcionalmente, para levantar PostgreSQL y pgAdmin con `docker-compose.yml`.

## Instalacion

```bash
npm install
```

Crear un archivo `.env` basado en `.env.example` y completar las variables necesarias para la base de datos y las funcionalidades usadas.

Aplicar migraciones:

```bash
npm run db:migrate
```

## Variables de Entorno

Variables leidas por `config/config.js`:

- `NODE_ENV`: entorno de ejecucion. Por defecto usa `dev`.
- `PORT`: puerto del servidor. Por defecto usa `3000`.
- `DB_USER`: usuario de PostgreSQL.
- `DB_PASSWORD`: password de PostgreSQL.
- `DB_HOST`: host de PostgreSQL.
- `DB_NAME`: nombre de la base de datos.
- `DB_PORT`: puerto de PostgreSQL.
- `API_KEY`: clave usada por el middleware `checkApiKey` en `/nueva-ruta`.
- `JWT_SECRET`: secreto para firmar y verificar JWT.
- `SMTP_HOST`: host SMTP para Nodemailer.
- `SMTP_PORT`: puerto SMTP.
- `SMTP_USER`: usuario SMTP.
- `SMTP_PASSWORD`: password SMTP.
- `SMTP_FROM`: remitente del correo de recuperacion.
- `SMTP_TO`: destinatario usado por el ejemplo `examples/nodemailer.js`.

Variables adicionales leidas por `db/config.cjs` para Sequelize CLI:

- `DATABASE_URL`: URL completa de conexion, si se prefiere sobre `DB_*`.
- `DB_SSL`: cuando vale `true`, habilita SSL en configuracion de produccion.

El archivo `.env.example` incluido actualmente declara:

```env
PORT=3000
DB_USER=''
DB_PASSWORD=''
DB_HOST=''
DB_NAME=''
DB_PORT=''
```

## Scripts Disponibles

- `npm run dev`: ejecuta `node --env-file=.env --watch index.js`.
- `npm start`: ejecuta `node --env-file=.env index.js`.
- `npm run lint`: ejecuta ESLint.
- `npm run migrations:generate -- <nombre>`: genera una migracion con Sequelize CLI.
- `npm run db:migrate`: aplica migraciones pendientes.
- `npm run db:migrate:undo`: revierte la ultima migracion aplicada.

## Ejecucion

Levantar base de datos con Docker Compose, si se usa el archivo incluido:

```bash
docker compose up -d
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

Ejecutar en modo normal:

```bash
npm start
```

El servidor monta la API en `/api/v1`. Tambien existen dos rutas fuera de ese prefijo:

- `GET /`: responde un texto simple.
- `GET /nueva-ruta`: usa el middleware `checkApiKey` y espera el header `api`.

## Docker Compose

`docker-compose.yml` define:

- `postgres`: imagen `postgres:13`, base `my_store`, usuario `jefred`, password `admin123`, puerto local `5433`.
- `pgadmin4`: imagen `dpage/pgadmin4`, email `admin@mail.com`, password `root`, puerto local `5050`.

## Flujo General de la API

1. `index.js` crea la aplicacion Express.
2. Se habilita `express.json()`.
3. Se configura CORS con una lista blanca.
4. Se registran estrategias Passport desde `utils/auth/index.js`.
5. `routerApi(app)` monta los routers bajo `/api/v1`.
6. Las rutas validan entradas con `validatorHandler` cuando corresponde.
7. Los servicios consultan o modifican modelos Sequelize.
8. Los errores pasan por `logErrors`, `ormErrorHandler`, `boomErrorHandler` y `errorHandler`.

## Endpoints Implementados

### Auth

- `POST /api/v1/auth/login`: autentica con Passport local usando `email` y `password`; devuelve `user` y `token`.
- `POST /api/v1/auth/recovery`: recibe `email`, genera token de recuperacion y envia correo con Nodemailer.
- `POST /api/v1/auth/change-password`: recibe `token` y `newPassword`; valida el token de recuperacion y actualiza el password.

### Profile

- `GET /api/v1/profile/my-orders`: requiere JWT y lista pedidos asociados al usuario autenticado.

### Products

- `GET /api/v1/products`: lista productos con categoria. Soporta `limit`, `offset`, `price`, `price_min` y `price_max`.
- `GET /api/v1/products/:id`: obtiene un producto con categoria.
- `POST /api/v1/products`: crea un producto.
- `PATCH /api/v1/products/:id`: actualiza un producto.
- `DELETE /api/v1/products/:id`: elimina un producto.

### Categories

Estas rutas usan JWT y validacion de roles:

- `GET /api/v1/categories`: roles `admin` o `customer`.
- `GET /api/v1/categories/:id`: roles `admin` o `customer`.
- `POST /api/v1/categories`: rol `admin`.
- `PATCH /api/v1/categories/:id`: roles `admin` o `seller`.
- `DELETE /api/v1/categories/:id`: rol `admin`.

### Users

- `GET /api/v1/users`: lista usuarios con cliente asociado cuando existe. Soporta `limit` y `offset`.
- `GET /api/v1/users/:id`: obtiene un usuario por id.
- `POST /api/v1/users`: crea un usuario y hashea el password.
- `PATCH /api/v1/users/:id`: actualiza un usuario.
- `DELETE /api/v1/users/:id`: elimina un usuario.

### Customers

- `GET /api/v1/customers`: lista clientes con usuario asociado. Soporta `limit` y `offset`.
- `POST /api/v1/customers`: crea un cliente. El esquema Joi acepta `userId` o un objeto `user`; el servicio actual crea cliente y usuario dentro de una transaccion cuando recibe `user`.
- `PATCH /api/v1/customers/:id`: actualiza un cliente.
- `DELETE /api/v1/customers/:id`: elimina un cliente.

### Orders

- `GET /api/v1/orders`: lista pedidos con cliente, usuario e items. Soporta `limit` y `offset`.
- `GET /api/v1/orders/:id`: obtiene un pedido con cliente, usuario e items.
- `POST /api/v1/orders`: crea un pedido para un `customerId`.
- `PATCH /api/v1/orders/:id`: actualiza el `customerId` de un pedido.
- `DELETE /api/v1/orders/:id`: elimina un pedido.
- `POST /api/v1/orders/add-item`: agrega un producto a un pedido mediante `orderId`, `productId` y `amount`.

## Modelos y Relaciones

- `User`: tabla `users`; tiene `email`, `password`, `recoveryToken`, `role` y `createdAt`. Relacion `hasOne(Customer)` como `customer`.
- `Customer`: tabla `customers`; pertenece a `User` como `user` y tiene muchos `Order` como `orders`.
- `Category`: tabla `categories`; tiene muchos `Product` como `products`.
- `Product`: tabla `products`; pertenece a `Category` como `category`.
- `Order`: tabla `orders`; pertenece a `Customer` como `customer` y pertenece a muchos `Product` como `items` mediante `OrderProduct`.
- `OrderProduct`: tabla `orders_products`; tabla intermedia entre pedidos y productos.

`Order` incluye el campo virtual `total`, calculado cuando los `items` estan cargados.

## Middlewares Implementados

- `validatorHandler(schema, property)`: valida `req.body`, `req.params` o `req.query` con Joi y envia errores `400` usando Boom.
- `checkApiKey`: compara el header `api` contra `config.apiKey`.
- `checkAdminRole`: permite continuar solo a usuarios con rol `admin`.
- `checkRoles(...roles)`: permite continuar solo si `req.user.role` esta dentro de los roles permitidos.
- `logErrors`: registra errores en consola.
- `ormErrorHandler`: convierte `Sequelize.ValidationError` en respuesta `409`.
- `boomErrorHandler`: responde errores Boom con su `statusCode` y payload.
- `errorHandler`: fallback que responde `500`.

## Validaciones con Joi

- `user.schema.js`: valida `email`, `password`, `role`, `id`, paginacion y cambio de password.
- `customer.schema.js`: valida datos de cliente, `userId` u objeto `user`, y paginacion.
- `product.schema.js`: valida producto, filtros de precio y paginacion.
- `category.schema.js`: valida categoria y paginacion.
- `order.schema.js`: valida creacion/actualizacion de pedidos, `add-item` y paginacion.

## Configuracion de CORS

`index.js` define una lista blanca con:

- `http://localhost:8080`
- `https://myapp.co`

Tambien permite requests sin `origin`. Si el origen no esta permitido, CORS llama el callback con `new Error('no permitido')`.

## Manejo de Errores

El orden de middlewares de error registrado en `index.js` es:

1. `logErrors`
2. `ormErrorHandler`
3. `boomErrorHandler`
4. `errorHandler`

Los servicios usan `boom.notFound`, `boom.unauthorized` o `boom.forbidden` en varios flujos. Las validaciones Joi se transforman en `boom.badRequest`.

## Dependencias Principales

- `express`: servidor y routing HTTP.
- `sequelize`: ORM usado por modelos y servicios.
- `pg` y `pg-hstore`: soporte PostgreSQL.
- `joi`: validacion de datos de entrada.
- `@hapi/boom`: errores HTTP consistentes.
- `bcrypt`: hashing y comparacion de passwords.
- `jsonwebtoken`: firma y verificacion de JWT.
- `passport`, `passport-local`, `passport-jwt`: autenticacion local y por bearer token.
- `nodemailer`: envio de correo para recuperacion de password.
- `cors`: control de origenes permitidos.
- `@faker-js/faker`: dependencia instalada, sin uso observado en el codigo fuente actual.

## Migraciones

Las migraciones existentes:

- `20260605174638-initial-schema.js`: crea tablas principales.
- `20260702214428-recoveryToken.js`: agrega `recovery_token` a `users`.

No se observaron seeders en la estructura actual.

## Recomendaciones Futuras

Estas son mejoras posibles identificadas durante la revision; no representan funcionalidades actuales:

- Completar `.env.example` con todas las variables leidas por `config/config.js`.
- Revisar el flujo de `CustomerService.create` para alinear la implementacion con el esquema que permite `userId` u objeto `user`.
- Evitar que `validatorHandler` continue la cadena despues de enviar un error de validacion.
- Proteger de forma consistente los endpoints que deban requerir autenticacion.
- Agregar pruebas automatizadas para servicios, middlewares y rutas.
- Revisar codigos de respuesta en operaciones `DELETE`, que actualmente responden `201` en varias rutas.
- Remover logs de depuracion en handlers finales si se prepara para produccion.

## Licencia

MIT.
