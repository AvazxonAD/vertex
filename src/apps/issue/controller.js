const { IssueService } = require("./service");

class Controller {
    static async get(req, res) {
        const { page = 1, limit = 10 } = req.query;
        const result = await IssueService.get(parseInt(page), parseInt(limit));
        return res.success(result, req.t("issue.get_all_success"));
    }

    static async getById(req, res) {
        const { id } = req.params;
        const result = await IssueService.getById(id);
        return res.success(result, req.t("issue.get_success"));
    }

    static async create(req, res) {
        const result = await IssueService.create(req.body);
        return res.success(result, req.t("issue.create_success"));
    }

    static async update(req, res) {
        const { id } = req.params;
        const result = await IssueService.update(id, req.body);
        return res.success(result, req.t("issue.update_success"));
    }

    static async delete(req, res) {
        const { id } = req.params;
        const result = await IssueService.delete(id);
        return res.success(result, req.t("issue.delete_success"));
    }
}

module.exports = { Controller };
