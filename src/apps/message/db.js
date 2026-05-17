const { db } = require("../../config/db/index");

class MessageDB {
  static async get(page = 1, limit = 10, status) {
    const offset = (page - 1) * limit;

    const whereParts = ["deleted_at IS NULL"];
    const params = [];
    if (status) {
      params.push(status);
      whereParts.push(`status = $${params.length}`);
    }
    const whereSql = `WHERE ${whereParts.join(" AND ")}`;

    const listParams = [...params, limit, offset];
    const limitIdx = params.length + 1;
    const offsetIdx = params.length + 2;

    const [data, countResult] = await Promise.all([
      db.query(
        `
        SELECT id, name, email, message, status, admin_reply, replied_at, created_at, updated_at
        FROM messages
        ${whereSql}
        ORDER BY created_at DESC
        LIMIT $${limitIdx} OFFSET $${offsetIdx}
        `,
        listParams
      ),
      db.query(`SELECT COUNT(*)::int AS total FROM messages ${whereSql}`, params),
    ]);

    return { data, countResult: Number(countResult[0]?.total || 0) };
  }

  static async getById(id) {
    const result = await db.query(
      `
      SELECT id, name, email, message, status, admin_reply, replied_at, created_at, updated_at
      FROM messages
      WHERE id = $1 AND deleted_at IS NULL
      `,
      [id]
    );
    return result[0] || null;
  }

  static async create({ name, email, message }) {
    const result = await db.query(
      `
      INSERT INTO messages (name, email, message, status, created_at, updated_at)
      VALUES ($1, $2, $3, 'new', NOW(), NOW())
      RETURNING id, name, email, message, status, admin_reply, replied_at, created_at, updated_at
      `,
      [name, email, message]
    );
    return result[0];
  }

  static async markRead(id) {
    const result = await db.query(
      `
      UPDATE messages
      SET status = CASE WHEN status = 'new' THEN 'read' ELSE status END,
          updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, name, email, message, status, admin_reply, replied_at, created_at, updated_at
      `,
      [id]
    );
    return result[0] || null;
  }

  static async setReplied(id, adminReply) {
    const result = await db.query(
      `
      UPDATE messages
      SET status = 'replied',
          admin_reply = $2,
          replied_at = NOW(),
          updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, name, email, message, status, admin_reply, replied_at, created_at, updated_at
      `,
      [id, adminReply]
    );
    return result[0] || null;
  }

  static async delete(id) {
    const result = await db.query(
      `
      UPDATE messages
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id
      `,
      [id]
    );
    return result[0] || null;
  }

  static async stats() {
    const result = await db.query(
      `
      SELECT
        COUNT(*)::int                                              AS total,
        COUNT(*) FILTER (WHERE status = 'new')::int                AS new_count,
        COUNT(*) FILTER (WHERE status = 'read')::int               AS read_count,
        COUNT(*) FILTER (WHERE status = 'replied')::int            AS replied_count
      FROM messages
      WHERE deleted_at IS NULL
      `
    );
    return result[0] || { total: 0, new_count: 0, read_count: 0, replied_count: 0 };
  }
}

module.exports = { MessageDB };
