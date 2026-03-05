import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate = (schema: z.ZodTypeAny) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const message = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                return next(new ApiError(400, message));
            }
            next(error);
        }
    };
};
