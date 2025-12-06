const { StorageDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");
const fs = require("fs/promises");
const path = require("path");
const mime = require("mime-types");

exports.StorageService = class {
  static now = new Date();

  static async create(data) {
    const result = await StorageDB.create([data.file.filename, this.now, this.now]);

    return result;
  }

  static async update(data) {
    const result = await StorageDB.update([data.file.filename, this.now, data.params.id]);

    return result;
  }

  static async get(data) {
    const result = await StorageDB.get([]);

    return result;
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
