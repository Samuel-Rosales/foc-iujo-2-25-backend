import { UserServices } from "../services/users.service.js";

export class UserController {
  constructor() { }

  getAll = async (req, res) => {
    const { message, status, data } = await UserServices.getAll();

    return res.status(status).json({
      message,
      data
    });
  };

  getOne = async (req, res) => {
    const { id } = req.params;

    const { message, status, data } = await UserServices.getById(Number(id));

    return res.status(status).json({
      message,
      data
    });
  };

  created = async (req, res) => {
    const userData = req.body;

    const { message, status, data } = await UserServices.create(userData);

    return res.status(status).json({
      message,
      data
    });
  };

  updated = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;

    const { message, status, data } = await UserServices.update(Number(id), userData);

    return res.status(status).json({
      message,
      data
    });
  };

  deleted = async (req, res) => {
    const { id } = req.params;

    const { message, status } = await UserServices.delete(Number(id));

    return res.status(status).json({
      message
    });
  };
}
