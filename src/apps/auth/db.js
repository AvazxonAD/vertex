const { db } = require("../../config/db/index");

class UserDB {
  static async getByEmail(email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL", [email]);
    return result[0] || null;
  }
}

module.exports = { UserDB };
