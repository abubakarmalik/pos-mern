const { sendSuccess, sendError } = require('../utils/response');
const categoryService = require('../services/category.service');

const handleServiceError = (res, error) =>
  sendError(res, error.status, error.message, {
    code: error.errorCode,
    details: error.details,
  });

const listCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.listCategories(req.validated.query);
    return sendSuccess(res, categories, 'Categories fetched successfully');
  } catch (error) {
    return next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getCategory(req.validated.params.id);
    return sendSuccess(res, category, 'Category fetched successfully');
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.validated.body);
    return sendSuccess(res, category, 'Category created successfully', 201);
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const category = await categoryService.updateCategory(id, req.validated.body);
    return sendSuccess(res, category, 'Category updated successfully');
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

const toggleCategory = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const category = await categoryService.toggleCategory(id);
    return sendSuccess(
      res,
      category,
      category.isActive ? 'Category enabled' : 'Category disabled',
    );
  } catch (error) {
    if (error.errorCode) return handleServiceError(res, error);
    return next(error);
  }
};

module.exports = {
  createCategory,
  getCategory,
  listCategories,
  toggleCategory,
  updateCategory,
};
