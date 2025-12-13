/**
 * CAPA DE SERVICIOS - TEST
 * 
 * Esta capa contiene toda la lógica de negocio y acceso a la base de datos.
 * Los servicios se comunican con Prisma para realizar operaciones CRUD.
 * 
 * Responsabilidades:
 * - Realizar consultas a la base de datos usando Prisma
 * - Aplicar lógica de negocio (validaciones, transformaciones)
 * - Retornar respuestas estructuradas: { message, status, data }
 * 
 * IMPORTANTE: Todos los métodos deben retornar el mismo formato de respuesta
 */

import { prisma } from '../config/prisma.config.js';

const TestServices = {
    /**
     * Obtiene todos los registros activos (status = true)
     * 
     * Retorna:
     * - 200: Si hay registros encontrados
     * - 404: Si no hay registros
     * - 500: Si hay un error en la base de datos
     */
    getAll: async () => {
        try {
            // Consulta Prisma: busca todos los registros con status = true
            const tests = await prisma.test.findMany({
                where: { status: true },
            });
            
            // Si no hay registros, retorna 404
            if (tests.length === 0) {
                return {
                    message: `No se encontraron registros`,
                    status: 404,
                    data: {
                        tests: [],
                        total: 0
                    },
                };
            }
            
            // Si hay registros, retorna 200 con los datos
            return {
                message: `Registros encontrados`,
                status: 200,
                data: {
                    tests,
                    total: tests.length
                },
            };
        } catch (error) {
            console.error(error);
            return {
                message: `Por favor contacte al administrador`,
                status: 500,
            };
        }
    },

    /**
     * Obtiene un registro por su ID
     * 
     * @param {number} id - ID del registro a buscar
     * 
     * Retorna:
     * - 200: Si el registro existe
     * - 404: Si el registro no existe
     * - 500: Si hay un error en la base de datos
     */
    getById: async (id) => {
        try {
            // Consulta Prisma: busca un registro único por ID y status = true
            const test = await prisma.test.findUnique({
                where: {
                    id: id,
                    status: true,
                },
            });
            
            // Si no existe, retorna 404
            if (!test) {
                return {
                    message: `Registro no encontrado`,
                    status: 404,
                    data: {},
                };
            } 
            // Si existe, retorna 200 con los datos
            else {
                return {
                    message: `Registro encontrado`,
                    status: 200,
                    data: {
                        test,
                    },
                };
            }
        } catch (error) {
            console.log(error);
            return {
                message: `Por favor contacte al administrador`,
                status: 500,
            };
        }
    },

    /**
     * Crea un nuevo registro
     * 
     * @param {object} testData - Datos del nuevo registro { name }
     * 
     * Retorna:
     * - 201: Si el registro se creó exitosamente
     * - 500: Si hay un error en la base de datos
     */
    create: async (testData) => {
        try {
            // Consulta Prisma: crea un nuevo registro
            // Prisma automáticamente asigna valores por defecto (status=true, created_at, etc.)
            const newTest = await prisma.test.create({
                data: {
                    name: testData.name,
                },
            });
            
            return {
                message: `Registro creado exitosamente`,
                status: 201,
                data: {
                    test: newTest,
                },
            };
        } catch (error) {
            console.error(error);
            return {
                message: `Por favor contacte al administrador`,
                status: 500,
            };
        }
    },

    /**
     * Actualiza un registro existente
     * 
     * @param {number} id - ID del registro a actualizar
     * @param {object} testData - Datos a actualizar { name, status? }
     * 
     * Retorna:
     * - 200: Si el registro se actualizó exitosamente
     * - 500: Si hay un error en la base de datos
     * 
     * NOTA: updated_at se actualiza automáticamente
     */
    update: async (id, testData) => {
        try {
            // Consulta Prisma: actualiza el registro
            // updated_at se actualiza manualmente con new Date()
            const test = await prisma.test.update({
                where: { id: id },
                data: {
                    name: testData.name,
                    updated_at: new Date(),  // Actualiza la fecha de modificación
                    status: testData.status !== undefined ? testData.status : true,
                },
            });
            
            return {
                message: `Registro actualizado exitosamente`,
                status: 200,
                data: {
                    test,
                },
            };
        } catch (error) {
            console.error(error);
            return {
                message: `Por favor contacte al administrador`,
                status: 500,
            };
        }
    },

    /**
     * Elimina un registro (soft delete)
     * 
     * IMPORTANTE: No se elimina físicamente, solo se marca como inactivo
     * 
     * @param {number} id - ID del registro a eliminar
     * 
     * Retorna:
     * - 204: Si el registro se eliminó exitosamente
     * - 500: Si hay un error en la base de datos
     */
    delete: async (id) => {
        try {
            // Consulta Prisma: actualiza el registro (soft delete)
            // En lugar de eliminar, marca status = false y asigna deleted_at
            const test = await prisma.test.update({
                where: { id: id },
                data: {
                    status: false,           // Marca como inactivo
                    deleted_at: new Date(),  // Registra la fecha de eliminación
                },
            });
            
            return {
                message: `Registro eliminado exitosamente`,
                status: 204,
                data: {
                    test,
                },
            };
        } catch (error) {
            console.error(error);
            return {
                message: `Por favor contacte al administrador`,
                status: 500,
            };
        }
    },

    /**
     * Busca un registro por su nombre
     * 
     * Este método se usa en las validaciones para verificar nombres únicos
     * 
     * @param {string} name - Nombre a buscar
     * 
     * Retorna:
     * - 200: Si el registro existe
     * - 404: Si el registro no existe
     * - 500: Si hay un error en la base de datos
     * 
     * NOTA: La búsqueda es case-insensitive (no distingue mayúsculas/minúsculas)
     */
    getByName: async (name) => {
        try {
            // Consulta Prisma: busca el primer registro que coincida con el nombre
            // mode: 'insensitive' hace que la búsqueda no distinga mayúsculas/minúsculas
            const test = await prisma.test.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive',
                    },
                },
            });

            // Si no existe, retorna 404
            if (!test) {
                return {
                    message: `Registro no encontrado`,
                    status: 404,
                    data: {
                        test,
                    },
                };
            } 
            // Si existe, retorna 200 con los datos
            else {
                return {
                    message: `Registro encontrado`,
                    status: 200,
                    data: {
                        test,
                    },
                };
            }
        } catch (error) {
            console.log(error);
            return {
                message: `Por favor contacte al administrador`,
                status: 500,
            };
        }
    },
};

export { TestServices };

