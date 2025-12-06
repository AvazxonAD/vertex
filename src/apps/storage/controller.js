const { StorageService } = require("./service");

exports.StorageController = class {
  static async create(req, res) {
    const result = await StorageService.create(req);

    return res.success(result, req.t("storage.create_success"));
  }

  static async get(req, res) {
    const result = await StorageService.get();

    return res.success(result, req.t("storage.get_success"));
  }

  static async getById(req, res) {
    const { content_type, file } = await StorageService.getById(req.params);

    res.setHeader("Content-Type", content_type);

    return res.send(file);
  }

  static async delete(req, res) {
    const result = await StorageService.delete(req.params);

    return res.success(result, req.t("storage.delete_success"));
  }

  static async update(req, res) {
    const result = await StorageService.update(req);

    return res.success(result, req.t("storage.get_success"));
  }
};
