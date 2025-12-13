import { prisma } from '../config/prisma.config.js';

const AreaServices = {
    getAll: async () => {
        try {
            const areas = await prisma.area.findMany({
                where: { status: true },
                include: { warehouse: true } // Incluimos info del warehouse
            });
            if (areas.length === 0) {
                return {
                    message: `No se encontraron registros`,
                    status: 404,
                    data: {
                        areas: [],
                        total: 0
                    },
                };
            }
            return {
                message: `Registros encontrados`,
                status: 200,
                data: {
                    areas,
                    total: areas.length
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
            const area = await prisma.area.findUnique({
                where: {
                    id: Number(id),
                    status: true,
                },
                include: { warehouse: true }
            });
            if (!area) {
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
                        area,
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
            const newArea = await prisma.area.create({
                data: {
                    name: data.name,
                    warehouse_id: Number(data.warehouse_id),
                },
            });
            return {
                message: `Registro creado exitosamente`,
                status: 201,
                data: {
                    area: newArea,
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
            const area = await prisma.area.update({
                where: { id: Number(id) },
                data: {
                    name: data.name,
                    warehouse_id: data.warehouse_id ? Number(data.warehouse_id) : undefined,
                    status: data.status !== undefined ? data.status : true,
                },
            });
            return {
                message: `Registro actualizado exitosamente`,
                status: 200,
                data: {
                    area,
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
            const area = await prisma.area.update({
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
                    area,
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

export { AreaServices };