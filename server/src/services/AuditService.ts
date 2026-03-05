import { auditRepository } from "../repositories/AuditRepository";

export class AuditService {
    async log(data: {
        userId?: string;
        action: string;
        entity: string;
        entityId?: string;
        details?: any;
        ip?: string;
        userAgent?: string;
    }) {
        try {
            await auditRepository.create(data as any);
        } catch (error) {
            console.error("Failed to create audit log:", error);
            // We don't want to crash the request if logging fails, 
            // but in a real enterprise app, we might send this to an external logger.
        }
    }
}

export const auditService = new AuditService();
