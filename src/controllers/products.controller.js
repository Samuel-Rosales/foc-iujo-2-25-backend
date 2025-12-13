import { ProductServices } from "../services/products.service.js";

export class ProductController {
  constructor() { }

  getAll = async (req, res) => {
    const { message, status, data } = await ProductServices.getAll();

    return res.status(status).json({ 
      message, 
      data 
    });
  };

  getOne = async (req, res) => {
    const { id } = req.params;

    const { message, status, data } = await ProductServices.getById(Number(id));

    return res.status(status).json({ 
      message, 
      data 
    });
  };

  created = async (req, res) => {
    const productData = req.body;
    
    const { message, status, data } = await ProductServices.create(productData);

    return res.status(status).json({ 
      message, 
      data 
    });
  };

  updated = async (req, res) => {
    const { id } = req.params;

    const productData = req.body;

    const { message, status, data } = await ProductServices.update(Number(id), productData);

    return res.status(status).json({ 
      message, 
      data 
    });
  };

  deleted = async (req, res) => {
    const { id } = req.params;

    const { message, status } = await ProductServices.delete(Number(id));

    return res.status(status).json({ 
      message 
    });
  };
}