const { ArticlesDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");
const { FieldsService } = require("../field/service");
const { JurnalsService } = require("../jurnal/service");

exports.ArticlesService = class {
  static now = new Date();

  static async create(data) {
    if (!data.file) {
      throw new ErrorResponse("article.file_not_found", 404);
    }

    await FieldsService.getById({ id: data.field_id });

    const result = await ArticlesDB.create([data.title, data.issn, data.color, data.file.filename, data.field_id]);

    return result;
  }

  static async update(data) {
    const old_data = await this.getById(data);

    await FieldsService.getById({ id: data.field_id });

    const image = data.file ? data.file.filename : old_data.image;

    const result = await ArticlesDB.update([data.title, data.issn, data.color, image, data.field_id, data.id]);

    return result;
  }

  static async getById(data) {
    const result = await ArticlesDB.getById([data.id]);

    if (!result) {
      throw new ErrorResponse("articles.not_found", 404);
    }

    return result;
  }

  static async get(data) {
    if (data.field_id) {
      await FieldsService.getById({ id: data.field_id });
    }

    if (data.jurnal_id) {
      await JurnalsService.getById({ id: data.jurnal_id });
    }

    const result = await ArticlesDB.get([], data);

    return result;
  }

  static async delete(data) {
    await this.getById(data);

    const result = await ArticlesDB.delete([data.id]);

    return result;
  }
};
