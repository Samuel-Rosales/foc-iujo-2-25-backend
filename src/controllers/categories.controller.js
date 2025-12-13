import { CategoryServices } from "../services/categories.service.js";

export class CategoryController {
  constructor() { }

  getAll = async (req, res) => {
    const { message, status, data } = await CategoryServices.getAll();

    return res.status(status).json({ 
        message, 
        data 
    });
  };

  getOne = async (req, res) => {
    const { id } = req.params;

    const { message, status, data } = await CategoryServices.getById(Number(id));

    return res.status(status).json({ 
        message, 
        data 
    });
  };

  created = async (req, res) => {
    const categoryData = req.body;

    const { message, status, data } = await CategoryServices.create(categoryData);

    return res.status(status).json({ 
        message, 
        data 
    });
  };

  updated = async (req, res) => {
    const { id } = req.params;

    const categoryData = req.body;

    const { message, status, data } = await CategoryServices.update(Number(id), categoryData);

    return res.status(status).json({ 
        message, 
        data 
    });
  };

  deleted = async (req, res) => {
    const { id } = req.params;

    const { message, status } = await CategoryServices.delete(Number(id));

    return res.status(status).json({
        message
    });
  };
}