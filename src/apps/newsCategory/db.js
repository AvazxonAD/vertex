const { db } = require("../../config/db/index");

class NewsCategoryDB {
  static async get(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [result, countResult] = await Promise.all([
      db.query(
        `
        SELECT
          id,
          name,
          is_active,
          created_at,
          updated_at
        FROM new_categories
        WHERE is_active = true
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `,
        [limit, offset]
      ),
      db.query(`SELECT COUNT(*) as total FROM new_categories WHERE is_active = true`),
    ]);

    return { data: result, countResult: Number(countResult[0]?.total) };
  }

  static async getById(id) {
    const result = await db.query(
      `
      SELECT id, name, is_active, created_at, updated_at 
      FROM new_categories 
      WHERE id = $1
        AND is_active = true
    `,
      [id]
    );
    return result[0] || null;
  }

  static async create(data) {
    const { name, is_active = true } = data;
    const result = await db.query(
      `
      INSERT INTO new_categories (name, is_active, created_at, updated_at) 
      VALUES ($1, $2, NOW(), NOW()) 
      RETURNING id, name, is_active, created_at, updated_at
    `,
      [name, is_active]
    );
    return result[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }

    if (data.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(data.is_active);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE new_categories 
      SET ${fields.join(", ")} 
      WHERE id = $${paramIndex} 
      RETURNING id, name, is_active, created_at, updated_at
    `;

    const result = await db.query(query, values);
    return result[0] || null;
  }

  static async delete(id) {
    const result = await db.query(
      `
      DELETE FROM new_categories 
      WHERE id = $1 
      RETURNING id
    `,
      [id]
    );
    return result[0] || null;
  }
}

module.exports = { NewsCategoryDB };
