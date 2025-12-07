const { ForAuthorsDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");

class ForAuthorsService {
  static async get(page = 1, limit = 10) {
    const result = await ForAuthorsDB.get(page, limit);

    const baseUrl = process.env.BASE_URL;
    result.data = result.data.map((forauthors) => ({
      ...forauthors,
      icon: forauthors.icon ? `${baseUrl}/forauthors/icons/${forauthors.icon}` : null,
    }));

    return result;
  }

  static async getById(id) {
    const forauthors = await ForAuthorsDB.getById(id);
    if (!forauthors) {
      throw new ErrorResponse("forauthors.not_found", 404);
    }

    const baseUrl = process.env.BASE_URL;
    forauthors.icon = forauthors.icon ? `${baseUrl}/forauthors/icons/${forauthors.icon}` : null;

    const { see } = await ForAuthorsDB.updateSeeCount([forauthors.id]);
    forauthors.see = see;

    return forauthors;
  }

  static async create(data) {
    const result = await ForAuthorsDB.create([data.title, data.description, data.content, data.icon ? data.icon[0].filename : null]);
    return result;
  }

  static async updatePost(data) {
    const old_data = await ForAuthorsDB.getById(data.id);
    if (!old_data) {
      throw new ErrorResponse("forauthors.not_found", 404);
    }

    data.icon = data.icon ? data.icon[0].filename : old_data.icon;

    const result = await ForAuthorsDB.update([data.id, data.title, data.description, data.content, data.icon]);

    return result;
  }

  static async deletePost(id) {
    const existingPost = await ForAuthorsDB.getById(id);
    if (!existingPost) {
      throw new ErrorResponse("forauthors.not_found", 404);
    }

    await ForAuthorsDB.delete(id);
    return { message: "News deleted successfully" };
  }
}

module.exports = { ForAuthorsService };
