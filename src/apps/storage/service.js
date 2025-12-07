const { StorageDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");
const fs = require("fs/promises");
const path = require("path");
const mime = require("mime-types");
const { HelperFunctions } = require("../../helper/functions");

exports.StorageService = class {
  static now = new Date();

  static async create(data) {
    const result = await StorageDB.create([data.file.filename, data.file.mimetype, data.body.type, this.now, this.now]);
    return result;
  }

  static async update(data) {
    const result = await StorageDB.update([data.file.filename, data.file.mimetype, this.now, data.params.id]);
    return result;
  }

  static async get({ page = 1, limit = 20, content_type, type }) {
    const offset = (page - 1) * limit;

    const result = await StorageDB.get([offset, limit], { content_type, type });

    const meta = HelperFunctions.pagination({ count: result.count, page, limit });

    return { data: result.data, meta };
  }

  static async getById(data) {
    const result = await StorageDB.getById([data.id]);

    if (!result) {
      throw new ErrorResponse("storage.not_found", 404);
    }

    const file_path = path.join(__dirname, `../../../public/uploads/${result.file}`);

    try {
      await fs.access(file_path, fs.constants.R_OK);
    } catch (error) {
      throw new ErrorResponse("storage.not_found", 404);
    }

    const file = await fs.readFile(file_path);

    const content_type = mime.lookup(result.file);

    return { file, content_type, file_path };
  }

  static async delete(data) {
    const result = await StorageDB.delete([data.id]);

    return result;
  }
};
