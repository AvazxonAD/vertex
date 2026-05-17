const { db } = require("../../config/db/index");

exports.JurnalPostsDB = class {
  static async updateSeeCount(params) {
    const query = `
      UPDATE jurnal_posts SET
        see_count = see_count + 1
      WHERE id = $1
      RETURNING *`;
    const result = await db.query(query, params);
    return result[0];
  }

  static async updateDownloadCount(params) {
    const query = `
      UPDATE jurnal_posts SET
        download_count = download_count + 1
      WHERE pdf_file = $1
      RETURNING *`;
    const result = await db.query(query, params);
    return result[0];
  }

  static async create(params) {
    const query = `
      INSERT INTO jurnal_posts(
        title, description, body, dru_link, pdf_file,
        author_name, author_bio, author_academic_link, author_scholar_link, co_authors,
        year, volume_order, quarter,
        jurnal_id, jurnal_name, article_id, article_title,
        received, revision_received, accepted, published,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13,
        $14, $15, $16, $17,
        $18, $19, $20, $21,
        NOW(), NOW()
      )
      RETURNING *`;
    const result = await db.query(query, params);
    return result[0];
  }

  static async update(params) {
    const query = `
      UPDATE jurnal_posts SET
        title = $1,
        description = $2,
        body = $3,
        dru_link = $4,
        pdf_file = $5,
        author_name = $6,
        author_bio = $7,
        author_academic_link = $8,
        author_scholar_link = $9,
        co_authors = $10,
        year = $11,
        volume_order = $12,
        quarter = $13,
        jurnal_id = $14,
        jurnal_name = $15,
        article_id = $16,
        article_title = $17,
        received = $18,
        revision_received = $19,
        accepted = $20,
        published = $21,
        updated_at = NOW()
      WHERE id = $22
        AND deleted_at IS NULL
      RETURNING *`;
    const result = await db.query(query, params);
    return result[0];
  }

  static async getById(params) {
    const query = `
      SELECT
        p.*,
        CASE WHEN p.pdf_file IS NOT NULL
          THEN '${process.env.BASE_URL}/jurnal-posts/file/' || p.pdf_file
          ELSE NULL
        END AS pdf_file_url
      FROM jurnal_posts p
      WHERE p.id = $1
        AND p.deleted_at IS NULL`;
    const result = await db.query(query, params);
    return result[0];
  }

  static async get(page = 1, limit = 10, filter = {}) {
    const offset = (page - 1) * limit;
    const conditions = ["p.deleted_at IS NULL"];
    const params = [limit, offset];

    if (filter.search) {
      params.push(`%${filter.search}%`);
      conditions.push(`(p.title ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
    }
    if (filter.jurnal_id) {
      params.push(filter.jurnal_id);
      conditions.push(`p.jurnal_id = $${params.length}`);
    }
    if (filter.article_id) {
      params.push(filter.article_id);
      conditions.push(`p.article_id = $${params.length}`);
    }
    if (filter.year) {
      params.push(filter.year);
      conditions.push(`p.year = $${params.length}`);
    }
    if (filter.quarter) {
      params.push(filter.quarter);
      conditions.push(`p.quarter = $${params.length}`);
    }

    const where = conditions.join(" AND ");

    const query = `
      WITH data AS (
        SELECT
          p.*,
          CASE WHEN p.pdf_file IS NOT NULL
            THEN '${process.env.BASE_URL}/jurnal-posts/file/' || p.pdf_file
            ELSE NULL
          END AS pdf_file_url
        FROM jurnal_posts p
        WHERE ${where}
        ORDER BY p.id DESC
        LIMIT $1 OFFSET $2
      )
      SELECT
        COALESCE(json_agg(row_to_json(data)), '[]') AS data,
        (
          SELECT COALESCE(COUNT(p.id), 0)
          FROM jurnal_posts p
          WHERE ${where}
        ) AS total
      FROM data`;

    const result = await db.query(query, params);
    const total = parseInt(result[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      data: result[0].data,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        count: total,
        total_pages: totalPages,
        next_page: page < totalPages ? parseInt(page) + 1 : null,
        back_page: page > 1 ? parseInt(page) - 1 : null,
      },
    };
  }

  static async delete(params) {
    const query = `UPDATE jurnal_posts SET deleted_at = NOW() WHERE id = $1 RETURNING id`;
    const result = await db.query(query, params);
    return result[0];
  }
};
