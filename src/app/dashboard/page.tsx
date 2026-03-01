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
    const [userStats, setUserStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            if (user?.role === "admin") {
                const { data } = await dashboardApi.stats();
                setStats(data.data);
            } else {
                const { data } = await dashboardApi.userStats();
                setUserStats(data.data);
            }
        } catch {
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="card p-5 h-24 animate-pulse bg-gray-100 dark:bg-gray-800" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.name?.split(" ")[0]} 👋
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>
                {user?.role === "user" && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-brand-500/10 text-brand-500 rounded-full text-xs font-medium border border-brand-500/20 w-fit">
                        <UserCheck size={14} />
                        Standard Account
                    </div>
                )}
            </div>

            {user?.role === "admin" ? (
                <AdminDashboard stats={stats} />
            ) : (
                <UserDashboard stats={userStats} />
            )}
        </div>
    );
}

function AdminDashboard({ stats }: { stats: DashboardStats | null }) {
    const pieData = stats ? [
        { name: "Active", value: stats.activeUsers },
        { name: "Inactive", value: stats.inactiveUsers },
        { name: "Admin", value: stats.adminUsers },
    ] : [];

    return (
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
                <div className="card p-6 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-5">
                        <TrendingUp size={18} className="text-brand-500" />
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Signups — Last 7 Days</h2>
                    </div>
                    {(stats?.recentSignups?.length ?? 0) === 0 ? (
                        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No signup data yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={stats?.recentSignups} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSignup" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "12px", fontSize: 12 }} />
                                <Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#colorSignup)" strokeWidth={3} name="Signups" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="card p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Activity size={18} className="text-brand-500" />
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">User Distribution</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                                {pieData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "12px", fontSize: 12 }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-400">{v}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
}

function UserDashboard({ stats }: { stats: any }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={Package} label="Total Products" value={stats?.totalProducts ?? 0} color="bg-amber-500" />
                    <StatCard icon={Activity} label="System Status" value={stats?.systemStatus ?? "..."} color="bg-emerald-500" />
                    <StatCard icon={UserCheck} label="My Role" value={stats?.user?.role?.toUpperCase() ?? "..."} color="bg-brand-600" />
                </div>

                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-brand-500" />
                        Your Recent Activity
                    </h2>
                    <div className="space-y-4">
                        {stats?.recentActivity?.map((act: any) => (
                            <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                                <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0">
                                    <Activity size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{act.description}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {new Date(act.date).toLocaleDateString()} at {new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
                <div className="card p-6 bg-gradient-to-br from-brand-600 to-brand-700 border-none">
                    <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
                    <p className="text-brand-100 text-sm mb-4 leading-relaxed">
                        Access our documentation or contact support if you need assistance managing your account.
                    </p>
                    <button className="w-full py-2.5 px-4 bg-white text-brand-600 rounded-xl font-semibold text-sm hover:bg-brand-50 transition-colors duration-200">
                        View Documentation
                    </button>
                </div>

                <div className="card p-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                    <div className="space-y-2">
                        <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-600 dark:text-gray-400 group">
                            <span>Browse Products</span>
                            <Package size={16} className="group-hover:text-brand-500" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-600 dark:text-gray-400 group">
                            <span>Account Settings</span>
                            <ShieldCheck size={16} className="group-hover:text-brand-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
