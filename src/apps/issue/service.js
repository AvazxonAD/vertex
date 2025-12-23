const { IssueDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");
const { VolumeService } = require("../volume/service");

class IssueService {
    static async get(page = 1, limit = 10) {
        return await IssueDB.get(page, limit);
    }

    static async getById(id) {
        const issue = await IssueDB.getById(id);
        if (!issue) {
            throw new ErrorResponse("issue.not_found", 404);
        }
        return issue;
    }

    static async create(data) {
        await VolumeService.getById(data.volume_id);
        const check = await IssueDB.getByQuarter([data.volume_id, data.quater]);
        if (check) {
            throw new ErrorResponse("issue.already_exists", 400);
        }
        return await IssueDB.create([data.volume_id, data.quater]);
    }

    static async update(id, data) {
        const old_data = await IssueDB.getById(id);
        if (!old_data) {
            throw new ErrorResponse("issue.not_found", 404);
        }
        await VolumeService.getById(data.volume_id);
        if (old_data.volume_id !== data.volume_id || old_data.quater !== data.quater) {
            const check = await IssueDB.getByQuarter([data.volume_id, data.quater]);
            if (check) {
                throw new ErrorResponse("issue.already_exists", 400);
            }
        }
        return await IssueDB.update([id, data.volume_id, data.quater]);
    }

    static async delete(id) {
        const existingIssue = await IssueDB.getById(id);
        if (!existingIssue) {
            throw new ErrorResponse("issue.not_found", 404);
        }

        await IssueDB.delete(id);
        return { message: "Issue deleted successfully" };
    }
}

module.exports = { IssueService };
