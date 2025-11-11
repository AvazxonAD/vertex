const { JurnalsService } = require("./service");

exports.Controller = class {
  static now = new Date();

  static async create(req, res) {
    const result = await JurnalsService.create(req.body);

    return res.success(result, req.t("system.create_success"));
  }

  static async update(req, res) {
    const result = await JurnalsService.update({ ...req.params, ...req.body });

    return res.success(result, req.t("system.update_success"));
  }

  static async getById(req, res) {
    const result = await JurnalsService.getById(req.params);

    return res.success(result, req.t("system.get_success"));
  }

  static async get(req, res) {
    const result = await JurnalsService.get(req.query);

    return res.success(result, req.t("system.get_success"));
  }

  static async delete(req, res) {
    const result = await JurnalsService.delete(req.params);

    return res.success(result, req.t("system.delete_success"));
  }
};
