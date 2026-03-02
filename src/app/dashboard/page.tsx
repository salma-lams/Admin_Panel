"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/redux";
import { dashboardApi } from "../../lib/api/users";
import {
    Users, ShoppingBag, Shield, Activity, TrendingUp,
    ArrowUpRight, ArrowDownRight, Package, Loader2,
    Calendar, Bell, Zap, Sparkles, LayoutDashboard, Globe
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";
import toast from "react-hot-toast";

// Stat Card Component
const StatCard = ({ label, val, sub, trend, icon: Icon, color, bg }: any) => (
    <div className="card p-6 group cursor-default relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-2 tracking-tighter font-display">{val}</h3>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {trend}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{sub}</span>
                </div>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={24} />
            </div>
        </div>
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color} opacity-[0.03] group-hover:opacity-[0.07] transition-opacity`}>
            <Icon size={96} />
        </div>
    </div>
);

export default function DashboardPage() {
    const { user } = useAppSelector((s) => s.auth);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = user?.role === "admin"
                    ? await dashboardApi.stats()
                    : await dashboardApi.userStats();
                setStats(data);
            } catch (err: any) {
                toast.error("Telemetry link failed");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user?.role]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-brand-500/20 border-t-brand-600 animate-spin" />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-600 animate-pulse" size={20} />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Establishing Secure Uplink</p>
        </div>
    );

    return user?.role === "admin" ? <AdminDashboard stats={stats} /> : <UserDashboard stats={stats} user={user} />;
}

const AdminDashboard = ({ stats }: any) => (
    <div className="space-y-8 animate-fade-in p-2">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                    Command <span className="text-brand-600">Center</span>
                </h1>
                <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-[10px]">Real-time Status: Terminal Active</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-xs font-black uppercase tracking-widest text-gray-500">
                    <Calendar size={14} className="text-brand-500" />
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <button className="btn-primary !py-2.5 !px-6 !rounded-2xl shadow-brand-600/30 group">
                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                    <span className="uppercase tracking-tighter font-black">Generate Report</span>
                </button>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Network Base" val={stats?.totalUsers || 0} sub="Global Nodes" trend="+12.4%" icon={Users} color="text-brand-500" bg="bg-brand-500/10" />
            <StatCard label="Active Sync" val={stats?.activeUsers || 0} sub="Live Sessions" trend="+42.1%" icon={Activity} color="text-emerald-500" bg="bg-emerald-500/10" />
            <StatCard label="Commanders" val={stats?.adminCount || 0} sub="Root Access" trend="Stable" icon={Shield} color="text-violet-500" bg="bg-violet-500/10" />
            <StatCard label="Assets" val={stats?.totalProducts || 0} sub="Managed SKU" trend="+5.2%" icon={Package} color="text-amber-500" bg="bg-amber-500/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-8 group">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Network Growth</h2>
                    <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 outline-none">
                        <option>Last 7 Cycles</option>
                        <option>Last 30 Cycles</option>
                    </select>
                </div>
                <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.signupsByDay || []}>
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} stroke="#6b7280" />
                            <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}
                                itemStyle={{ color: '#f8fafc', fontWeight: 900, fontSize: '12px' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fill="url(#chartGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card p-8 flex flex-col items-center justify-center bg-gray-900 border-none relative overflow-hidden text-center">
                <div className="relative z-10 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-brand-600/20 flex items-center justify-center mx-auto ring-8 ring-brand-600/5 animate-pulse">
                        <Globe size={40} className="text-brand-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Global Matrix</h3>
                        <p className="text-xs text-gray-400 mt-2 font-medium leading-relaxed italic">"Deployment healthy across all nodes. 99.9% uptime confirmed."</p>
                    </div>
                    <button className="w-full py-4 bg-brand-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-600/30 hover:bg-brand-500 transition-all">
                        Deep System Audit
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/10 blur-3xl rounded-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-600/10 blur-3xl rounded-full" />
            </div>
        </div>
    </div>
);

const UserDashboard = ({ stats, user }: any) => (
    <div className="space-y-8 animate-fade-in p-2">
        <header className="card-premium p-10 bg-gray-900 border-none shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-500 text-[10px] font-black uppercase tracking-widest border border-brand-500/20">
                        Personnel Identified
                    </div>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                    Welcome back, <span className="text-brand-500">{user?.name}</span>
                </h1>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-[0.2em] max-w-lg leading-relaxed">
                    Your portal to the global inventory and account management matrix.
                </p>
            </div>
            <Sparkles size={200} className="absolute -bottom-10 -right-10 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Global Inventory" val={stats?.totalProducts || 0} sub="Items Listed" trend="Stable" icon={ShoppingBag} color="text-brand-500" bg="bg-brand-500/10" />
            <StatCard label="Terminal Role" val={stats?.userProfile?.role || "USER"} sub="Access Level" trend="NOMINAL" icon={Shield} color="text-emerald-500" bg="bg-emerald-500/10" />
            <StatCard label="Sytem Health" val={stats?.systemStatus || "Healthy"} sub="Active Uplink" trend="Online" icon={Activity} color="text-violet-500" bg="bg-violet-500/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4 px-1">Access History</h2>
                <div className="space-y-3">
                    {(stats?.recentActivity || []).map((act: any, i: number) => (
                        <div key={i} className="card p-5 group flex items-center justify-between hover:border-brand-500/30 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-brand-500 transition-colors">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{act.action}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-tighter">{act.time}</p>
                                </div>
                            </div>
                            <button className="text-[10px] font-black text-brand-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Inspect Details</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="card p-8 border-dashed border-gray-200 dark:border-gray-800 text-center">
                    <LayoutDashboard size={40} className="mx-auto text-brand-500 mb-6" />
                    <h3 className="text-lg font-black uppercase tracking-tighter italic">Operational Support</h3>
                    <p className="text-xs text-gray-400 font-medium mt-3 leading-relaxed">Experiencing connection lag? Our tactical support squadron is standing by.</p>
                    <button className="w-full mt-8 py-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-750 transition-all border border-transparent hover:border-brand-500/20">
                        Open Service Ticket
                    </button>
                </div>
            </div>
        </div>
    </div>
);
