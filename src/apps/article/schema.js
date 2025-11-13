const { Joi } = require("../../helper/joi");

exports.Schema = class {
  static now = new Date();

  static create() {
    return Joi.object({
      body: Joi.object({
        title: Joi.string().trim().required(),
        issn: Joi.string().trim().required(),
        color: Joi.string().trim().required(),
        field_id: Joi.number().min(1).integer().required(),
      }),
    });
  }

  static update() {
    return Joi.object({
      body: Joi.object({
        title: Joi.string().trim().required(),
        issn: Joi.string().trim().required(),
        color: Joi.string().trim().required(),
        field_id: Joi.number().min(1).integer().required(),
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
      query: Joi.object({
        field_id: Joi.number().positive().allow(null, ""),
        jurnal_id: Joi.number().positive().allow(null, ""),
      }),
    });
  }

  static delete() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().min(1).integer().required(),
      }),
    });
  }

  static getFile() {
    return Joi.object({
      params: Joi.object({
        file_name: Joi.string().required(),
      }),
    });
  }
};
