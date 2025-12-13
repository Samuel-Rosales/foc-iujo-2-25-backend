/**
 * CAPA DE VALIDADORES - WAREHOUSES
 */
import { WarehouseServices } from '../services/warehouses.service.js';
import { body, param } from 'express-validator';

class WarehouseValidator {
  validateWarehouse = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('name').isString().withMessage('El nombre debe ser una cadena de texto'),
  ];

  validateWarehouseId = [
    param('id').notEmpty().withMessage('El id es requerido'),
    param('id').isInt().withMessage('El id debe ser un número'),
    param('id').custom(async (id) => {
      if (!id || isNaN(Number(id))) throw new Error(`El parámetro id debe ser un número`);
      const { status } = await WarehouseServices.getById(Number(id));
      if (status === 404) throw new Error('El id no se encuentra en los registros');
      return true;
    }),
  ];

  validateIfNameIsUse = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    // Lógica simplificada de búsqueda (Reemplazar por WarehouseServices.getByName(name))
    const { data } = await WarehouseServices.getAll();
    const existingRecord = data.warehouses ? data.warehouses.find(w => w.name === name) : null;

    if (existingRecord) {
      if (!id) {
        return res.status(400).json({ errors: [{ type: 'field', msg: `Nombre en uso: ${name}`, path: 'name', location: 'body' }] });
      } else if (Number(id) !== existingRecord.id) {
        return res.status(400).json({ errors: [{ type: 'field', msg: `Nombre en uso: ${name}`, path: 'name', location: 'body' }] });
      }
    }
    next();
  };
}

export { WarehouseValidator };