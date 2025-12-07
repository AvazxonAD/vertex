const { db } = require("../../config/db/index");

class NewsDB {
  static async updateSeeCount(params) {
    const query = `UPDATE news SET see = see + 1 WHERE id = $1 RETURNING *`;

    const result = await db.query(query, params);

    return result[0];
  }

  static async get(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [result, countResult] = await Promise.all([
      db.query(
        `
        SELECT
          p.*,
          c.name as category_name,
          COALESCE(
              (
                SELECT 
                  JSON_AGG(JSON_BUILD_OBJECT(
                    'id', tg.id,
                    'tag_name', t.name
                  ))
                FROM news_tags tg
                JOIN tags t ON t.id = tg.tag_id
                WHERE tg.news_id = p.id
                  AND tg.is_active = true
                LIMIT 1
            ), '[]'::JSON) AS tags
        FROM news p
        LEFT JOIN new_categories c ON p.category_id = c.id
        WHERE p.is_active = true
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2
      `,
        [limit, offset]
      ),
      db.query(`SELECT COUNT(*) as total FROM news WHERE is_active = true`),
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
      SELECT p.*,
            c.name as category_name,
            COALESCE(
              (
                SELECT 
                  JSON_AGG(JSON_BUILD_OBJECT(
                    'id', tg.id,
                    'tag_name', t.name
                  ))
                FROM news_tags tg
                JOIN tags t ON t.id = tg.tag_id
                WHERE tg.news_id = p.id
                  AND tg.is_active = true
                LIMIT 1
            ), '[]'::JSON) AS tags
      FROM news p
      LEFT JOIN new_categories c ON p.category_id = c.id
      WHERE p.id = $1
        AND p.is_active = true
    `,
      [id]
    );
    return result[0] || null;
  }

  static async create(params, client) {
    const result = await client.query(
      `
      INSERT INTO news (title, description, content, image, category_id, gif, video, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
      RETURNING *
    `,
      params
    );

    return result.rows[0];
  }

  static async createTags(params, client) {
    const result = await client.query(
      `
      INSERT INTO news_tags (news_id, tag_id) 
      VALUES ($1, $2) 
      RETURNING *
    `,
      params
    );

    return result.rows[0];
  }

  static async deleteTags(params, client) {
    await client.query(`UPDATE news_tags SET is_active = false WHERE news_id = $1`, params);
  }

  static async deleteTagsById(params, client) {
    await client.query(`UPDATE news_tags SET is_active = false WHERE id = $1`, params);
  }

  static async update(params, client) {
    const query = `
      UPDATE news 
      SET
        title = $2,
        description = $3,
        content = $4,
        category_id = $5,
        image = $6,
        gif = $7,
        video = $8,
        updated_at = now()
      WHERE id = $1 
      RETURNING *
    `;

    const result = await client.query(query, params);

    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      `
      UPDATE news
      SET is_active = false 
      WHERE id = $1 
      RETURNING id
    `,
      [id]
    );
    return result[0] || null;
  }
}

module.exports = { NewsDB };
