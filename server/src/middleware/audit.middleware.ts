import type { Request, Response, NextFunction } from "express";
import { auditService } from "../services/AuditService";
import type { AuthRequest } from "./authenticate";

export function auditLog(action: string, entity: string) {
    return (req: Request, _res: Response, next: NextFunction) => {
        // We wrap the response.send/json to log after the request is finished
        const originalSend = _res.send;
        _res.send = function (body) {
            const authReq = req as AuthRequest;

            // Only log successful modifications or specific actions
            if (_res.statusCode >= 200 && _res.statusCode < 300) {
                auditService.log({
                    userId: authReq.user?.id,
                    action,
                    entity,
                    entityId: Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
                    details: {
                        method: req.method,
                        path: req.path,
                        statusCode: _res.statusCode,
                    },
                    ip: typeof req.ip === "string" ? req.ip : (Array.isArray(req.ip) ? req.ip[0] : undefined),
                    userAgent: Array.isArray(req.headers["user-agent"])
                        ? req.headers["user-agent"][0]
                        : req.headers["user-agent"],
                });
            }

            return originalSend.call(this, body);
        };
        next();
    };
}
