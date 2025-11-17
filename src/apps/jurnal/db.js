const { db } = require("../../config/db/index");

exports.JurnalsDB = class {
  static async create(params) {
    const query = `INSERT INTO jurnals(name, created_at, updated_at) VALUES($1, now(), now()) RETURNING *`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async update(params) {
    const query = `UPDATE jurnals SET name = $1, updated_at = now() WHERE id = $2 RETURNING *`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async getById(params) {
    const query = `SELECT * FROM jurnals WHERE id = $1 AND deleted_at IS NULL`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(params) {
    const query = `--sql
      SELECT
        *
      FROM jurnals
      WHERE deleted_at IS NULL
      ORDER BY name`;

    const result = await db.query(query, params);

    return result;
  }

  static async delete(params) {
    const query = `UPDATE jurnals SET deleted_at = now() WHERE id = $1 RETURNING *`;

    const result = await db.query(query, params);

    return result[0];
  }
};
