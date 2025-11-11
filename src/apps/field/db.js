const { db } = require("../../config/db/index");

exports.FieldsDB = class {
  static async create(params) {
    const query = `INSERT INTO fields(name, jurnal_id, created_at, updated_at) VALUES($1, $2, now(), now()) RETURNING *`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async update(params) {
    const query = `UPDATE fields SET name = $1, jurnal_id = $2, updated_at = now() WHERE id = $3 RETURNING *`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params) {
    const query = `SELECT * FROM fields WHERE id = $1 AND deleted_at IS NULL`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(params, filter) {
    const conditions = [];

    if (filter.jurnal_id) {
      params.push(filter.jurnal_id);
      conditions.push(`j.id = $${params.length}`);
    }

    const where = conditions.length ? `AND ${conditions.join(" AND ")}` : "";

    const query = `--sql
      SELECT
        f.*,
        j.name as jurnal_name
      FROM fields f
      LEFT JOIN jurnals j ON j.id = f.jurnal_id
      WHERE f.deleted_at IS NULL
        ${where}
      ORDER BY f.created_at DESC`;

    const result = await db.query(query, params);

    return result;
  }

  static async delete(params) {
    const query = `UPDATE fields SET deleted_at = now() WHERE id = $1 RETURNING *`;

    const result = await db.query(query, params);

    return result[0];
  }
};
