const Joi = require("joi");

class MessageSchema {
  static getAllSchema() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().integer().min(1).optional().default(1),
        limit: Joi.number().integer().min(1).max(100).optional().default(10),
        status: Joi.string().valid("new", "read", "replied").optional(),
      }),
    }).options({ stripUnknown: true });
  }

  static getByIdSchema() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().positive().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static createSchema() {
    return Joi.object({
      body: Joi.object({
        name: Joi.string().trim().min(1).max(255).required().messages({
          "string.empty": "validation.name.required",
          "any.required": "validation.name.required",
        }),
        email: Joi.string().trim().email().max(255).required().messages({
          "string.email": "validation.email.invalid",
          "any.required": "validation.email.required",
        }),
        message: Joi.string().trim().min(1).max(5000).required().messages({
          "string.empty": "validation.message.required",
          "any.required": "validation.message.required",
        }),
      }),
    }).options({ stripUnknown: true });
  }

  static replySchema() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().positive().required(),
      }),
      body: Joi.object({
        reply: Joi.string().trim().min(1).max(10000).required().messages({
          "string.empty": "validation.reply.required",
          "any.required": "validation.reply.required",
        }),
        subject: Joi.string().trim().max(255).optional(),
      }),
    }).options({ stripUnknown: true });
  }

  static deleteSchema() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().positive().required(),
      }),
    }).options({ stripUnknown: true });
  }
}

module.exports = { MessageSchema };
