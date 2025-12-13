import { prisma } from '../config/prisma.config.js';

const UserServices = {
    getAll: async () => {
        try {
            const users = await prisma.user.findMany({
                where: { status: true },
            });
            if (users.length === 0) {
                return {
                    message: `No se encontraron registros`,
                    status: 404,
                    data: {
                        users: [],
                        total: 0
                    },
                };
            }
            return {
                message: `Registros encontrados`,
                status: 200,
                data: {
                    users,
                    total: users.length
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
            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                    status: true,
                },
            });
            if (!user) {
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
                        user,
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

    create: async (userData) => {
        try {
            const newUser = await prisma.user.create({
                data: {
                    name: userData.name,
                    username: userData.username,
                    email: userData.email,
                    password: userData.password,
                    role_id: userData.role_id,
                },
            });
            return {
                message: `Registro creado exitosamente`,
                status: 201,
                data: {
                    user: newUser,
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

    update: async (id, userData) => {
        try {
            const user = await prisma.user.update({
                where: { id: id },
                data: {
                    name: userData.name,
                    username: userData.username,
                    email: userData.email,
                    password: userData.password,
                    role_id: userData.role_id,
                    updated_at: new Date(),
                    status: userData.status !== undefined ? userData.status : true,
                },
            });
            return {
                message: `Registro actualizado exitosamente`,
                status: 200,
                data: {
                    user,
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
            const user = await prisma.user.update({
                where: { id: id },
                data: {
                    status: false,
                    deleted_at: new Date(),
                },
            });
            return {
                message: `Registro eliminado exitosamente`,
                status: 204,
                data: {
                    user,
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

    getByEmail: async (email) => {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return {
                    message: `Registro no encontrado`,
                    status: 404,
                    data: {
                        user,
                    },
                };
            } else {
                return {
                    message: `Registro encontrado`,
                    status: 200,
                    data: {
                        user,
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

export { UserServices };
