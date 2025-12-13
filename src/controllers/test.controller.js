/**
 * CAPA DE CONTROLADORES - TEST
 * 
 * Esta capa recibe las peticiones HTTP después de pasar las validaciones.
 * Su responsabilidad es:
 * 1. Extraer datos de req (params, body, query)
 * 2. Llamar al servicio correspondiente
 * 3. Retornar la respuesta HTTP con el formato correcto
 * 
 * IMPORTANTE: Los controladores NO deben contener lógica de negocio,
 * solo coordinan entre la petición HTTP y los servicios.
 */

import { TestServices } from "../services/test.service.js";

export class TestController {
  constructor() { }

  /**
   * GET /api/v1/test
   * Obtiene todos los registros activos
   */
  getAll = async (req, res) => {
    // Llama al servicio para obtener todos los registros
    const { message, status, data } = await TestServices.getAll();

    // Retorna la respuesta con el formato estándar
    // NOTA: El status del servicio se usa como código HTTP
    return res.status(status).json({
      message,
      data
    });
  };

  /**
   * GET /api/v1/test/:id
   * Obtiene un registro por su ID
   */
  getOne = async (req, res) => {
    // Extrae el ID de los parámetros de la URL
    const { id } = req.params;

    // Convierte el ID a número y llama al servicio
    // NOTA: La conversión se hace aquí, no en el servicio
    const { message, status, data } = await TestServices.getById(Number(id));

    // Retorna la respuesta
    return res.status(status).json({
      message,
      data
    });
  };

  /**
   * POST /api/v1/test
   * Crea un nuevo registro
   */
  created = async (req, res) => {
    // Extrae los datos del body (ya validados por el validador)
    const testData = req.body;

    // Llama al servicio para crear el registro
    const { message, status, data } = await TestServices.create(testData);

    // Retorna la respuesta (status 201 para creación exitosa)
    return res.status(status).json({
      message,
      data
    });
  };

  /**
   * PUT /api/v1/test/:id
   * Actualiza un registro existente
   */
  updated = async (req, res) => {
    // Extrae el ID de los parámetros y los datos del body
    const { id } = req.params;
    const testData = req.body;

    // Convierte el ID a número y llama al servicio
    const { message, status, data } = await TestServices.update(Number(id), testData);

    // Retorna la respuesta
    return res.status(status).json({
      message,
      data
    });
  };

  /**
   * DELETE /api/v1/test/:id
   * Elimina un registro (soft delete: marca como inactivo)
   */
  deleted = async (req, res) => {
    // Extrae el ID de los parámetros
    const { id } = req.params;

    // Convierte el ID a número y llama al servicio
    // NOTA: El servicio retorna status 204 (No Content) en delete
    const { message, status } = await TestServices.delete(Number(id));

    // Retorna solo el mensaje (sin data en delete)
    return res.status(status).json({
      message
    });
  };
}

