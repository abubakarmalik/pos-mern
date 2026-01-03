const Product = require('../models/product.model');
const { sendSuccess, sendError } = require('../utils/response');

const listProducts = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { sku: regex }, { category: regex }];
    }
    const products = await Product.find(query).sort({ createdAt: -1 });
    return sendSuccess(res, products);
  } catch (error) {
    return next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, 'Product not found');
    return sendSuccess(res, product);
  } catch (error) {
    return next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.validated.body);
    return sendSuccess(res, product);
  } catch (error) {
    if (error.code === 11000)
      return sendError(res, 400, 'SKU already exists');
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const product = await Product.findByIdAndUpdate(id, req.validated.body, {
      new: true,
    });
    if (!product) return sendError(res, 404, 'Product not found');
    return sendSuccess(res, product);
  } catch (error) {
    if (error.code === 11000)
      return sendError(res, 400, 'SKU already exists');
    return next(error);
  }
};

const toggleProduct = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const product = await Product.findById(id);
    if (!product) return sendError(res, 404, 'Product not found');
    product.isActive = !product.isActive;
    await product.save();
    return sendSuccess(res, product);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  toggleProduct,
};
