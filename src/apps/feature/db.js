const { db } = require("../../config/db/index");

exports.FeaturesDB = class {
  static async updateSeeCount(params) {
    const query = `
      UPDATE features SET 
        see_count = see_count + 1 
      WHERE id = $1 
      RETURNING *`;

    const result = await db.query(query, params);
    return result[0];
  }

  static async updateDownloadCount(params) {
    const query = `
      UPDATE features SET 
        download_count = download_count + 1 
      WHERE pdf_file = $1
      RETURNING *`;

    const result = await db.query(query, params);
    return result[0];
  }

  static async create(params) {
    const query = `
      INSERT INTO features(
        jurnal_id, issue_id, article_id, title, description, body, dru_link, pdf_file, 
        received, revision_received, accepted, published, 
        created_at, updated_at
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now(), now()) 
      RETURNING *`;

    const result = await db.query(query, params);
    return result[0];
  }

  static async update(params) {
    const query = `
      UPDATE features SET 
        jurnal_id = $1, issue_id = $2, article_id = $3, title = $4, description = $5, 
        body = $6, dru_link = $7, pdf_file = $8, received = $9, revision_received = $10, 
        accepted = $11, published = $12, updated_at = now() 
      WHERE id = $13 
      RETURNING *`;

    const result = await db.query(query, params);
    return result[0];
  }

  static async getById(params) {
    const query = `
      SELECT f.*, 
             j.name as jurnal_name,
             i.quater as issue_quater,
             a.title as article_title,
            '${process.env.BASE_URL}/features/file/' || f.pdf_file AS pdf_file_url
      FROM features f
      LEFT JOIN jurnals j ON f.jurnal_id = j.id
      LEFT JOIN issue i ON f.issue_id = i.id
      LEFT JOIN articles a ON f.article_id = a.id
      WHERE f.id = $1 AND f.deleted_at IS NULL`;

    const result = await db.query(query, params);
    return result[0];
  }

  static async get(page = 1, limit = 10, filter) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [limit, offset];

    if (filter.search) {
      params.push(`%${filter.search}%`);
      conditions.push(`f.title ILIKE $${params.length}`);
    }
    if (filter.article_id) {
      params.push(filter.article_id);
      conditions.push(`f.article_id = $${params.length}`);
    }
    if (filter.jurnal_id) {
      params.push(filter.jurnal_id);
      conditions.push(`f.jurnal_id = $${params.length}`);
    }
    if (filter.issue_id) {
      params.push(filter.issue_id);
      conditions.push(`f.issue_id = $${params.length}`);
    }

    const where = conditions.length ? `AND ${conditions.join(" AND ")}` : "";

    const query = `
            WITH data AS (
                SELECT
                    f.*,
                    j.name as jurnal_name,
                    i.quater as issue_quater,
                    a.title as article_title,
                    '${process.env.BASE_URL}/features/file/' || f.pdf_file AS pdf_file_url
                FROM features f
                LEFT JOIN jurnals j ON f.jurnal_id = j.id
                LEFT JOIN issue i ON f.issue_id = i.id
                LEFT JOIN articles a ON f.article_id = a.id
                WHERE f.deleted_at IS NULL
                    ${where}
                ORDER BY f.id DESC
                LIMIT $1 OFFSET $2
            )
                
            SELECT
                COALESCE(json_agg(row_to_json(data)), '[]') as data,
                (
                    SELECT 
                        COALESCE(COUNT(f.id), 0)
                    FROM features f
                    LEFT JOIN jurnals j ON f.jurnal_id = j.id
                    LEFT JOIN issue i ON f.issue_id = i.id
                    LEFT JOIN articles a ON f.article_id = a.id
                    WHERE f.deleted_at IS NULL
                        ${where}
                ) as total
            FROM data 
        `;

    const data = await db.query(query, params);

    const total = parseInt(data[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      data: data[0].data,
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
    const query = `UPDATE features SET deleted_at = now() WHERE id = $1 RETURNING *`;
    const result = await db.query(query, params);
    return result[0];
  }

  // Author associations
  static async addAuthors(feature_id, author_ids) {
    if (!author_ids || author_ids.length === 0) return;

    const values = author_ids.map((author_id) => `(${feature_id}, ${author_id}, now(), now())`).join(",");
    const query = `INSERT INTO feature_authors(feature_id, author_id, created_at, updated_at) VALUES ${values}`;
    return await db.query(query);
  }

  static async deleteAuthorsByFeatureId(feature_id) {
    const query = `DELETE FROM feature_authors WHERE feature_id = $1`;
    return await db.query(query, [feature_id]);
  }

  static async getAuthorsByFeatureId(feature_id) {
    const query = `
      SELECT a.* 
      FROM authors a
      JOIN feature_authors fa ON a.id = fa.author_id
      WHERE fa.feature_id = $1 AND a.deleted_at IS NULL`;
    return await db.query(query, [feature_id]);
  }
};
