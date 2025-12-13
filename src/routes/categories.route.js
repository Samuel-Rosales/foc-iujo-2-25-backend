/**
 * CAPA DE RUTAS - CATEGORIES
 */

import { Router } from 'express';
import { CategoryController } from '../controllers/categories.controller.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';
import { CategoryValidator } from '../validators/categories.validator.js';

const router = Router();
const category_controller = new CategoryController();
const category_validator = new CategoryValidator();

// GET /api/categories
router.get('/', category_controller.getAll);

// GET /api/categories/:id
router.get('/:id', category_controller.getOne);

// POST /api/categories
router.post(
  '/',
  ...category_validator.validateCategory,
  validateFields,
  category_validator.validateIfNameIsUse,
  category_controller.created
);

// PUT /api/categories/:id
router.put(
  '/:id',
  ...category_validator.validateCategoryId,
  ...category_validator.validateCategory,
  validateFields,
  category_validator.validateIfNameIsUse,
  category_controller.updated
);

// DELETE /api/categories/:id
router.delete(
  '/:id',
  ...category_validator.validateCategoryId,
  validateFields,
  category_controller.deleted
);

export default router;