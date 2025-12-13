import { RoleServices } from "../services/roles.service.js";

export class RoleController {
  constructor() { }

  getAll = async (req, res) => {
    const { message, status, data } = await RoleServices.getAll();

    return res.status(status).json({
      message,
      data
    });
  };

  getOne = async (req, res) => {
    const { id } = req.params;

    const { message, status, data } = await RoleServices.getById(Number(id));

    return res.status(status).json({
      message,
      data
    });
  };

  created = async (req, res) => {
    const roleData = req.body;

    const { message, status, data } = await RoleServices.create(roleData);

    return res.status(status).json({
      message,
      data
    });
  };

  updated = async (req, res) => {
    const { id } = req.params;
    const roleData = req.body;

    const { message, status, data } = await RoleServices.update(Number(id), roleData);

    return res.status(status).json({
      message,
      data
    });
  };

  deleted = async (req, res) => {
    const { id } = req.params;

    const { message, status } = await RoleServices.delete(Number(id));

    return res.status(status).json({
      message
    });
  };
}
