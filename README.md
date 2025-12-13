#📦 API REST - Sistema de Gestión de InventarioEste repositorio contiene la implementación del Backend para el sistema de gestión de inventario, desarrollado bajo una arquitectura por capas estricta utilizando **Node.js**, **Express** y **Prisma ORM** con **PostgreSQL**.

El proyecto cumple con los requisitos de utilizar **JavaScript (ES Modules)** puro sin TypeScript y sin Swagger, implementando validaciones robustas y manejo de claves foráneas.

##📋 Descripción GeneralLa API expone endpoints CRUD completos para gestionar las entidades del negocio, organizadas por niveles de dependencia:

* **Nivel 1:** Roles, Categorías, Almacenes (Sin dependencias).
* **Nivel 2:** Usuarios, Áreas (Dependen de Nivel 1).
* **Nivel 3:** Productos (Dependen de Nivel 2 y 1).

Se implementa un **Soft Delete** (eliminación lógica) en todas las entidades y una estructura de respuesta JSON estandarizada obligatoria para la integración con el frontend.

##🛠️ Tecnologías Requeridas* 
**Node.js** (v18+) 


* 
**Express.js** - Framework web 


* 
**Prisma** - ORM para gestión de base de datos 


* 
**PostgreSQL** - Base de datos relacional 


* 
**express-validator** - Middleware de validaciones 


* 
**JavaScript (ES Modules)** - Lenguaje base 



##🚀 Instalación y ConfiguraciónSigue estos pasos para levantar el proyecto localmente .

###1. Clonar e Instalar```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_CARPETA>
npm install

```

###2. Variables de EntornoCrea un archivo `.env` en la raíz del proyecto basándote en el ejemplo proporcionado:

```bash
cp .env.example .env

```

Edita el archivo `.env` con tus credenciales de PostgreSQL:

```env
API_PORT=3800
DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_db?schema=public"

```

###3. Base de Datos (Prisma)Ejecuta las migraciones para crear las tablas en tu base de datos local:

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones (Crea tablas roles, users, products, etc.)
npm run prisma:migrate

```

###4. Ejecutar el Servidor* **Modo Desarrollo** (con recarga automática):
```bash
npm run dev

```


* **Modo Producción**:
```bash
npm start

```



La API estará disponible en: `http://localhost:3800/api/v1`

##📂 Estructura del ProyectoEl proyecto sigue una arquitectura por capas estricta:

```text
src/
├── app.js                   # Configuración de Express
├── servidor/
│   └── server.js            # Punto de entrada y arranque del servidor
├── config/
│   └── prisma.config.js     # Instancia del cliente Prisma
├── rutas/                   # Definición de endpoints
│   ├── roles.rutas.js
│   ├── categories.rutas.js
│   ├── warehouses.rutas.js
│   ├── users.rutas.js
│   ├── areas.rutas.js
│   └── products.rutas.js
├── controladores/           # Manejo de peticiones HTTP (req, res)
│   └── *.controladores.js
├── servicios/               # Lógica de negocio y consultas a BD
│   └── *.servicios.js
├── validators/              # Reglas de validación (express-validator)
│   └── *.validator.js
└── middlewares/
    └── validate-fields.middleware.js # Manejador de errores de validación

```

##📡 Documentación de Endpoints**Regla Obligatoria:** Todos los endpoints retornan la siguiente estructura JSON:

```json
{
  "message": "Descripción de la operación",
  "data": { ... }
}

```

*El código de estado HTTP (200, 201, 404, etc.) se envía en el encabezado, no en el cuerpo del JSON.*

###1. Roles (Nivel 1)| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/v1/roles` | Listar todos los roles |
| `GET` | `/api/v1/roles/:id` | Obtener rol por ID |
| `POST` | `/api/v1/roles` | Crear rol (`name` único) |
| `PUT` | `/api/v1/roles/:id` | Actualizar rol |
| `DELETE` | `/api/v1/roles/:id` | Soft delete del rol |

###2. Categorías (Nivel 1)| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/v1/categories` | Listar categorías |
| `POST` | `/api/v1/categories` | Crear categoría (`name` único) |
| `PUT` | `/api/v1/categories/:id` | Actualizar categoría |
| `DELETE` | `/api/v1/categories/:id` | Soft delete |

###3. Almacenes / Warehouses (Nivel 1)| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/v1/warehouses` | Listar almacenes |
| `POST` | `/api/v1/warehouses` | Crear almacén (`name` único) |
| `PUT` | `/api/v1/warehouses/:id` | Actualizar almacén |
| `DELETE` | `/api/v1/warehouses/:id` | Soft delete |

###4. Usuarios / Users (Nivel 2)Depende de: `Roles`.
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/v1/users` | Listar usuarios |
| `POST` | `/api/v1/users` | Crear usuario (Requiere `role_id` válido) |
| `PUT` | `/api/v1/users/:id` | Actualizar usuario |
| `DELETE`| `/api/v1/users/:id` | Soft delete |

###5. Áreas (Nivel 2)Depende de: `Warehouses`.
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/v1/areas` | Listar áreas (Incluye info de Warehouse) |
| `POST` | `/api/v1/areas` | Crear área (Requiere `warehouse_id` válido) |
| `PUT` | `/api/v1/areas/:id` | Actualizar área |
| `DELETE`| `/api/v1/areas/:id` | Soft delete |

###6. Productos (Nivel 3)Depende de: `Categories` y `Areas`.
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/v1/products` | Listar productos (Incluye categoría y área) |
| `POST` | `/api/v1/products` | Crear producto (Requiere `category_id`, `area_id`) |
| `PUT` | `/api/v1/products/:id`| Actualizar producto |
| `DELETE`| `/api/v1/products/:id`| Soft delete |

Nota: Existe una restricción de unicidad compuesta: El nombre del producto debe ser único dentro de la misma área.

##✅ ValidacionesSe utiliza `express-validator` en la capa de `validators/` para asegurar la integridad de los datos antes de llegar al controlador:

* Campos requeridos y tipos de datos (String, Int, Email).
* Validación de existencia de Claves Foráneas (`role_id`, `category_id`, etc.).
* Validación de unicidad (Nombres y Emails).

##📄 Scripts Disponibles* `npm run dev`: Inicia el servidor de desarrollo con Nodemon.
* `npm start`: Inicia el servidor en modo producción.
* `npm run prisma:generate`: Actualiza el cliente de Prisma si hay cambios en el schema.
* `npm run prisma:migrate`: Aplica cambios de esquema a la base de datos SQL.
* `npm run prisma:studio`: Abre una interfaz visual para explorar la base de datos.