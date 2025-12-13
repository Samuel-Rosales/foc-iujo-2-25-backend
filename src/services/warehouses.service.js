import { prisma } from '../config/prisma.config.js';

const WarehouseServices = {
    getAll: async () => {
        try {
            const warehouses = await prisma.warehouse.findMany({
                where: { status: true },
            });
            if (warehouses.length === 0) {
                return {
                    message: `No se encontraron registros`,
                    status: 404,
                    data: {
                        warehouses: [],
                        total: 0
                    },
                };
            }
            return {
                message: `Registros encontrados`,
                status: 200,
                data: {
                    warehouses,
                    total: warehouses.length
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

    getById: async (id) => {
        try {
            const warehouse = await prisma.warehouse.findUnique({
                where: {
                    id: Number(id),
                    status: true,
                },
            });
            if (!warehouse) {
                return {
                    message: `Registro no encontrado`,
                    status: 404,
                    data: {},
                };
            } else {
                return {
                    message: `Registro encontrado`,
                    status: 200,
                    data: {
                        warehouse,
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

    create: async (data) => {
        try {
            const newWarehouse = await prisma.warehouse.create({
                data: {
                    name: data.name,
                },
            });
            return {
                message: `Registro creado exitosamente`,
                status: 201,
                data: {
                    warehouse: newWarehouse,
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

    update: async (id, data) => {
        try {
            const warehouse = await prisma.warehouse.update({
                where: { id: Number(id) },
                data: {
                    name: data.name,
                    status: data.status !== undefined ? data.status : true,
                },
            });
            return {
                message: `Registro actualizado exitosamente`,
                status: 200,
                data: {
                    warehouse,
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

    delete: async (id) => {
        try {
            const warehouse = await prisma.warehouse.update({
                where: { id: Number(id) },
                data: {
                    status: false,
                    deleted_at: new Date(),
                },
            });
            return {
                message: `Registro eliminado exitosamente`,
                status: 204,
                data: {
                    warehouse,
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
};

export { WarehouseServices };