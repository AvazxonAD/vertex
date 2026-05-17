const { JurnalPostsDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");

function parseCoAuthors(value) {
  if (value == null || value === "") return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function toParams(data, file) {
  const pdf = file ? file.filename : data.pdf_file || null;
  return [
    data.title,
    data.description || null,
    data.body || null,
    data.dru_link || null,
    pdf,

    data.author_name || null,
    data.author_bio || null,
    data.author_academic_link || null,
    data.author_scholar_link || null,
    JSON.stringify(parseCoAuthors(data.co_authors)),

    data.year ? parseInt(data.year) : null,
    data.volume_order ? parseInt(data.volume_order) : null,
    data.quarter ? parseInt(data.quarter) : null,

    data.jurnal_id ? parseInt(data.jurnal_id) : null,
    data.jurnal_name || null,
    data.article_id ? parseInt(data.article_id) : null,
    data.article_title || null,

    data.received || null,
    data.revision_received || null,
    data.accepted || null,
    data.published || null,
  ];
}

exports.JurnalPostsService = class {
  static async updateDownloadCount(file_name) {
    return await JurnalPostsDB.updateDownloadCount([file_name]);
  }

  static async create(data) {
    const params = toParams(data, data.file);
    const result = await JurnalPostsDB.create(params);
    return result;
  }

  static async update(data) {
    const existing = await JurnalPostsDB.getById([data.id]);
    if (!existing) throw new ErrorResponse("jurnal_post.not_found", 404);

    const merged = {
      ...data,
      pdf_file: data.file ? undefined : existing.pdf_file,
    };

    const params = toParams(merged, data.file);
    params.push(data.id);

    const result = await JurnalPostsDB.update(params);
    return result;
  }

  static async getById(id, { incrementSeen = false } = {}) {
    const result = await JurnalPostsDB.getById([id]);
    if (!result) throw new ErrorResponse("jurnal_post.not_found", 404);

    if (incrementSeen) {
      await JurnalPostsDB.updateSeeCount([id]);
    }

    return result;
  }

  static async get(page = 1, limit = 10, filter = {}) {
    return await JurnalPostsDB.get(page, limit, filter);
  }

  static async delete(id) {
    await this.getById(id);
    const result = await JurnalPostsDB.delete([id]);
    return result;
  }
};
