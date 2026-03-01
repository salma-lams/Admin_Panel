import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";
import { ProductModel } from "../models/Product";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ApiResponse } from "../utils/ApiResponse";

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);
dashboardRouter.use(authorize("admin"));

dashboardRouter.get("/stats", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const [totalUsers, activeUsers, adminUsers, totalProducts] = await Promise.all([
            UserModel.countDocuments(),
            UserModel.countDocuments({ isActive: true }),
            UserModel.countDocuments({ role: "admin" }),
            ProductModel.countDocuments(),
        ]);

        // Recent activity: last 7 days user signups grouped by day
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentSignups = await UserModel.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            { $project: { date: "$_id", count: 1, _id: 0 } },
        ]);

        res.json(new ApiResponse("OK", {
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            adminUsers,
            regularUsers: totalUsers - adminUsers,
            totalProducts,
            recentSignups,
        }));
    } catch (err) {
        next(err);
    }
});
