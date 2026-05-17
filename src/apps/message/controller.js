const { MessageService } = require("./service");

class Controller {
  static async get(req, res) {
    const { page = 1, limit = 10, status } = req.query;
    const { data, meta } = await MessageService.list(parseInt(page), parseInt(limit), status);
    return res.success(data, req.t("message.get_all_success"), 200, meta);
  }

  static async stats(req, res) {
    const result = await MessageService.stats();
    return res.success(result, req.t("message.stats_success"));
  }

  static async getById(req, res) {
    const { id } = req.params;
    const result = await MessageService.getById(id);
    return res.success(result, req.t("message.get_success"));
  }

  static async create(req, res) {
    const result = await MessageService.create(req.body);
    return res.success(result, req.t("message.create_success"), 201);
  }

  static async markRead(req, res) {
    const { id } = req.params;
    const result = await MessageService.markRead(id);
    return res.success(result, req.t("message.read_success"));
  }

  static async reply(req, res) {
    const { id } = req.params;
    const result = await MessageService.reply(id, req.body);
    return res.success(result, req.t("message.reply_success"));
  }

  static async delete(req, res) {
    const { id } = req.params;
    const result = await MessageService.delete(id);
    return res.success(result, req.t("message.delete_success"));
  }
}

module.exports = { Controller };
