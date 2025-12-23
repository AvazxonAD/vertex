const { db } = require("../../config/db/index");

class AuthorsDB {
    static async get(page = 1, limit = 10, search = "") {
        const offset = (page - 1) * limit;
        let search_filter = ``


        if (search) {
            search_filter = `AND name ILIKE '%${search}%'`
        }

        const [result, countResult] = await Promise.all([
            db.query(
                `
                SELECT *
                FROM authors
                WHERE deleted_at IS NULL
                ${search_filter}
                ORDER BY id DESC
                LIMIT $1 OFFSET $2
            `,
                [limit, offset]
            ),
            db.query(`SELECT COUNT(*) as total FROM authors WHERE deleted_at IS NULL ${search_filter}`),
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
      FROM authors
      WHERE id = $1
        AND deleted_at IS NULL
    `,
            [id]
        );
        return result[0] || null;
    }

    static async create(params) {
        // params: [name, bio, academic_link, google_scholar_link]
        const result = await db.query(
            `
      INSERT INTO authors (name, bio, academic_link, google_scholar_link, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, NOW(), NOW()) 
      RETURNING *
    `,
            params
        );

        return result[0];
    }

    static async update(params) {
        // params: [id, name, bio, academic_link, google_scholar_link]
        const query = `
      UPDATE authors 
      SET
        name = $2,
        bio = $3,
        academic_link = $4,
        google_scholar_link = $5,
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
      UPDATE authors
      SET deleted_at = NOW() 
      WHERE id = $1 
      RETURNING id
    `,
            [id]
        );
        return result[0] || null;
    }
}

module.exports = { AuthorsDB };
