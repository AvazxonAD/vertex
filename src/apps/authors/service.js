const { AuthorsDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");

class AuthorsService {
    static async get(page = 1, limit = 10, search = "") {
        return await AuthorsDB.get(page, limit, search);
    }

    static async getById(id) {
        const author = await AuthorsDB.getById(id);
        if (!author) {
            throw new ErrorResponse("author.not_found", 404);
        }
        return author;
    }

    static async create(data) {
        return await AuthorsDB.create([
            data.name,
            data.bio,
            data.academic_link,
            data.google_scholar_link
        ]);
    }

    static async update(id, data) {
        const check = await AuthorsDB.getById(id);
        if (!check) {
            throw new ErrorResponse("author.not_found", 404);
        }

        return await AuthorsDB.update([
            id,
            data.name,
            data.bio,
            data.academic_link,
            data.google_scholar_link
        ]);
    }

    static async delete(id) {
        const existingAuthor = await AuthorsDB.getById(id);
        if (!existingAuthor) {
            throw new ErrorResponse("author.not_found", 404);
        }

        await AuthorsDB.delete(id);
        return { message: "Author deleted successfully" };
    }
}

module.exports = { AuthorsService };
