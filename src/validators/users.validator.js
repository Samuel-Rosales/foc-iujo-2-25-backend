/**
 * CAPA DE VALIDADORES - USERS
 */
import { UserServices } from '../services/users.service.js';
import { RoleServices } from '../services/roles.service.js';
import { body, param } from 'express-validator';

class UserValidator {
  /**
   * Validaciones del body
   */
  validateUser = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('name').isString().withMessage('El nombre debe ser texto'),
    
    body('email').notEmpty().withMessage('El email es requerido'),
    body('email').isEmail().withMessage('Debe ser un formato de email válido'),
    
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    // Validación de Clave Foránea: role_id
    body('role_id').notEmpty().withMessage('El role_id es requerido'),
    body('role_id').isInt().withMessage('El role_id debe ser un número'),
    body('role_id').custom(async (roleId) => {
        const { status } = await RoleServices.getById(roleId);
        if (status === 404) throw new Error('El role_id especificado no existe');
        return true;
    }),
  ];

  /**
   * Validaciones del ID por parámetro
   */
  validateUserId = [
    param('id').notEmpty().withMessage('El id es requerido'),
    param('id').isInt().withMessage('El id debe ser un número'),
    param('id').custom(async (id) => {
      if (!id || isNaN(Number(id))) throw new Error(`El parámetro id debe ser un número`);
      const { status } = await UserServices.getById(Number(id));
      if (status === 404) {
        throw new Error('El id no se encuentra en los registros');
      }
      return true;
    }),
  ];

  /**
   * Validación personalizada: Verifica que el EMAIL no esté en uso
   * (En usuarios, la restricción única suele ser el email, no el nombre)
   */
  validateIfEmailIsUse = async (req, res, next) => {
    const { id } = req.params;
    const { email } = req.body; // Verificamos email, no name

    // Obtenemos usuarios para buscar duplicados
    const { data } = await UserServices.getAll();
    const existingRecord = data.users ? data.users.find(u => u.email === email) : null;

    if (existingRecord) {
      if (!id) { // POST
        return res.status(400).json({
          errors: [{ type: 'field', msg: `El email ${email} ya está registrado`, path: 'email', location: 'body' }]
        });
      } else { // PUT
        if (Number(id) !== existingRecord.id) {
          return res.status(400).json({
            errors: [{ type: 'field', msg: `El email ${email} ya está registrado por otro usuario`, path: 'email', location: 'body' }]
          });
        }
      }
    }
    next();
  };
}

export { UserValidator };