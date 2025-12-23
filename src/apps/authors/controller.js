const { AuthorsService } = require("./service");

class Controller {
    static async get(req, res) {
        const { page = 1, limit = 10, search = "" } = req.query;
        const result = await AuthorsService.get(parseInt(page), parseInt(limit), search);
        return res.success(result, req.t("author.get_all_success"));
    }

    static async getById(req, res) {
        const { id } = req.params;
        const result = await AuthorsService.getById(id);
        return res.success(result, req.t("author.get_success"));
    }

    static async create(req, res) {
        const result = await AuthorsService.create(req.body);
        return res.success(result, req.t("author.create_success"));
    }

    static async update(req, res) {
        const { id } = req.params;
        const result = await AuthorsService.update(id, req.body);
        return res.success(result, req.t("author.update_success"));
    }

    static async delete(req, res) {
        const { id } = req.params;
        const result = await AuthorsService.delete(id);
        return res.success(result, req.t("author.delete_success"));
    }
}

module.exports = { Controller };
