const { TagDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");

class TagService {
  static async getAllTags(page = 1, limit = 10) {
    const result = await TagDB.get(page, limit);
    return result;
  }

  static async getById(id) {
    const tag = await TagDB.getById(id);
    if (!tag) {
      throw new ErrorResponse("tag.not_found", 404);
    }
    return tag;
  }

  static async createTag(data) {
    const tag = await TagDB.create(data);
    return tag;
  }

  static async updateTag(id, data) {
    const existingTag = await TagDB.getById(id);
    if (!existingTag) {
      throw new ErrorResponse("tag.not_found", 404);
    }

    const tag = await TagDB.update(id, data);
    return tag;
  }

  static async deleteTag(id) {
    const existingTag = await TagDB.getById(id);
    if (!existingTag) {
      throw new ErrorResponse("tag.not_found", 404);
    }

    await TagDB.delete(id);
    return { message: "Tag deleted successfully" };
  }
}

module.exports = { TagService };
