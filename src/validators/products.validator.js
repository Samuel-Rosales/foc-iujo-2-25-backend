/**
 * CAPA DE VALIDADORES - PRODUCTS
 */
import { ProductServices } from '../services/products.service.js';
import { CategoryServices } from '../services/categories.service.js';
import { AreaServices } from '../services/areas.service.js';
import { body, param } from 'express-validator';

class ProductValidator {
  validateProduct = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('name').isString().withMessage('El nombre debe ser texto'),
    
    body('price').notEmpty().withMessage('El precio es requerido'),
    body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    
    body('quantity').notEmpty().withMessage('La cantidad es requerida'),
    body('quantity').isInt({ min: 0 }).withMessage('La cantidad debe ser un entero positivo'),

    // Validar Clave Foránea: category_id
    body('category_id').notEmpty().withMessage('El category_id es requerido'),
    body('category_id').isInt().withMessage('Debe ser número'),
    body('category_id').custom(async (id) => {
        const { status } = await CategoryServices.getById(id);
        if (status === 404) throw new Error('El category_id no existe');
        return true;
    }),

    // Validar Clave Foránea: area_id
    body('area_id').notEmpty().withMessage('El area_id es requerido'),
    body('area_id').isInt().withMessage('Debe ser número'),
    body('area_id').custom(async (id) => {
        const { status } = await AreaServices.getById(id);
        if (status === 404) throw new Error('El area_id no existe');
        return true;
    }),
  ];

  validateProductId = [
    param('id').notEmpty().withMessage('El id es requerido'),
    param('id').isInt().withMessage('El id debe ser un número'),
    param('id').custom(async (id) => {
      if (!id || isNaN(Number(id))) throw new Error(`El id debe ser un número`);
      const { status } = await ProductServices.getById(Number(id));
      if (status === 404) throw new Error('El id no se encuentra');
      return true;
    }),
  ];

  /**
   * Validación Unicidad Compuesta: 
   * El nombre debe ser único DENTRO de la misma área.
   */
  validateIfNameIsUse = async (req, res, next) => {
    const { id } = req.params;
    const { name, area_id } = req.body;

    // Obtenemos todos los productos (Idealmente usar ProductServices.getByNameAndArea(name, area_id))
    const { data } = await ProductServices.getAll();
    
    // Buscamos si existe un producto con MISMO nombre y MISMA area
    const existingRecord = data.products ? data.products.find(p => 
        p.name === name && p.area_id === Number(area_id)
    ) : null;

    if (existingRecord) {
      if (!id) { // POST
        return res.status(400).json({ errors: [{ type: 'field', msg: `El producto '${name}' ya existe en esta área`, path: 'name', location: 'body' }] });
      } else { // PUT
        if (Number(id) !== existingRecord.id) {
            return res.status(400).json({ errors: [{ type: 'field', msg: `El producto '${name}' ya existe en esta área`, path: 'name', location: 'body' }] });
        }
      }
    }
    next();
  };
}

export { ProductValidator };