import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";
import { ProductModel } from "../models/Product";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { ApiResponse } from "../utils/ApiResponse";

export const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get("/stats", authorize("admin"), async (_req: Request, res: Response, next: NextFunction) => {
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

dashboardRouter.get("/user-stats", authorize("admin", "user"), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const [totalProducts] = await Promise.all([
            ProductModel.countDocuments(),
        ]);

        res.json(new ApiResponse("OK", {
            totalProducts,
            user: {
                name: req.user?.name,
                email: req.user?.email,
                role: req.user?.role,
            },
            systemStatus: "Healthy",
            recentActivity: [
                { id: 1, type: "Login", date: new Date().toISOString(), description: "System login successful" },
                { id: 2, type: "Profile", date: new Date(Date.now() - 86400000).toISOString(), description: "Viewed profile settings" },
            ]
        }));
    } catch (err) {
        next(err);
    }
});
