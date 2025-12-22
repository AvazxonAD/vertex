const { VolumeDB } = require("./db");
const { ErrorResponse } = require("../../helper/errorResponse");

class VolumeService {
    static async getLastVolume() {
        return await VolumeDB.getLastVolume();
    }

    static async get(page = 1, limit = 10) {
        return await VolumeDB.get(page, limit);
    }

    static async getById(id) {
        const volume = await VolumeDB.getById(id);
        if (!volume) {
            throw new ErrorResponse("volume.not_found", 404);
        }
        return volume;
    }

    static async create(data) {
        const last_order = await this.getLastVolume();

        return await VolumeDB.create([last_order.order + 1, data.year]);
    }

    static async update(id, data) {
        const old_data = await VolumeDB.getById(id);
        if (!old_data) {
            throw new ErrorResponse("volume.not_found", 404);
        }

        const order = data.order !== undefined ? data.order : old_data.order;
        const year = data.year !== undefined ? data.year : old_data.year;

        return await VolumeDB.update([id, order, year]);
    }

    static async delete(id) {
        const existingVolume = await VolumeDB.getById(id);
        if (!existingVolume) {
            throw new ErrorResponse("volume.not_found", 404);
        }

        await VolumeDB.delete(id);
        return { message: "Volume deleted successfully" };
    }
}

module.exports = { VolumeService };
