const Joi = require("joi");

class AuthSchema {
  static loginSchema() {
    return Joi.object({
      body: Joi.object({
        email: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(1).max(255).required(),
      }),
    }).options({ stripUnknown: true });
  }
}

module.exports = { AuthSchema };
