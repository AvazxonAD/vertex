const { VolumeService } = require("./service");

class Controller {
    static async get(req, res) {
        const { page = 1, limit = 10 } = req.query;
        const result = await VolumeService.get(parseInt(page), parseInt(limit));
        return res.success(result, req.t("volume.get_all_success"));
    }

    static async getById(req, res) {
        const { id } = req.params;
        const result = await VolumeService.getById(id);
        return res.success(result, req.t("volume.get_success"));
    }

    static async create(req, res) {
        const result = await VolumeService.create(req.body);
        return res.success(result, req.t("volume.create_success"));
    }

    static async update(req, res) {
        const { id } = req.params;
        const result = await VolumeService.update(id, req.body);
        return res.success(result, req.t("volume.update_success"));
    }

    static async delete(req, res) {
        const { id } = req.params;
        const result = await VolumeService.delete(id);
        return res.success(result, req.t("volume.delete_success"));
    }
}

module.exports = { Controller };
