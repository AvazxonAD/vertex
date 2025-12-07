const { db } = require("../../config/db/index");

class ForAuthorsDB {
  static async updateSeeCount(params) {
    const query = `UPDATE forauthors SET see = see + 1 WHERE id = $1 RETURNING *`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [result, countResult] = await Promise.all([
      db.query(
        `
        SELECT
          f.*
        FROM forauthors f
        WHERE f.is_active = true
        ORDER BY f.created_at DESC
        LIMIT $1 OFFSET $2
      `,
        [limit, offset]
      ),
      db.query(`SELECT COUNT(*) as total FROM forauthors WHERE is_active = true`),
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
      SELECT
        f.*
      FROM forauthors f
      WHERE f.id = $1
        AND f.is_active = true
    `,
      [id]
    );
    return result[0] || null;
  }

  static async create(params) {
    const result = await db.query(
      `
      INSERT INTO forauthors (title, description, content, icon, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, NOW(), NOW()) 
      RETURNING *
    `,
      params
    );

    return result[0];
  }

  static async createTags(params) {
    const result = await db.query(
      `
      INSERT INTO news_tags (news_id, tag_id) 
      VALUES ($1, $2) 
      RETURNING *
    `,
      params
    );

    return result[0];
  }

  static async deleteTags(params) {
    await db.query(`UPDATE news_tags SET is_active = false WHERE news_id = $1`, params);
  }

  static async deleteTagsById(params) {
    await db.query(`UPDATE news_tags SET is_active = false WHERE id = $1`, params);
  }

  static async update(params) {
    const query = `
      UPDATE forauthors 
      SET
        title = $2,
        description = $3,
        content = $4,
        icon = $5,
        updated_at = now()
      WHERE id = $1 
      RETURNING *
    `;

    const result = await db.query(query, params);

    return result[0];
  }

  static async delete(id) {
    const result = await db.query(
      `
      UPDATE forauthors
      SET is_active = false 
      WHERE id = $1 
      RETURNING id
    `,
      [id]
    );
    return result[0] || null;
  }
}

module.exports = { ForAuthorsDB };
