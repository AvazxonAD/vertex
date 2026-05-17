const { Joi } = require("../../helper/joi");

const coAuthorItem = Joi.object({
  name: Joi.string().max(255).required(),
  bio: Joi.string().allow("", null),
  academic_link: Joi.string().allow("", null),
  scholar_link: Joi.string().allow("", null),
});

const bodySchema = {
  title: Joi.string().max(500).required(),
  description: Joi.string().allow("", null),
  body: Joi.string().allow("", null),
  dru_link: Joi.string().allow("", null),

  author_name: Joi.string().max(255).allow("", null),
  author_bio: Joi.string().allow("", null),
  author_academic_link: Joi.string().allow("", null),
  author_scholar_link: Joi.string().allow("", null),
  co_authors: Joi.alternatives().try(
    Joi.array().items(coAuthorItem),
    Joi.string().allow("", null)
  ),

  year: Joi.number().integer().min(1900).max(2200).allow(null, ""),
  volume_order: Joi.number().integer().allow(null, ""),
  quarter: Joi.number().integer().valid(1, 2, 3, 4).allow(null, ""),

  jurnal_id: Joi.number().integer().allow(null, ""),
  jurnal_name: Joi.string().max(255).allow("", null),
  article_id: Joi.number().integer().allow(null, ""),
  article_title: Joi.string().max(500).allow("", null),

  received: Joi.date().iso().allow(null, ""),
  revision_received: Joi.date().iso().allow(null, ""),
  accepted: Joi.date().iso().allow(null, ""),
  published: Joi.date().iso().allow(null, ""),
};

exports.Schema = class {
  static create() {
    return Joi.object({
      body: Joi.object(bodySchema),
    });
  }

  static update() {
    return Joi.object({
      params: Joi.object({
        id: Joi.number().integer().required(),
      }),
      body: Joi.object(bodySchema),
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
        jurnal_id: Joi.number().integer().allow("", null),
        article_id: Joi.number().integer().allow("", null),
        year: Joi.number().integer().allow("", null),
        quarter: Joi.number().integer().valid(1, 2, 3, 4).allow("", null),
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
