const path = require("path");
const fs = require("fs");
const mime = require("mime-types");
const { JurnalPostsService } = require("./service");
const { ErrorResponse } = require("../../helper/errorResponse");

exports.Controller = class {
  static async create(req, res) {
    const result = await JurnalPostsService.create({
      ...req.body,
      file: req.file,
    });
    return res.success(result, req.t("system.create_success"));
  }

  static async update(req, res) {
    const result = await JurnalPostsService.update({
      ...req.params,
      ...req.body,
      file: req.file,
    });
    return res.success(result, req.t("system.update_success"));
  }

  static async getById(req, res) {
    const result = await JurnalPostsService.getById(req.params.id, {
      incrementSeen: true,
    });
    return res.success(result, req.t("system.get_success"));
  }

  static async get(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const result = await JurnalPostsService.get(
      parseInt(page),
      parseInt(limit),
      req.query
    );
    return res.success(
      result.data,
      req.t("system.get_success"),
      200,
      result.meta
    );
  }

  static async delete(req, res) {
    const result = await JurnalPostsService.delete(req.params.id);
    return res.success(result, req.t("system.delete_success"));
  }

  static async getFile(req, res) {
    const UPLOAD_BASE = process.env.UPLOAD_PATH;
    const file_path = path.join(UPLOAD_BASE, req.params.file_name);

    try {
      await fs.promises.access(file_path);
    } catch {
      throw new ErrorResponse("jurnal_post.file_not_found", 404);
    }

    const file = await fs.promises.readFile(file_path);
    const content_type = mime.lookup(req.params.file_name);

    res.setHeader("Content-type", content_type);

    await JurnalPostsService.updateDownloadCount(req.params.file_name);

    return res.send(file);
  }
};
