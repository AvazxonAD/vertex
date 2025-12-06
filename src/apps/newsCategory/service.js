const { NewsCategoryDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");
const { HelperFunctions } = require("../../helper/functions");

class NewsCategoryService {
  static async getAllCategories(page = 1, limit = 10) {
    const result = await NewsCategoryDB.get(page, limit);

    const meta = HelperFunctions.pagination({ page, limit, count: result.countResult });

    return { data: result.data, meta };
  }

  static async getCategoryById(id) {
    const category = await NewsCategoryDB.getById(id);
    if (!category) {
      throw new ErrorResponse("category.not_found", 404);
    }
    return category;
  }

  static async createCategory(data) {
    const category = await NewsCategoryDB.create(data);
    return category;
  }

  static async updateCategory(id, data) {
    const existingCategory = await NewsCategoryDB.getById(id);
    if (!existingCategory) {
      throw new ErrorResponse("category.not_found", 404);
    }

    const category = await NewsCategoryDB.update(id, data);
    return category;
  }

  static async deleteCategory(id) {
    const existingCategory = await NewsCategoryDB.getById(id);
    if (!existingCategory) {
      throw new ErrorResponse("category.not_found", 404);
    }

    await NewsCategoryDB.delete(id);
    return { message: "Category deleted successfully" };
  }
}

module.exports = { NewsCategoryService };
