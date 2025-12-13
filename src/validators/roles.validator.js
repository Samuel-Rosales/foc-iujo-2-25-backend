/**
 * CAPA DE VALIDADORES - ROLES
 */
import { RoleServices } from '../services/roles.service.js';
import { body, param } from 'express-validator';

class RoleValidator {
  /**
   * Valida campos del body para creación y actualización
   */
  validateRole = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('name').isString().withMessage('El nombre debe ser una cadena de texto'),
  ];

  /**
   * Valida que el ID en los parámetros sea válido y exista
   */
  validateRoleId = [
    param('id').notEmpty().withMessage('El id es requerido'),
    param('id').isInt().withMessage('El id debe ser un número'),
    param('id').custom(async (id) => {
      if (!id || isNaN(Number(id))) throw new Error(`El parámetro id debe ser un número`);
      // Verifica existencia usando el servicio
      const { status } = await RoleServices.getById(Number(id));
      if (status === 404) {
        throw new Error('El id no se encuentra en los registros');
      }
      return true;
    }),
  ];

  /**
   * Valida regla de negocio: El nombre debe ser único
   */
  validateIfNameIsUse = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    // Obtenemos todos los roles para verificar duplicados
    const { data } = await RoleServices.getAll();
    const existingRecord = data.roles ? data.roles.find(r => r.name === name) : null;

    if (existingRecord) {
      // Caso POST: El nombre ya existe
      if (!id) {
        return res.status(400).json({
          errors: [{ type: 'field', msg: `Nombre en uso: ${name}`, path: 'name', location: 'body' }]
        });
      } 
      // Caso PUT: El nombre existe y pertenece a otro ID
      else {
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

export { RoleValidator };