import { Schema, model, type Document } from "mongoose";

export interface IAuditLog extends Document {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: any;
    ip?: string;
    userAgent?: string;
    createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
    {
        userId: { type: String, index: true },
        action: { type: String, required: true, index: true },
        entity: { type: String, required: true, index: true },
        entityId: { type: String, index: true },
        details: { type: Schema.Types.Mixed },
        ip: { type: String },
        userAgent: { type: String },
    },
    { timestamps: true, versionKey: false }
);

export const AuditLogModel = model<IAuditLog>("AuditLog", auditLogSchema);
