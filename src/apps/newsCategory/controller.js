const { NewsCategoryService } = require("./service");

class Controller {
  static async get(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const { data, meta } = await NewsCategoryService.getAllCategories(parseInt(page), parseInt(limit));
    return res.success(data, req.t("category.get_all_success"), 200, meta);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const result = await NewsCategoryService.getCategoryById(id);
    return res.success(result, req.t("category.get_success"));
  }

  static async create(req, res) {
    const result = await NewsCategoryService.createCategory(req.body);
    return res.success(result, req.t("category.create_success"));
  }

  static async update(req, res) {
    const { id } = req.params;
    const result = await NewsCategoryService.updateCategory(id, req.body);
    return res.success(result, req.t("category.update_success"));
  }

  static async delete(req, res) {
    const { id } = req.params;
    const result = await NewsCategoryService.deleteCategory(id);
    return res.success(result, req.t("category.delete_success"));
  }
}

module.exports = { Controller };
