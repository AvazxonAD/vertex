const { FeaturesDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");
const { JurnalsService } = require("../jurnal/service");
const { IssueDB } = require("../issue/db");
const { ArticlesDB } = require("../article/db");
const { AuthorsDB } = require("../authors/db");

exports.FeaturesService = class {
    static async create(data) {
        const file = data.file ? data.file.filename : null;

        data.authors = data.authors ? data.authors.split(",") : [];

        await JurnalsService.getById({ id: data.jurnal_id });

        const issue = await IssueDB.getById(data.issue_id);
        if (!issue) throw new ErrorResponse("issue.not_found", 404);

        const article = await ArticlesDB.getById([data.article_id]);
        if (!article) throw new ErrorResponse("article.not_found", 404);

        for (const author_id of data.authors) {
            const author = await AuthorsDB.getById(author_id);
            if (!author) throw new ErrorResponse(`author.not_found`, 404);
        }

        const featureParams = [
            data.jurnal_id,
            data.issue_id,
            data.article_id,
            data.title,
            data.description || null,
            data.body || null,
            data.dru_link || null,
            file,
            data.received || null,
            data.revision_received || null,
            data.accepted || null,
            data.published || null,
        ];

        const result = await FeaturesDB.create(featureParams);

        if (data.authors && data.authors.length > 0) {
            await FeaturesDB.addAuthors(result.id, data.authors);
        }

        result.authors = await FeaturesDB.getAuthorsByFeatureId(result.id);
        return result;
    }

    static async update(data) {
        const existing = await this.getById(data.id);

        const file = data.file ? data.file.filename : existing.pdf_file;

        data.authors = data.authors ? data.authors.split(",") : [];

        await JurnalsService.getById({ id: data.jurnal_id });

        const issue = await IssueDB.getById(data.issue_id);
        if (!issue) throw new ErrorResponse("issue.not_found", 404);

        const article = await ArticlesDB.getById([data.article_id]);
        if (!article) throw new ErrorResponse("article.not_found", 404);

        for (const author_id of data.authors) {
            const author = await AuthorsDB.getById(author_id);
            if (!author) throw new ErrorResponse(`author.not_found`, 404);
        }


        const featureParams = [
            data.jurnal_id,
            data.issue_id,
            data.article_id,
            data.title,
            data.description || null,
            data.body || null,
            data.dru_link || null,
            file,
            data.received || null,
            data.revision_received || null,
            data.accepted || null,
            data.published || null,
            data.id,
        ];

        const result = await FeaturesDB.update(featureParams);

        await FeaturesDB.deleteAuthorsByFeatureId(data.id);
        if (data.authors && data.authors.length > 0) {
            await FeaturesDB.addAuthors(data.id, data.authors);
        }

        result.authors = await FeaturesDB.getAuthorsByFeatureId(data.id);
        return result;
    }

    static async getById(id) {
        const result = await FeaturesDB.getById([id]);
        if (!result) {
            throw new ErrorResponse("feature.not_found", 404);
        }
        result.authors = await FeaturesDB.getAuthorsByFeatureId(id);
        return result;
    }

    static async get(page = 1, limit = 10, search = "") {
        const result = await FeaturesDB.get(page, limit, search);

        for (let item of result.data) {
            item.authors = await FeaturesDB.getAuthorsByFeatureId(item.id);
        }

        return result;
    }

    static async delete(id) {
        await this.getById(id);
        const result = await FeaturesDB.delete([id]);
        return result;
    }
};
