import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Log the error using winston
    logger.error(`${req.method} ${req.path} - ${statusCode} - ${err.message}`, {
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    // Keep response concise for production
    res.status(statusCode).json(new ApiResponse(
        message,
        null,
        process.env.NODE_ENV === "development" ? { stack: err.stack } : undefined
    ));
};
