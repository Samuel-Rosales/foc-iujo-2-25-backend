/**
 * CAPA DE VALIDADORES - TEST
 * 
 * Esta capa contiene todas las validaciones de entrada usando express-validator.
 * Las validaciones se ejecutan antes de llegar al controlador.
 * 
 * Tipos de validaciones:
 * - validateTest: Valida campos del body (name)
 * - validateTestId: Valida parámetros de la URL (id)
 * - validateIfNameIsUse: Validación personalizada que verifica reglas de negocio
 */

import { TestServices } from '../services/test.service.js';
import { body, param } from 'express-validator';

class TestValidator {
  /**
   * Validaciones para el campo 'name' del body
   * Se usa en POST y PUT
   * 
   * Valida:
   * - Que el campo 'name' no esté vacío
   * - Que el campo 'name' sea de tipo string
   */
  validateTest = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('name').isString().withMessage('El nombre debe ser una cadena de texto'),
  ];

  /**
   * Validaciones para el parámetro 'id' de la URL
   * Se usa en GET /:id, PUT /:id y DELETE /:id
   * 
   * Valida:
   * - Que el parámetro 'id' no esté vacío
   * - Que el parámetro 'id' sea un número entero
   * - Que el 'id' exista en la base de datos (consulta al servicio)
   */
  validateTestId = [
    param('id').notEmpty().withMessage('El id es requerido'),
    param('id').isInt().withMessage('El id debe ser un número'),
    // Validación personalizada: verifica que el ID exista en la BD
    param('id').custom(async (id) => {
      if (!id) {
        throw new Error('El parámetro id es requerido para la verificación');
      }
      if (isNaN(Number(id))) {
        throw new Error(`El parámetro id: ${id} debe ser un número`);
      }
      // Consulta al servicio para verificar que el registro existe
      const { status } = await TestServices.getById(Number(id));
      if (status === 404) {
        throw new Error('El id no se encuentra en los registros');
      }
      return true;
    }),
  ];

  /**
   * Validación personalizada: Verifica que el nombre no esté en uso
   * 
   * Lógica:
   * - Si es POST (no hay id): Verifica que el nombre no exista
   * - Si es PUT (hay id): Verifica que el nombre no esté en uso por otro registro
   * 
   * Esta validación se ejecuta DESPUÉS de validateFields
   * porque necesita acceso a req.body y req.params
   */
  validateIfNameIsUse = async (req, res, next) => {
    const { id } = req.params;  // ID del registro (solo existe en PUT)
    const { name } = req.body;   // Nombre a verificar
    
    // Consulta al servicio para buscar si el nombre ya existe
    const { status, message, data } = await TestServices.getByName(name);
    
    // Si hay error en el servicio, retorna error 500
    if (status == 500) {
      res.status(status).json({
        message,
      });
      return;
    } 
    // Si el nombre existe (status 200)
    else if (status == 200) {
      const test = data.test;
      
      // Si es POST (crear nuevo registro) y el nombre existe, rechaza
      if (!id) {
        res.status(400).json({
          errors: [
            {
              type: 'field',
              msg: `Nombre en uso: ${name}, para el nuevo registro`,
              path: 'name',
              location: 'body',
            },
          ],
        });
        return;
      } 
      // Si es PUT (actualizar) y el nombre pertenece a otro registro, rechaza
      else {
        if (id != test.id) {
          res.status(400).json({
            errors: [
              {
                type: 'field',
                msg: `Nombre en uso: ${name}, para el registro actual`,
                path: 'name',
                location: 'body',
              },
            ],
          });
          return;
        }
        // Si el nombre pertenece al mismo registro, permite continuar
      }
    }
    // Si el nombre no existe (status 404) o todo está bien, continúa
    next();
  };
}

export { TestValidator };

