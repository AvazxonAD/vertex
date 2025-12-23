const { db } = require("../../config/db/index");

class VolumeDB {
  static async getLastVolume(params) {
    const query = `
      SELECT
        *
      FROM volume
      WHERE deleted_at IS NULL
      ORDER BY id DESC 
      LIMIT 1
    `;
    const result = await db.query(query, params);
    return result[0] || { order: 0 };
  }

  static async getByYear(params) {
    const query = `
      SELECT
        *
      FROM volume
      WHERE deleted_at IS NULL
        AND year = $1
      ORDER BY id DESC 
      LIMIT 1
    `;
    const result = await db.query(query, params);
    return result[0]
  }

  static async get(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [result, countResult] = await Promise.all([
      db.query(
        `
        SELECT *
        FROM volume
        WHERE deleted_at IS NULL
        ORDER BY "order" DESC
        LIMIT $1 OFFSET $2
      `,
        [limit, offset]
      ),
      db.query(`SELECT COUNT(*) as total FROM volume WHERE deleted_at IS NULL`),
    ]);

    const total = parseInt(countResult[0].total);
    const totalPages = Math.ceil(total / limit);

    const next_page = page < totalPages ? page + 1 : null;
    const back_page = page > 1 ? page - 1 : null;

    return {
      data: result,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        count: total,
        total_pages: totalPages,
        next_page,
        back_page,
        offset,
      },
    };
  }

  static async getById(id) {
    const result = await db.query(
      `
      SELECT *
      FROM volume
      WHERE id = $1
        AND deleted_at IS NULL
    `,
      [id]
    );
    return result[0] || null;
  }

  static async create(params) {
    // params expected: [order, year]
    const result = await db.query(
      `
      INSERT INTO volume ("order", year, created_at, updated_at) 
      VALUES ($1, $2, NOW(), NOW()) 
      RETURNING *
    `,
      params
    );

    return result[0];
  }

  static async update(params) {
    const query = `
      UPDATE volume 
      SET
        year = $2,
        updated_at = now()
      WHERE id = $1 
        AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async delete(id) {
    const result = await db.query(
      `
      UPDATE volume
      SET deleted_at = NOW() 
      WHERE id = $1 
      RETURNING id
    `,
      [id]
    );
    return result[0] || null;
  }
}

module.exports = { VolumeDB };
