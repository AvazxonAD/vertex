const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { UserDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");

class AuthService {
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async login(data) {
    const { email, password } = data;

    const user = await UserDB.getByEmail(email);
    if (!user) {
      throw new ErrorResponse("auth.user_not_found", 404);
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new ErrorResponse("auth.wrong_password", 403);
    }

    const token = this.generateToken(user);

    return {
      token,
      user,
    };
  }

  static generateToken(payload) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;

    return jwt.sign(payload, secret, { expiresIn });
  }
}

module.exports = { AuthService };
