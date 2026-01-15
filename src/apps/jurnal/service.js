const { JurnalsDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");

exports.JurnalsService = class {
  static now = new Date();

  static async create(data) {
    const result = await JurnalsDB.create([data.name]);

    return result;
  }

  static async update(data) {
    await this.getById(data);

    const result = await JurnalsDB.update([data.name, data.id]);

    return result;
  }

  static async getById(data) {
    const result = await JurnalsDB.getById([data.id]);

    if (!result) {
      throw new ErrorResponse("jurnals.not_found", 404);
    }

    return result;
  }

  static async get(data) {
    const result = await JurnalsDB.get([], data);

    return result;
  }

  static async delete(data) {
    await this.getById(data);

    const result = await JurnalsDB.delete([data.id]);

    return result;
  }
};
