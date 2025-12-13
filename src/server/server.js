import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

// Importación de Rutas
import testRoutes from '../routes/test.route.js';
import rolesRoutes from '../routes/roles.route.js';
import userRoutes from '../routes/users.route.js';
import categoriesRoutes from '../routes/categories.route.js';
import warehousesRoutes from '../routes/warehouses.route.js';
import areasRoutes from '../routes/areas.route.js';
import productsRoutes from '../routes/products.routes.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class Servidor {
  app;
  port;

  constructor() {
    this.app = express();
    this.port = process.env.API_PORT || 3800;
    this.pre = '/api/v1';

    this.middlewares();

    // Definición de rutas base
    this.rutas = {
      test: `${this.pre}/test`,
      roles: `${this.pre}/roles`,
      users: `${this.pre}/users`,
      categories: `${this.pre}/categories`,
      warehouses: `${this.pre}/warehouses`,
      areas: `${this.pre}/areas`,
      products: `${this.pre}/products`,
    };

    this.routes();
  }

  middlewares = () => {
    this.app.use(cors())
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  routes = () => {
    this.app.use(this.rutas.test, testRoutes);
    this.app.use(this.rutas.roles, rolesRoutes);
    this.app.use(this.rutas.users, userRoutes);
    this.app.use(this.rutas.categories, categoriesRoutes);
    this.app.use(this.rutas.warehouses, warehousesRoutes);
    this.app.use(this.rutas.areas, areasRoutes);
    this.app.use(this.rutas.products, productsRoutes);
  }

  listen = () => {
    this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`);
      // Log opcional para ver las rutas activas al iniciar
      console.log(`Endpoints disponibles en ${this.pre}/...`);
    })
  }
}

/*
 ===========================================================================
 📚 DOCUMENTACIÓN DE ENDPOINTS Y BODY REQUERIDO (COPIAR Y PEGAR)
 ===========================================================================

 ---------------------------------------------------------------------------
 1. ROLES
 ---------------------------------------------------------------------------
 Ruta Base: /api/v1/roles

 [GET] /api/v1/roles
 - Descripción: Listar todos los roles.
 - Body: No requiere.

 [POST] /api/v1/roles
 - Descripción: Crear un nuevo rol.
 - Body (JSON):
   {
     "name": "Admin"  // Requerido, String, Único
   }

 [PUT] /api/v1/roles/:id
 - Descripción: Actualizar un rol existente.
 - Body (JSON):
   {
     "name": "SuperAdmin"
   }

 [DELETE] /api/v1/roles/:id
 - Descripción: Eliminación lógica (soft delete).
 - Body: No requiere.

 ---------------------------------------------------------------------------
 2. CATEGORIES (Categorías)
 ---------------------------------------------------------------------------
 Ruta Base: /api/v1/categories

 [GET] /api/v1/categories
 - Descripción: Listar categorías.
 - Body: No requiere.

 [POST] /api/v1/categories
 - Descripción: Crear categoría.
 - Body (JSON):
   {
     "name": "Electrónica" // Requerido, String, Único
   }

 ---------------------------------------------------------------------------
 3. WAREHOUSES (Almacenes)
 ---------------------------------------------------------------------------
 Ruta Base: /api/v1/warehouses

 [GET] /api/v1/warehouses
 - Descripción: Listar almacenes.
 - Body: No requiere.

 [POST] /api/v1/warehouses
 - Descripción: Crear almacén.
 - Body (JSON):
   {
     "name": "Almacén Central" // Requerido, String, Único
   }

 ---------------------------------------------------------------------------
 4. USERS (Usuarios)
 ---------------------------------------------------------------------------
 Ruta Base: /api/v1/users

 [GET] /api/v1/users
 - Descripción: Listar usuarios.
 - Body: No requiere.

 [POST] /api/v1/users
 - Descripción: Crear usuario.
 - Body (JSON):
   {
     "name": "Juan Pérez",      // Requerido
     "email": "juan@mail.com",  // Requerido, Email Válido, Único
     "password": "123456",      // Requerido, min 6 chars
     "role_id": 1               // Requerido, Number (Debe existir en roles)
   }

 ---------------------------------------------------------------------------
 5. AREAS (Áreas de Almacén)
 ---------------------------------------------------------------------------
 Ruta Base: /api/v1/areas

 [GET] /api/v1/areas
 - Descripción: Listar áreas (incluye info del warehouse).
 - Body: No requiere.

 [POST] /api/v1/areas
 - Descripción: Crear área.
 - Body (JSON):
   {
     "name": "Zona de Carga", // Requerido, String
     "warehouse_id": 1        // Requerido, Number (Debe existir en warehouses)
   }

 ---------------------------------------------------------------------------
 6. PRODUCTS (Productos)
 ---------------------------------------------------------------------------
 Ruta Base: /api/v1/products

 [GET] /api/v1/products
 - Descripción: Listar productos (incluye categoria y área).
 - Body: No requiere.

 [POST] /api/v1/products
 - Descripción: Crear producto.
 - Body (JSON):
   {
     "name": "Laptop HP",  // Requerido
     "price": 1200.50,     // Requerido, Number > 0
     "quantity": 10,       // Requerido, Int > 0
     "category_id": 1,     // Requerido, Number (Debe existir en categories)
     "area_id": 2          // Requerido, Number (Debe existir en areas)
   }
   Nota: El par (name, area_id) debe ser único.

 ===========================================================================
*/