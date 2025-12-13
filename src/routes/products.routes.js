/**
 * CAPA DE RUTAS - PRODUCTS
 */

import { Router } from 'express';
import { ProductController } from '../controllers/products.controller.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';
import { ProductValidator } from '../validators/products.validator.js';

const router = Router();
const product_controller = new ProductController();
const product_validator = new ProductValidator();

// GET /api/products
router.get('/', product_controller.getAll);

// GET /api/products/:id
router.get('/:id', product_controller.getOne);

// POST /api/products
router.post(
  '/',
  ...product_validator.validateProduct,
  validateFields,
  product_validator.validateIfNameIsUse, // Valida unicidad (Nombre + Area)
  product_controller.created
);

// PUT /api/products/:id
router.put(
  '/:id',
  ...product_validator.validateProductId,
  ...product_validator.validateProduct,
  validateFields,
  product_validator.validateIfNameIsUse,
  product_controller.updated
);

// DELETE /api/products/:id
router.delete(
  '/:id',
  ...product_validator.validateProductId,
  validateFields,
  product_controller.deleted
);

export default router;