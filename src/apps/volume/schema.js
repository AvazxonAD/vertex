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
                order: Joi.number().integer().required(),
                year: Joi.number().integer().min(1900).max(2100).required(),
            }),
        }).options({ stripUnknown: true });
    }

    static updateSchema() {
        return Joi.object({
            params: Joi.object({
                id: Joi.number().integer().positive().required(),
            }),
            body: Joi.object({
                order: Joi.number().integer().optional(),
                year: Joi.number().integer().min(1900).max(2100).optional(),
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
}

module.exports = { Schema };
