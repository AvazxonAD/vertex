const { db } = require("../../config/db/index");

exports.StorageDB = class {
  static async create(params) {
    const query = `INSERT INTO storage(file, created_at, updated_at) VALUES($1, $2, $3) RETURNING *`;

    const result = await db.query(query, params);

    return result;
  }

  static async getById(params) {
    const query = `SELECT * FROM storage WHERE id = $1 AND isdeleted = false`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(params) {
    const query = `SELECT * FROM storage WHERE isdeleted = false`;

    const result = await db.query(query, params);

    return result;
  }

  static async update(params) {
    const query = `UPDATE storage SET file = $1, updated_at = $2  WHERE id = $3 RETURNING *`;

    const result = await db.query(query, params);

    return result;
  }

  static async delete(params) {
    const query = `UPDATE storage SET isdeleted = true WHERE id = $1 RETURNING *`;

    const result = await db.query(query, params);

    return result;
  }
};
