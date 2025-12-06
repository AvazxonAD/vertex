const { NewsService } = require("./service");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");

class Controller {
  static async get(req, res) {
    const { page = 1, limit = 10, id } = req.query;
    const { data, meta } = await NewsService.get(parseInt(page), parseInt(limit), id);
    return res.success(data, req.t("news.get_all_success"), 200, meta);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const result = await NewsService.getById(id);
    return res.success(result, req.t("news.get_success"));
  }

  static async create(req, res) {
    const result = await NewsService.create({ ...req.body, image: req.files.image, video: req.files.video, gif: req.files.gif });
    return res.success(result, req.t("news.create_success"));
  }

  static async update(req, res) {
    const result = await NewsService.updatePost({ ...req.params, ...req.files, ...req.body });
    return res.success(result, req.t("news.update_success"));
  }

  static async delete(req, res) {
    const { id } = req.params;
    const result = await NewsService.deletePost(id);
    return res.success(result, req.t("news.delete_success"));
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
