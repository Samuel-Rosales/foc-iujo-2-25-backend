/**
 * CAPA DE RUTAS - WAREHOUSES
 */

import { Router } from 'express';
import { WarehouseController } from '../controllers/warehouses.controller.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';
import { WarehouseValidator } from '../validators/warehouses.validator.js';

const router = Router();
const warehouse_controller = new WarehouseController();
const warehouse_validator = new WarehouseValidator();

// GET /api/warehouses
router.get('/', warehouse_controller.getAll);

// GET /api/warehouses/:id
router.get('/:id', warehouse_controller.getOne);

// POST /api/warehouses
router.post(
  '/',
  ...warehouse_validator.validateWarehouse,
  validateFields,
  warehouse_validator.validateIfNameIsUse,
  warehouse_controller.created
);

// PUT /api/warehouses/:id
router.put(
  '/:id',
  ...warehouse_validator.validateWarehouseId,
  ...warehouse_validator.validateWarehouse,
  validateFields,
  warehouse_validator.validateIfNameIsUse,
  warehouse_controller.updated
);

// DELETE /api/warehouses/:id
router.delete(
  '/:id',
  ...warehouse_validator.validateWarehouseId,
  validateFields,
  warehouse_controller.deleted
);

export default router;