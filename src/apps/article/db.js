const { db } = require("../../config/db/index");

exports.ArticlesDB = class {
  static async create(params) {
    const query = `INSERT INTO articles(title, issn, color, image, field_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, now(), now()) RETURNING *`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async update(params) {
    const query = `UPDATE articles SET title = $1, issn = $2, color = $3, image = $4, field_id = $5, updated_at = now() WHERE id = $6 RETURNING *`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params) {
    const query = `--sql
      SELECT
        *,
        '${process.env.BASE_URL}/articles/file/' || image AS image_url
      FROM articles
      WHERE id = $1
        AND deleted_at IS NULL
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(params, filter) {
    const conditions = [];

    if (filter.field_id) {
      params.push(filter.field_id);
      conditions.push(`field_id = $${params.length}`);
    }

    const where = conditions.length ? `AND ${conditions.join(" AND ")}` : "";

    const query = `--sql
      SELECT
        *,
        '${process.env.BASE_URL}/articles/file/' || image AS image_url
      FROM articles
      WHERE deleted_at IS NULL
        ${where}
      ORDER BY created_at DESC`;

    const result = await db.query(query, params);

    return result;
  }

  static async delete(params) {
    const query = `UPDATE articles SET deleted_at = now() WHERE id = $1 RETURNING *`;

    const result = await db.query(query, params);

    return result[0];
  }
};
