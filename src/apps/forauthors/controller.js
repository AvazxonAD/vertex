const { ForAuthorsService } = require("./service");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");

class Controller {
  static async get(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const { data, meta } = await ForAuthorsService.get(parseInt(page), parseInt(limit));
    return res.success(data, req.t("forauthors.get_all_success"), 200, meta);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const result = await ForAuthorsService.getById(id);
    return res.success(result, req.t("forauthors.get_success"));
  }

  static async create(req, res) {
    const result = await ForAuthorsService.create({ ...req.body, icon: req.files.icon });
    return res.success(result, req.t("forauthors.create_success"));
  }

  static async update(req, res) {
    const result = await ForAuthorsService.updatePost({ ...req.params, ...req.files, ...req.body });
    return res.success(result, req.t("forauthors.update_success"));
  }

  static async delete(req, res) {
    const { id } = req.params;
    const result = await ForAuthorsService.deletePost(id);
    return res.success(result, req.t("forauthors.delete_success"));
  }

  static async getFile(req, res) {
    const { filename } = req.params;

    const imagePath = path.join(process.cwd(), "public", "uploads", filename);

    if (!fs.existsSync(imagePath)) {
      return res.error(req.t("file_not_found"), 404);
    }

    const content_type = mime.lookup(filename);

    res.setHeader("Content-Type", content_type);

    return res.sendFile(imagePath);
  }
}

module.exports = { Controller };
