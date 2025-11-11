const { FieldsDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");
const { JurnalsService } = require("../jurnal/service");

exports.FieldsService = class {
  static now = new Date();

  static async create(data) {
    await JurnalsService.getById({ id: data.jurnal_id });
    const result = await FieldsDB.create([data.name, data.jurnal_id]);

    return result;
  }

  static async update(data) {
    await this.getById(data);
    await JurnalsService.getById({ id: data.jurnal_id });

    const result = await FieldsDB.update([data.name, data.jurnal_id, data.id]);

    return result;
  }

  static async getById(data) {
    const result = await FieldsDB.getById([data.id]);

    if (!result) {
      throw new ErrorResponse("fields.not_found", 404);
    }

    return result;
  }

  static async get(data) {
    if (data.jurnal_id) {
      await JurnalsService.getById({ id: data.jurnal_id });
    }
    const result = await FieldsDB.get([], data);

    return result;
  }

  static async delete(data) {
    await this.getById(data);

    const result = await FieldsDB.delete([data.id]);

    return result;
  }
};
