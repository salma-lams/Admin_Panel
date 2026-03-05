import { BaseRepository } from "./BaseRepository";
import { type IAuditLog, AuditLogModel } from "../models/AuditLog";

export class AuditRepository extends BaseRepository<IAuditLog> {
    constructor() {
        super(AuditLogModel);
    }
}

export const auditRepository = new AuditRepository();
