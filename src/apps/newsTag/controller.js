const { TagService } = require("./service");

class TagController {
  static async get(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const { data, meta } = await TagService.getAllTags(parseInt(page), parseInt(limit));
    return res.success(data, req.t("tag.get_all_success"), 200, meta);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const result = await TagService.getById(id);
    return res.success(result, req.t("tag.get_success"));
  }

  static async create(req, res) {
    const result = await TagService.createTag(req.body);
    return res.success(result, req.t("tag.create_success"));
  }

  static async update(req, res) {
    const { id } = req.params;
    const result = await TagService.updateTag(id, req.body);
    return res.success(result, req.t("tag.update_success"));
  }

  static async delete(req, res) {
    const { id } = req.params;
    const result = await TagService.deleteTag(id);
    return res.success(result, req.t("tag.delete_success"));
  }
}

module.exports = { TagController };
