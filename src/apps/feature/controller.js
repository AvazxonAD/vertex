const { FeaturesService } = require("./service");
const path = require("path");
const mime = require("mime-types");
const fs = require("fs");

exports.Controller = class {
    static async create(req, res) {
        const result = await FeaturesService.create({
            ...req.body,
            file: req.file,
        });

        return res.success(result, req.t("system.create_success"));
    }

    static async getFile(req, res) {
        const file_path = path.join(__dirname, "../../../public/uploads/", req.params.file_name);

        try {
            await fs.promises.access(file_path);
        } catch (error) {
            throw new ErrorResponse("article.file_not_found", 404);
        }

        const file = await fs.promises.readFile(file_path);
        const content_type = mime.lookup(req.params.file_name);

        res.setHeader("Content-type", content_type);

        return res.send(file);
    }

    static async update(req, res) {
        const result = await FeaturesService.update({ ...req.params, ...req.body, file: req.file });

        return res.success(result, req.t("system.update_success"));
    }

    static async getById(req, res) {
        const result = await FeaturesService.getById(req.params.id);

        return res.success(result, req.t("system.get_success"));
    }

    static async get(req, res) {
        const { page = 1, limit = 10, search = "" } = req.query;
        const result = await FeaturesService.get(parseInt(page), parseInt(limit), search);

        return res.success(result.data, req.t("system.get_success"), 200, result.meta);
    }

    static async delete(req, res) {
        const result = await FeaturesService.delete(req.params.id);

        return res.success(result, req.t("system.delete_success"));
    }
};
