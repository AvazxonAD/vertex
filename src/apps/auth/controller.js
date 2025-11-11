const { AuthService } = require("./service");

class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });

    return res.success(result, req.t("auth.login_success"));
  }
}

module.exports = { AuthController };
