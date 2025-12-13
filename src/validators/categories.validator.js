/**
 * CAPA DE VALIDADORES - CATEGORIES
 */
import { CategoryServices } from '../services/categories.service.js';
import { body, param } from 'express-validator';

class CategoryValidator {
    
  validateCategory = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('name').isString().withMessage('El nombre debe ser una cadena de texto'),
  ];

  validateCategoryId = [
    param('id').notEmpty().withMessage('El id es requerido'),
    param('id').isInt().withMessage('El id debe ser un número'),
    param('id').custom(async (id) => {
      if (!id || isNaN(Number(id))) throw new Error(`El parámetro id debe ser un número`);
      const { status } = await CategoryServices.getById(Number(id));
      if (status === 404) throw new Error('El id no se encuentra en los registros');
      return true;
    }),
  ];

  validateIfNameIsUse = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    
    // Nota: Debes implementar getByName en CategoryServices
    // O usar prisma directamente aquí si prefieres no tocar el servicio
    const { status, data } = await CategoryServices.getAll(); // Usamos getAll y filtramos temporalmente si no existe getByName
    
    // Simulamos getByName buscando en el array (Idealmente crear método getByName en servicio)
    const existingRecord = data.categories ? data.categories.find(c => c.name === name) : null;
    
    if (existingRecord) {
      if (!id) { // POST
        return res.status(400).json({
            errors: [{ type: 'field', msg: `Nombre en uso: ${name}`, path: 'name', location: 'body' }]
        });
      } else { // PUT
        if (Number(id) !== existingRecord.id) {
            return res.status(400).json({
                errors: [{ type: 'field', msg: `Nombre en uso: ${name}`, path: 'name', location: 'body' }]
            });
        }
      }
    }
    next();
  };
}

export { CategoryValidator };