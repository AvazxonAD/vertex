const { db } = require("../../config/db/index");

exports.StorageDB = class {
  static async create(params) {
    const query = `INSERT INTO storage(file, content_type, type, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING *`;

    const result = await db.query(query, params);

    return result;
  }

  static async getById(params) {
    const query = `SELECT * FROM storage WHERE id = $1 AND isdeleted = false`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(params, filter) {
    const conditions = [];

    if (filter.content_type) {
      params.push(filter.content_type);
      conditions.push(`content_type = $${params.length}`);
    }

    if (filter.type) {
      params.push(filter.type);
      conditions.push(`type = $${params.length}`);
    }

    const where = conditions.length ? `AND ${conditions.join(" AND ")}` : "";

    const query = `
      WITH data AS (
        SELECT
          *
        FROM storage
        WHERE isdeleted = false
          ${where}
        OFFSET $1 LIMIT $2
      )
      SELECT
        COALESCE(JSON_AGG(ROW_TO_JSON(data)), '[]'::JSON) AS data,
        (
          SELECT
            COALESCE(COUNT(id), 0)::INTEGER
          FROM storage
          WHERE isdeleted = false
            ${where}
        ) AS count
      FROM data
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async update(params) {
    const query = `UPDATE storage SET file = $1, content_type = $2, updated_at = $3  WHERE id = $4 RETURNING *`;

    const result = await db.query(query, params);

    return result;
  }

  static async delete(params) {
    const query = `UPDATE storage SET isdeleted = true WHERE id = $1 RETURNING *`;

    const result = await db.query(query, params);

    return result;
  }
};
