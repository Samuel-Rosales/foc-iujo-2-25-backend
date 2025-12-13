import { WarehouseServices } from "../services/warehouses.service.js";

export class WarehouseController {
  constructor() { }

  getAll = async (req, res) => {
    const { message, status, data } = await WarehouseServices.getAll();

    return res.status(status).json({ 
      message, 
      data 
    });
  };

  getOne = async (req, res) => {
    const { id } = req.params;

    const { message, status, data } = await WarehouseServices.getById(Number(id));

    return res.status(status).json({ 
      message, 
      data 
    });
  };

  created = async (req, res) => {
    const warehouseData = req.body;

    const { message, status, data } = await WarehouseServices.create(warehouseData);

    return res.status(status).json({ 
      message, 
      data 
    });
  };

  updated = async (req, res) => {
    const { id } = req.params;

    const warehouseData = req.body;

    const { message, status, data } = await WarehouseServices.update(Number(id), warehouseData);

    return res.status(status).json({ 
      message, 
      data 
    });
  };

  deleted = async (req, res) => {
    const { id } = req.params;

    const { message, status } = await WarehouseServices.delete(Number(id));

    return res.status(status).json({ 
      message 
    });
  };
}