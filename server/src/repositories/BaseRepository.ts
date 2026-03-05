import type { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";

export class BaseRepository<T extends Document> {
    constructor(protected readonly model: Model<T>) { }

    async find(
        filter: FilterQuery<T> = {},
        options: { page?: number; limit?: number; sort?: any; populate?: any } = {}
    ) {
        const { page = 1, limit = 10, sort = { createdAt: -1 }, populate } = options;

        // Always filter out soft-deleted items
        const queryFilter = { ...filter, isDeleted: { $ne: true } };

        const [data, total] = await Promise.all([
            this.model.find(queryFilter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate(populate || "")
                .lean(),
            this.model.countDocuments(queryFilter),
        ]);

        return {
            data,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }

    async findById(id: string, populate?: any) {
        return this.model.findOne({ _id: id, isDeleted: { $ne: true } } as FilterQuery<T>)
            .populate(populate || "")
            .lean();
    }

    async findOne(filter: FilterQuery<T>, populate?: any) {
        return this.model.findOne({ ...filter, isDeleted: { $ne: true } })
            .populate(populate || "")
            .lean();
    }

    async create(data: Partial<T>) {
        return this.model.create(data);
    }

    async update(id: string, data: UpdateQuery<T>, options: QueryOptions = { new: true }) {
        return this.model.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } } as FilterQuery<T>,
            data,
            options
        ).lean();
    }

    async delete(id: string, soft = true) {
        if (soft) {
            return this.model.findByIdAndUpdate(id, {
                isDeleted: true,
                deletedAt: new Date(),
            } as UpdateQuery<T>).lean();
        }
        return this.model.findByIdAndDelete(id).lean();
    }
}
