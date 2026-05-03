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
    return sendSuccess(res, products, 'Products fetched');
  } catch (error) {
    return next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return sendError(res, 404, 'Product not found', {
        code: 'PRODUCT_NOT_FOUND',
        details: { id: req.params.id },
      });
    return sendSuccess(res, product, 'Product fetched');
  } catch (error) {
    return next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.validated.body);
    return sendSuccess(res, product, 'Product created', 201);
  } catch (error) {
    if (error.code === 11000)
      return sendError(res, 409, 'SKU already exists', {
        code: 'DUPLICATE_SKU',
        details: { fields: Object.keys(error.keyValue || {}) },
      });
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const product = await Product.findByIdAndUpdate(id, req.validated.body, {
      new: true,
    });
    if (!product)
      return sendError(res, 404, 'Product not found', {
        code: 'PRODUCT_NOT_FOUND',
        details: { id },
      });
    return sendSuccess(res, product, 'Product updated');
  } catch (error) {
    if (error.code === 11000)
      return sendError(res, 409, 'SKU already exists', {
        code: 'DUPLICATE_SKU',
        details: { fields: Object.keys(error.keyValue || {}) },
      });
    return next(error);
  }
};

const toggleProduct = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const product = await Product.findById(id);
    if (!product)
      return sendError(res, 404, 'Product not found', {
        code: 'PRODUCT_NOT_FOUND',
        details: { id },
      });
    product.isActive = !product.isActive;
    await product.save();
    return sendSuccess(
      res,
      product,
      product.isActive ? 'Product enabled' : 'Product disabled',
    );
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
