const { NewsDB } = require("./db");
const { NewsCategoryService } = require("../newsCategory/service");
const { ErrorResponse } = require("../../helper/errorResponse");
const { db } = require("../../config/db");
const { TagService } = require("../newsTag/service");

class NewsService {
  static async get(page = 1, limit = 10, id) {
    const result = await NewsDB.get(page, limit, id);

    const baseUrl = process.env.BASE_URL;
    result.data = result.data.map((news) => ({
      ...news,
      image: news.image ? `${baseUrl}/news/images/${news.image}` : null,
      video: news.video ? `${baseUrl}/news/videos/${news.video}` : null,
      gif: news.gif ? `${baseUrl}/news/gifs/${news.gif}` : null,
    }));

    return result;
  }

  static async getById(id) {
    const news = await NewsDB.getById(id);
    if (!news) {
      throw new ErrorResponse("news.not_found", 404);
    }

    const baseUrl = process.env.BASE_URL;
    news.image = news.image ? `${baseUrl}/news/images/${news.image}` : null;
    news.video = news.video ? `${baseUrl}/news/videos/${news.video}` : null;
    news.gif = news.gif ? `${baseUrl}/news/gifs/${news.gif}` : null;

    const { see } = await NewsDB.updateSeeCount([news.id]);
    news.see = see;

    return news;
  }

  static async create(data) {
    if (data.category_id) {
      await NewsCategoryService.getCategoryById(data.category_id);
    }

    const news = await db.transaction(async (client) => {
      const result = await NewsDB.create(
        [
          data.title,
          data.description,
          data.content,
          data.image ? data.image[0].filename : null,
          data.category_id,
          data.gif ? data.gif[0].filename : null,
          data.video ? data.video[0].filename : null,
        ],
        client
      );

      data.tags = data.tags ? data.tags.split(",") : [];

      if (data.tags.length) {
        for (let tag of data.tags) {
          await TagService.getById(tag);

          await NewsDB.createTags([result.id, tag], client);
        }
      }

      return result;
    });

    return news;
  }

  static async updatePost(data) {
    const old_data = await NewsDB.getById(data.id);
    if (!old_data) {
      throw new ErrorResponse("news.not_found", 404);
    }

    if (data.category_id) {
      await NewsCategoryService.getCategoryById(data.category_id);
    }

    data.tags = data.tags ? data.tags.split(",") : [];

    const result = await db.transaction(async (client) => {
      data.image = data.image ? data.image[0].filename : old_data.image;
      data.gif = data.gif ? data.gif[0].filename : old_data.gif;
      data.video = data.video ? data.video[0].filename : old_data.video;

      const news = await NewsDB.update([data.id, data.title, data.description, data.content, data.category_id, data.image, data.gif, data.video], client);

      for (let tag of data.tags) {
        const check = await old_data.tags.find((item) => item.id === tag);
        if (!check) {
          await NewsDB.createTags([data.id, tag], client);
        }
      }

      for (let tag of old_data.tags) {
        const check = data.tags.find((item) => item === tag.id);
        if (!check) {
          await NewsDB.deleteTagsById([tag.id], client);
        }
      }

      return news;
    });

    return result;
  }

  static async deletePost(id) {
    const existingPost = await NewsDB.getById(id);
    if (!existingPost) {
      throw new ErrorResponse("news.not_found", 404);
    }

    await NewsDB.delete(id);
    return { message: "News deleted successfully" };
  }
}

module.exports = { NewsService };
