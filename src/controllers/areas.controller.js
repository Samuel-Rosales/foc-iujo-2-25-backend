import { AreaServices } from "../services/areas.service.js";

export class AreaController {
  constructor() { }

  getAll = async (req, res) => {
    const { message, status, data } = await AreaServices.getAll();

    return res.status(status).json({ 
        message, 
        data 
    });

  };

  getOne = async (req, res) => {
    const { id } = req.params;

    const { message, status, data } = await AreaServices.getById(Number(id));

    return res.status(status).json({ 
        message, 
        data 
    });

  };

  created = async (req, res) => {
    const areaData = req.body;

    const { message, status, data } = await AreaServices.create(areaData);

    return res.status(status).json({ 
        message, 
        data 
    });
  };

  updated = async (req, res) => {
    const { id } = req.params;

    const areaData = req.body;

    const { message, status, data } = await AreaServices.update(Number(id), areaData);

    return res.status(status).json({ 
        message, 
        data 
    });
  };

  deleted = async (req, res) => {
    const { id } = req.params;

    const { message, status } = await AreaServices.delete(Number(id));

    return res.status(status).json({ 
        message 
    });
  };
}