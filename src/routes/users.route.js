/**
 * CAPA DE RUTAS - USERS
 */

import { Router } from 'express';
import { UserController } from '../controllers/users.controller.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';
import { UserValidator } from '../validators/users.validator.js';

const router = Router();
const user_controller = new UserController();
const user_validator = new UserValidator();

// GET /api/users
router.get('/', user_controller.getAll);

// GET /api/users/:id
router.get('/:id', user_controller.getOne);

// POST /api/users
router.post(
  '/',
  ...user_validator.validateUser,
  validateFields,
  user_validator.validateIfEmailIsUse, // Nota: Validamos Email único
  user_controller.created
);

// PUT /api/users/:id
router.put(
  '/:id',
  ...user_validator.validateUserId,
  ...user_validator.validateUser,
  validateFields,
  user_validator.validateIfEmailIsUse,
  user_controller.updated
);

// DELETE /api/users/:id
router.delete(
  '/:id',
  ...user_validator.validateUserId,
  validateFields,
  user_controller.deleted
);

export default router;