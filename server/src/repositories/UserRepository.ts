import { BaseRepository } from "./BaseRepository";
import { type IUser, UserModel } from "../models/User";

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel);
    }

    async findByEmail(email: string) {
        return this.model.findOne({ email, isDeleted: { $ne: true } }).select("+password +refreshToken").lean();
    }

    async findByIdWithSecrets(id: string) {
        return this.model.findOne({ _id: id, isDeleted: { $ne: true } }).select("+password +refreshToken").lean();
    }
}

export const userRepository = new UserRepository();
