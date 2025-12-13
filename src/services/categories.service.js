import { prisma } from '../config/prisma.config.js';

const CategoryServices = {
    getAll: async () => {
        try {
            const categories = await prisma.category.findMany({
                where: { status: true },
            });
            if (categories.length === 0) {
                return {
                    message: `No se encontraron registros`,
                    status: 404,
                    data: {
                        categories: [],
                        total: 0
                    },
                };
            }
            return {
                message: `Registros encontrados`,
                status: 200,
                data: {
                    categories,
                    total: categories.length
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
            const category = await prisma.category.findUnique({
                where: {
                    id: Number(id),
                    status: true,
                },
            });
            if (!category) {
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
                        category,
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
            const newCategory = await prisma.category.create({
                data: {
                    name: data.name,
                },
            });
            return {
                message: `Registro creado exitosamente`,
                status: 201,
                data: {
                    category: newCategory,
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
            const category = await prisma.category.update({
                where: { id: Number(id) },
                data: {
                    name: data.name,
                    // updated_at: new Date(), // Descomentar si agregaste este campo al schema
                    status: data.status !== undefined ? data.status : true,
                },
            });
            return {
                message: `Registro actualizado exitosamente`,
                status: 200,
                data: {
                    category,
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
            const category = await prisma.category.update({
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
                    category,
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

export { CategoryServices };