"use client";
import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "../../hooks/redux";
import { dashboardApi } from "../../lib/api/users";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from "recharts";
import { Users, UserCheck, ShieldCheck, Package, TrendingUp, Activity } from "lucide-react";
import toast from "react-hot-toast";

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    adminUsers: number;
    regularUsers: number;
    totalProducts: number;
    recentSignups: { date: string; count: number }[];
}

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

function StatCard({ icon: Icon, label, value, sub, color }: {
    icon: React.ElementType; label: string; value: number | string; sub?: string; color: string;
}) {
    return (
        <div className="card p-5 flex items-center gap-4 animate-fade-in hover:shadow-md transition-shadow duration-200">
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${color} shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                {sub && <p className="text-xs text-emerald-500 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const user = useAppSelector((s) => s.auth.user);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        if (user?.role !== "admin") { setLoading(false); return; }
        try {
            const { data } = await dashboardApi.stats();
            setStats(data.data);
        } catch {
            toast.error("Failed to load dashboard stats");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    const pieData = stats ? [
        { name: "Active", value: stats.activeUsers },
        { name: "Inactive", value: stats.inactiveUsers },
        { name: "Admin", value: stats.adminUsers },
    ] : [];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
            </div>

            {user?.role !== "admin" ? (
                <div className="card p-10 text-center">
                    <Activity className="w-12 h-12 text-brand-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h2>
                    <p className="text-gray-400 mt-2">You're logged in as a regular user. Admin-level stats are restricted.</p>
                </div>
            ) : loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="card p-5 h-24 animate-pulse bg-gray-100 dark:bg-gray-800" />
                    ))}
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? 0} color="bg-brand-600" />
                        <StatCard icon={UserCheck} label="Active Users" value={stats?.activeUsers ?? 0} sub={`${stats?.inactiveUsers ?? 0} inactive`} color="bg-emerald-500" />
                        <StatCard icon={ShieldCheck} label="Admins" value={stats?.adminUsers ?? 0} color="bg-violet-500" />
                        <StatCard icon={Package} label="Products" value={stats?.totalProducts ?? 0} color="bg-amber-500" />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Area chart */}
                        <div className="card p-6 lg:col-span-2">
                            <div className="flex items-center gap-2 mb-5">
                                <TrendingUp size={18} className="text-brand-500" />
                                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Signups — Last 7 Days</h2>
                            </div>
                            {(stats?.recentSignups?.length ?? 0) === 0 ? (
                                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No signup data yet</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={stats?.recentSignups} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSignup" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} />
                                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                                        <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "12px", fontSize: 12 }} />
                                        <Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#colorSignup)" strokeWidth={2} name="Signups" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Pie chart */}
                        <div className="card p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <Activity size={18} className="text-brand-500" />
                                <h2 className="text-base font-semibold text-gray-900 dark:text-white">User Distribution</h2>
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                                        {pieData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "12px", fontSize: 12 }} />
                                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-400">{v}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
