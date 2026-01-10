const { Joi } = require("../../helper/joi");

exports.Schema = class {
  static create() {
    return Joi.object({
      body: Joi.object({
        jurnal_id: Joi.number().integer().required(),
        issue_id: Joi.number().integer().required(),
        article_id: Joi.number().integer().required(),
        title: Joi.string().max(500).required(),
        description: Joi.string().allow("", null),
        body: Joi.string().allow("", null),
        dru_link: Joi.string().allow("", null),
        pdf_file: Joi.string().allow("", null),
        received: Joi.date().iso().allow(null),
        revision_received: Joi.date().iso().allow(null),
        accepted: Joi.date().iso().allow(null),
        published: Joi.date().iso().allow(null),
        authors: Joi.string().allow(""),
      }),
    });
  }

  static update() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().required(),
      }),
      body: Joi.object({
        jurnal_id: Joi.number().integer().required(),
        issue_id: Joi.number().integer().required(),
        article_id: Joi.number().integer().required(),
        title: Joi.string().max(500).required(),
        description: Joi.string().allow("", null),
        body: Joi.string().allow("", null),
        dru_link: Joi.string().allow("", null),
        pdf_file: Joi.string().allow("", null),
        received: Joi.date().iso().allow(null),
        revision_received: Joi.date().iso().allow(null),
        accepted: Joi.date().iso().allow(null),
        published: Joi.date().iso().allow(null),
        authors: Joi.string().allow(""),
      }),
    });
  }

  static getById() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().required(),
      }),
    });
  }

  static get() {
    return Joi.object({
      query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        search: Joi.string().allow("", null),
        jurnal_id: Joi.number().integer().allow(""),
        issue_id: Joi.number().integer().allow(""),
        article_id: Joi.number().integer().allow(""),
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

  static delete() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().required(),
      }),
    });
  }
};
