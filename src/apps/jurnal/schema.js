const { Joi } = require("../../helper/joi");

exports.Schema = class {
  static now = new Date();

  static create() {
    return Joi.object({
      body: Joi.object({
        name: Joi.string().trim().max(1000).required(),
      }),
    });
  }

  static update() {
    return Joi.object({
      body: Joi.object({
        name: Joi.string().trim().max(1000).required(),
      }),

      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    });
  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    });
  }

  static get() {
    return Joi.object({
      query: Joi.object({}),
    });
  }

  static delete() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    });
  }
};
