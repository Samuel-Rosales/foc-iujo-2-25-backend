/**
 * CAPA DE RUTAS - AREAS
 */

import { Router } from 'express';
import { AreaController } from '../controllers/areas.controller.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';
import { AreaValidator } from '../validators/areas.validator.js';

const router = Router();
const area_controller = new AreaController();
const area_validator = new AreaValidator();

// GET /api/areas
router.get('/', area_controller.getAll);

// GET /api/areas/:id
router.get('/:id', area_controller.getOne);

// POST /api/areas
router.post(
  '/',
  ...area_validator.validateArea,
  validateFields,
  area_validator.validateIfNameIsUse,
  area_controller.created
);

// PUT /api/areas/:id
router.put(
  '/:id',
  ...area_validator.validateAreaId,
  ...area_validator.validateArea,
  validateFields,
  area_validator.validateIfNameIsUse,
  area_controller.updated
);

// DELETE /api/areas/:id
router.delete(
  '/:id',
  ...area_validator.validateAreaId,
  validateFields,
  area_controller.deleted
);

export default router;