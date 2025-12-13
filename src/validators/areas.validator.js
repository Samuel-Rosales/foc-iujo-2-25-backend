/**
 * CAPA DE VALIDADORES - AREAS
 */
import { AreaServices } from '../services/areas.service.js';
import { WarehouseServices } from '../services/warehouses.service.js';
import { body, param } from 'express-validator';

class AreaValidator {
  validateArea = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('name').isString().withMessage('El nombre debe ser una cadena de texto'),
    
    // Validación de Clave Foránea: warehouse_id
    body('warehouse_id').notEmpty().withMessage('El warehouse_id es requerido'),
    body('warehouse_id').isInt().withMessage('El warehouse_id debe ser un número'),
    body('warehouse_id').custom(async (warehouseId) => {
        const { status } = await WarehouseServices.getById(warehouseId);
        if (status === 404) throw new Error('El warehouse_id no existe');
        return true;
    }),
  ];

  validateAreaId = [
    param('id').notEmpty().withMessage('El id es requerido'),
    param('id').isInt().withMessage('El id debe ser un número'),
    param('id').custom(async (id) => {
      if (!id || isNaN(Number(id))) throw new Error(`El parámetro id debe ser un número`);
      const { status } = await AreaServices.getById(Number(id));
      if (status === 404) throw new Error('El id no se encuentra en los registros');
      return true;
    }),
  ];

  validateIfNameIsUse = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    // Reemplazar por AreaServices.getByName(name)
    const { data } = await AreaServices.getAll(); 
    const existingRecord = data.areas ? data.areas.find(a => a.name === name) : null;

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

export { AreaValidator };