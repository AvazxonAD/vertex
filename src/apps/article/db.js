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

  static async getByName(params) {
    const query = `--sql
      SELECT
        *,
        '${process.env.BASE_URL}/articles/file/' || image AS image_url
      FROM articles
      WHERE title = $1
        AND deleted_at IS NULL
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(params, filter) {
    const conditions = [];

    if (filter.field_id) {
      params.push(filter.field_id);
      conditions.push(`f.id = $${params.length}`);
    }

    if (filter.jurnal_id) {
      params.push(filter.jurnal_id);
      conditions.push(`j.id = $${params.length}`);
    }

    const where = conditions.length ? `AND ${conditions.join(" AND ")}` : "";

    const query = `--sql
      SELECT
        a.*,
        f.name AS field_name,
        j.name AS jurnal_name,
        j.id AS jurnal_id,
        '${process.env.BASE_URL}/articles/file/' || a.image AS image_url
      FROM articles a
      JOIN fields f ON f.id = a.field_id
      JOIN jurnals j ON j.id = f.jurnal_id
      WHERE a.deleted_at IS NULL
        ${where}
      ORDER BY a.title`;

    const result = await db.query(query, params);

    return result;
  }

  static async delete(params) {
    const query = `UPDATE articles SET deleted_at = now() WHERE id = $1 RETURNING *`;

    const result = await db.query(query, params);

    return result[0];
  }
};
