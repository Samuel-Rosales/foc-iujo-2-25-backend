/**
 * CAPA DE RUTAS - TEST
 * 
 * Esta capa define las rutas HTTP y aplica los middlewares de validación
 * antes de llegar al controlador.
 * 
 * Flujo de una petición:
 * 1. La ruta recibe la petición HTTP
 * 2. Se ejecutan los validadores (si existen)
 * 3. Se ejecuta el middleware validateFields para procesar errores
 * 4. Se ejecutan validaciones personalizadas (si existen)
 * 5. Finalmente se ejecuta el controlador
 */

import { Router } from 'express';
import { TestController } from '../controllers/test.controller.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';
import { TestValidator } from '../validators/test.validator.js';

const router = Router();
const test_controller = new TestController();
const test_validator = new TestValidator();

// GET /api/v1/test - Obtener todos los registros (sin validaciones)
router.get('/', test_controller.getAll);

// GET /api/v1/test/:id - Obtener un registro por ID (sin validaciones)
router.get('/:id', test_controller.getOne);

// POST /api/v1/test - Crear un nuevo registro
// 1. Valida que el campo 'name' exista y sea string
// 2. Procesa los errores de validación
// 3. Verifica que el nombre no esté en uso
// 4. Ejecuta el controlador para crear el registro
router.post(
  '/',
  ...test_validator.validateTest,  // Validaciones de campos con express-validator
  validateFields,                     // Middleware que procesa los errores de validación
  test_validator.validateIfNameIsUse, // Validación personalizada: verifica nombre único
  test_controller.created,            // Controlador que ejecuta la lógica de negocio
);

// PUT /api/v1/test/:id - Actualizar un registro existente
// 1. Valida que el ID exista y sea número válido
// 2. Valida que el campo 'name' exista y sea string
// 3. Procesa los errores de validación
// 4. Verifica que el nombre no esté en uso (excepto para el registro actual)
// 5. Ejecuta el controlador para actualizar el registro
router.put(
  '/:id',
  ...test_validator.validateTestId,  // Valida el parámetro ID de la URL
  ...test_validator.validateTest,   // Valida los campos del body
  validateFields,                    // Procesa errores de validación
  test_validator.validateIfNameIsUse, // Verifica nombre único (permite el mismo nombre del registro actual)
  test_controller.updated,          // Controlador que ejecuta la actualización
);

// DELETE /api/v1/test/:id - Eliminar un registro (soft delete)
// 1. Valida que el ID exista y sea número válido
// 2. Procesa los errores de validación
// 3. Ejecuta el controlador para eliminar (marcar como inactivo) el registro
router.delete(
  '/:id',
  ...test_validator.validateTestId, // Valida el parámetro ID
  validateFields,                   // Procesa errores de validación
  test_controller.deleted,           // Controlador que ejecuta la eliminación lógica
);

export default router;
