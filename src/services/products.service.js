import { prisma } from '../config/prisma.config.js';

const ProductServices = {
    getAll: async () => {
        try {
            const products = await prisma.product.findMany({
                where: { status: true },
                include: { 
                    category: true,
                    area: true
                }
            });
            if (products.length === 0) {
                return {
                    message: `No se encontraron registros`,
                    status: 404,
                    data: {
                        products: [],
                        total: 0
                    },
                };
            }
            return {
                message: `Registros encontrados`,
                status: 200,
                data: {
                    products,
                    total: products.length
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
            const product = await prisma.product.findUnique({
                where: {
                    id: Number(id),
                    status: true,
                },
                include: { 
                    category: true,
                    area: true
                }
            });
            if (!product) {
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
                        product,
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
            const newProduct = await prisma.product.create({
                data: {
                    name: data.name,
                    price: Number(data.price),
                    quantity: Number(data.quantity),
                    category_id: Number(data.category_id),
                    area_id: Number(data.area_id),
                },
            });
            return {
                message: `Registro creado exitosamente`,
                status: 201,
                data: {
                    product: newProduct,
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
            const product = await prisma.product.update({
                where: { id: Number(id) },
                data: {
                    name: data.name,
                    price: data.price ? Number(data.price) : undefined,
                    quantity: data.quantity ? Number(data.quantity) : undefined,
                    category_id: data.category_id ? Number(data.category_id) : undefined,
                    area_id: data.area_id ? Number(data.area_id) : undefined,
                    status: data.status !== undefined ? data.status : true,
                },
            });
            return {
                message: `Registro actualizado exitosamente`,
                status: 200,
                data: {
                    product,
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
            const product = await prisma.product.update({
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
                    product,
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

export { ProductServices };