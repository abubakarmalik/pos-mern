const { sendSuccess, sendError } = require('../utils/response');
const productService = require('../services/product.service');

const handleServiceError = (res, error) =>
  sendError(res, error.status, error.message, {
    code: error.errorCode,
    details: error.details,
  });

const listProducts = async (req, res, next) => {
  try {
    const products = await productService.listProducts(req.validated.query);
    return sendSuccess(res, products, 'Products fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProduct(req.validated.params.id);
    return sendSuccess(res, product, 'Product fetched successfully');
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.validated.body);
    return sendSuccess(res, product, 'Product created successfully', 201);
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const product = await productService.updateProduct(id, req.validated.body);
    return sendSuccess(res, product, 'Product updated successfully');
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

const toggleProduct = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const product = await productService.toggleProduct(id);
    return sendSuccess(
      res,
      product,
      product.isActive ? 'Product enabled' : 'Product disabled',
    );
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
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
