/**
 * CAPA DE RUTAS - ROLES
 * * Esta capa define las rutas HTTP y aplica los middlewares de validación
 * antes de llegar al controlador.
 */

import { Router } from 'express';
import { RoleController } from '../controllers/roles.controller.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';
import { RoleValidator } from '../validators/roles.validator.js';

const router = Router();
const role_controller = new RoleController();
const role_validator = new RoleValidator();

// GET /api/roles - Obtener todos los registros (sin validaciones)
router.get('/', role_controller.getAll);

// GET /api/roles/:id - Obtener un registro por ID (sin validaciones)
router.get('/:id', role_controller.getOne);

// POST /api/roles - Crear un nuevo registro
router.post(
  '/',
  ...role_validator.validateRole,      // Validaciones de campos
  validateFields,                      // Procesa errores
  role_validator.validateIfNameIsUse,  // Validación personalizada
  role_controller.created              // Controlador
);

// PUT /api/roles/:id - Actualizar un registro existente
router.put(
  '/:id',
  ...role_validator.validateRoleId,    // Valida ID URL
  ...role_validator.validateRole,      // Valida body
  validateFields,
  role_validator.validateIfNameIsUse,
  role_controller.updated
);

// DELETE /api/roles/:id - Eliminar un registro (soft delete)
router.delete(
  '/:id',
  ...role_validator.validateRoleId,
  validateFields,
  role_controller.deleted
);

export default router;