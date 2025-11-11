const { FieldsService } = require("./service");

exports.Controller = class {
  static now = new Date();

  static async create(req, res) {
    const result = await FieldsService.create(req.body);

    return res.success(result, req.t("system.create_success"));
  }

  static async update(req, res) {
    const result = await FieldsService.update({ ...req.params, ...req.body });

    return res.success(result, req.t("system.update_success"));
  }

  static async getById(req, res) {
    const result = await FieldsService.getById(req.params);

    return res.success(result, req.t("system.get_success"));
  }

  static async get(req, res) {
    const result = await FieldsService.get(req.query);

    return res.success(result, req.t("system.get_success"));
  }

  static async delete(req, res) {
    const result = await FieldsService.delete(req.params);

    return res.success(result, req.t("system.delete_success"));
  }
};
