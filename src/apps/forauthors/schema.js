const Joi = require("joi");

class Schema {
  static getAllSchema() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().integer().min(1).optional().default(1),
        limit: Joi.number().integer().min(1).max(100).optional().default(10),
      }),
    }).options({ stripUnknown: true });
  }

  static createSchema() {
    return Joi.object({
      body: Joi.object({
        title: Joi.string().min(1).max(255).required(),
        description: Joi.string().optional().allow(""),
        content: Joi.string().min(1).required(),
      }),
    }).options({ stripUnknown: true });
  }

  static updateSchema() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().positive().required(),
      }),
      body: Joi.object({
        title: Joi.string().min(1).max(255).optional(),
        description: Joi.string().optional().allow(""),
        content: Joi.string().min(1).optional(),
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

  static deleteSchema() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().positive().required(),
      }),
    }).options({ stripUnknown: true });
  }

  static getFileSchema() {
    return Joi.object({
      params: Joi.object({
        filename: Joi.string().required(),
      }),
    }).options({ stripUnknown: true });
  }
}

module.exports = { Schema };
