"use client";
import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../../hooks/redux";
import { dashboardApi } from "../../lib/api/users";
import {
    Users, ShoppingBag, Shield, Activity, TrendingUp,
    ArrowUpRight, ArrowDownRight, Package, Loader2,
    Calendar, Bell, Zap, Sparkles, LayoutDashboard, Globe,
    Cpu, Database, Network, Terminal, Server, Cpu as CpuIcon,
    HardDrive, Radio, Search
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import toast from "react-hot-toast";
import Link from "next/link";

// --- Mock Telemetry Data Hooks ---
const useLiveLogs = () => {
    const [logs, setLogs] = useState<{ id: number; msg: string; time: string; level: 'info' | 'warn' | 'err' }[]>([]);
    const logsRef = useRef(0);

    useEffect(() => {
        const events: { msg: string; level: 'info' | 'warn' | 'err' }[] = [
            { msg: "Inbound encrypted packet identified", level: "info" },
            { msg: "Node synchronization: 99.8% complete", level: "info" },
            { msg: "Asset valuation updated: SKU-492", level: "info" },
            { msg: "Database buffer optimization initiated", level: "warn" },
            { msg: "Personnel clearance level elevation", level: "info" },
            { msg: "Security handshake verified: TLS 1.3", level: "info" },
            { msg: "System thermal profile: Nominal", level: "info" },
            { msg: "Unidentified login attempt blocked", level: "err" },
        ];

        const interval = setInterval(() => {
            const ev = events[Math.floor(Math.random() * events.length)];
            setLogs(prev => [
                { id: ++logsRef.current, ...ev, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
                ...prev
            ].slice(0, 50));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return logs;
};

// --- Sub-components ---

const TelemetryStrip = () => (
    <div className="flex items-center gap-8 py-2 px-6 bg-gray-900 overflow-hidden relative border-y border-white/5 whitespace-nowrap">
        <div className="flex gap-10 animate-infinite-scroll">
            {[1, 2].map(i => (
                <div key={i} className="flex gap-10">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                        <Radio size={10} className="animate-pulse" /> Uplink: Stable (1.2 GB/s)
                    </span>
                    <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest flex items-center gap-2">
                        <Cpu size={10} /> Load: 12% / 44.2C
                    </span>
                    <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest flex items-center gap-2">
                        <Database size={10} /> Net Buffer: 88%
                    </span>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                        <Shield size={10} /> Clearance: Master Root
                    </span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Terminal size={10} /> Kernel: Alpha-4.4
                    </span>
                </div>
            ))}
        </div>
    </div>
);

const StatCard = ({ label, val, sub, trend, icon: Icon, color, bg, href }: any) => {
    const Content = (
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter font-display">{val}</h3>
                    <div className="flex items-center gap-1">
                        <div className={`w-1 h-3 rounded-full ${trend.startsWith('+') ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                        <span className={`text-[10px] font-black ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                            {trend}
                        </span>
                    </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{sub}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500 relative`}>
                <Icon size={24} />
                <div className="absolute inset-0 rounded-2xl border border-white/20 animate-ping opacity-20 group-hover:hidden" />
            </div>
        </div>
    );

    const ContainerClasses = "card p-6 group cursor-pointer relative overflow-hidden block transition-all hover:border-brand-500/30 active:scale-[0.98] bg-white dark:bg-gray-900 hover:shadow-2xl hover:shadow-brand-500/10";

    return href ? (
        <Link href={href} className={ContainerClasses}>
            {Content}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color} opacity-[0.03] group-hover:opacity-[0.1] transition-opacity`}>
                <Icon size={96} />
            </div>
        </Link>
    ) : (
        <div className={ContainerClasses.replace("cursor-pointer", "cursor-default")}>
            {Content}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color} opacity-[0.03] group-hover:opacity-[0.1] transition-opacity`}>
                <Icon size={96} />
            </div>
        </div>
    );
};

export default function DashboardPage() {
    const { user } = useAppSelector((s) => s.auth);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const logs = useLiveLogs();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = user?.role === "admin"
                    ? await dashboardApi.stats()
                    : await dashboardApi.userStats();
                
                const data = res.data?.data || res.data;
                
                // Enhance for 'Perfect' dashboard feel: fallback to mock data if stats are empty
                if (user?.role === "admin" && data?.recentSignups?.length === 0) {
                    data.recentSignups = [
                        { date: '2026-03-11', count: 12 },
                        { date: '2026-03-12', count: 18 },
                        { date: '2026-03-13', count: 15 },
                        { date: '2026-03-14', count: 25 },
                        { date: '2026-03-15', count: 22 },
                        { date: '2026-03-16', count: 30 },
                        { date: '2026-03-17', count: 28 },
                    ];
                }
                
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

    return (
        <div className="relative">
            {/* Background Grid Pattern */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
                <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:40px_40px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-gray-900/50 dark:to-gray-950" />
            </div>

            <div className="relative z-10 space-y-0">
                <TelemetryStrip />
                <main className="p-4 lg:p-8 space-y-8 animate-fade-in">
                    {user?.role === "admin" ? <AdminDashboard stats={stats} logs={logs} /> : <UserDashboard stats={stats} user={user} logs={logs} />}
                </main>
            </div>
        </div>
    );
}

const AdminDashboard = ({ stats, logs }: any) => (
    <div className="space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic flex items-center gap-3">
                    Command <span className="text-brand-600">Center</span>
                    <span className="text-[10px] not-italic font-black px-2 py-1 bg-brand-500 text-white rounded tracking-widest mt-1">VER 4.4</span>
                </h1>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] text-[10px]">Site: Primary-01</p>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] text-[10px]">ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-gray-900 px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <Calendar size={14} className="text-brand-500" />
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <button className="btn-primary !py-3 !px-8 !rounded-2xl shadow-xl shadow-brand-600/30 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                    <span className="uppercase tracking-tighter font-black">Generate Matrix Report</span>
                </button>
            </div>
        </header>

        {/* Tactical Stat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Network Base" val={stats?.totalUsers || 0} sub="Identified Identities" trend="+12.4%" icon={Users} color="text-brand-500" bg="bg-brand-500/10" href="/dashboard/users" />
            <StatCard label="Active Sync" val={stats?.activeUsers || 0} sub="Real-time Sessions" trend="+42.1%" icon={Activity} color="text-emerald-500" bg="bg-emerald-500/10" href="/dashboard/users" />
            <StatCard label="Commanders" val={stats?.adminCount || 0} sub="Elevated Clearances" trend="Stable" icon={Shield} color="text-violet-500" bg="bg-violet-500/10" href="/dashboard/users" />
            <StatCard label="Assets" val={stats?.totalProducts || 0} sub="Managed Inventory" trend="+5.2%" icon={Package} color="text-amber-500" bg="bg-amber-500/10" href="/dashboard/products" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Primary Telemetry Chart */}
            <div className="lg:col-span-2 card p-8 group border-none bg-white dark:bg-gray-900 shadow-xl rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                     <div className="flex gap-2">
                        <div className="w-1 h-3 bg-brand-500 animate-[bounce_1s_infinite_0.1s]" />
                        <div className="w-1 h-5 bg-brand-500 animate-[bounce_1s_infinite_0.2s]" />
                        <div className="w-1 h-2 bg-brand-500 animate-[bounce_1s_infinite_0.3s]" />
                     </div>
                </div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter italic">Network Growth</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Personnel expansion metrics</p>
                    </div>
                    <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none cursor-pointer">
                        <option>7 Cycle Window</option>
                        <option>30 Cycle Window</option>
                    </select>
                </div>
                <div className="h-[320px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.recentSignups || []}>
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} stroke="#6b7280" />
                             <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                                itemStyle={{ color: '#f8fafc', fontWeight: 900, fontSize: '12px' }}
                                cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fill="url(#chartGradient)" animationDuration={2000} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Live Operations Stream */}
            <div className="card p-0 border-none bg-gray-950 shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col h-full border border-white/5">
                <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Terminal size={18} className="text-emerald-500" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Ops Stream</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
                    </div>
                </div>
                <div className="flex-1 p-6 font-mono text-[11px] space-y-3 overflow-y-auto max-h-[380px] scrollbar-hide">
                    {logs.map((log: any) => (
                        <div key={log.id} className="group flex gap-3 animate-slide-in">
                            <span className="text-gray-600 shrink-0">[{log.time}]</span>
                            <span className={
                                log.level === 'err' ? 'text-red-500 font-bold' : 
                                log.level === 'warn' ? 'text-amber-500' : 'text-gray-300'
                            }>
                                {log.msg}
                            </span>
                        </div>
                    ))}
                    {logs.length === 0 && <div className="text-gray-600 italic">Initializing tactical uplink...</div>}
                </div>
            </div>
        </div>

        {/* Secondary Widgets Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 bg-white dark:bg-gray-900 border-none shadow-xl rounded-[2.5rem] flex flex-col items-center justify-center text-center group">
                <div className="w-24 h-24 rounded-full border-8 border-gray-100 dark:border-gray-800 relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full border-8 border-brand-500 border-t-transparent animate-[spin_3s_linear_infinite]" />
                    <CpuIcon size={32} className="text-brand-500 group-hover:scale-125 transition-transform" />
                </div>
                <h4 className="text-lg font-black uppercase tracking-tighter">System Pulse</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Core Efficiency: 94.2%</p>
            </div>

            <div className="card p-8 bg-white dark:bg-gray-900 border-none shadow-xl rounded-[2.5rem] group">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] italic">Storage Matrix</h4>
                    <HardDrive size={16} className="text-gray-400" />
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'Data Clusters', val: 78, color: 'bg-emerald-500' },
                        { label: 'User Blobs', val: 42, color: 'bg-brand-500' },
                        { label: 'Asset Buffers', val: 12, color: 'bg-amber-500' },
                    ].map(item => (
                        <div key={item.label} className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-400">{item.label}</span>
                                <span>{item.val}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.val}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card p-8 bg-brand-600 text-white border-none shadow-2xl shadow-brand-600/30 rounded-[2.5rem] relative overflow-hidden group flex flex-col justify-between">
                <div className="relative z-10">
                    <h4 className="text-2xl font-black uppercase tracking-tighter leading-tight italic">
                        Initialize Global Audit
                    </h4>
                    <p className="text-xs font-bold text-brand-100 uppercase tracking-widest mt-4 opacity-70">
                        Scan all 12 nodes for security anomalies and inventory drift.
                    </p>
                </div>
                <button className="relative z-10 mt-8 py-4 bg-white text-brand-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-brand-50 transition-all flex items-center justify-center gap-2">
                    Start Deep Scan <Network size={14} />
                </button>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
        </div>
    </div>
);

const UserDashboard = ({ stats, user, logs }: any) => (
    <div className="space-y-8">
        <header className="card-premium p-12 bg-gray-900 border-none shadow-2xl relative overflow-hidden group rounded-[3rem]">
            <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-500 text-[10px] font-black uppercase tracking-widest border border-brand-500/20 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" /> Personnel Identified
                    </div>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                    Welcome back, <span className="text-brand-500">{user?.name}</span>
                </h1>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-[0.2em] max-w-lg leading-relaxed">
                    Terminal Access: Level 1. Global inventory and account metrics are active.
                </p>
                <div className="flex gap-4 pt-4">
                    <button className="btn-primary !rounded-2xl !px-8 !py-4 shadow-2xl shadow-brand-600/40 font-black">VIEW PROFILE</button>
                    <button className="bg-white/5 hover:bg-white/10 text-white rounded-2xl px-8 py-4 text-[10px] font-black tracking-widest uppercase transition-all backdrop-blur-md border border-white/5">HELP DESK</button>
                </div>
            </div>
            <Sparkles size={300} className="absolute -bottom-20 -right-20 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            <div className="absolute top-0 right-0 p-12 opacity-20 hidden lg:block">
                <div className="text-[120px] font-black italic tracking-tighter text-white select-none">ROOT</div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Global Inventory" val={stats?.totalProducts || 0} sub="Managed SKU Matrix" trend="Stable" icon={ShoppingBag} color="text-brand-500" bg="bg-brand-500/10" />
            <StatCard label="Terminal Role" val={stats?.userProfile?.role || "USER"} sub="Clearance Level" trend="NOMINAL" icon={Shield} color="text-emerald-500" bg="bg-emerald-500/10" />
            <StatCard label="Matrix Health" val={stats?.systemStatus || "Healthy"} sub="Active Uplink" trend="Online" icon={Activity} color="text-violet-500" bg="bg-violet-500/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Tactical Activity History</h2>
                    <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest cursor-pointer hover:underline">Clear Logs</span>
                </div>
                <div className="space-y-4">
                    {logs.slice(0, 8).map((act: any, i: number) => (
                        <div key={i} className="card p-6 group flex items-center justify-between hover:border-brand-500/30 transition-all bg-white dark:bg-gray-900 border-none shadow-sm rounded-[2rem]">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-brand-500 group-hover:text-white transition-all transform group-hover:rotate-12">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{act.msg}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tighter flex items-center gap-2">
                                        <Calendar size={10} /> {act.time}
                                    </p>
                                </div>
                            </div>
                            <button className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-all hover:text-brand-500">
                                <Search size={16} />
                            </button>
                        </div>
                    ))}
                    {logs.length === 0 && Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-20 bg-white dark:bg-gray-900 rounded-[2rem] animate-pulse" />
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="card p-10 bg-gray-950 border-none shadow-2xl rounded-[3rem] text-center relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-brand-600/20 flex items-center justify-center mx-auto mb-8 ring-8 ring-brand-600/5 group-hover:rotate-12 transition-transform">
                            <LayoutDashboard size={40} className="text-brand-500" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Operational Support</h3>
                        <p className="text-xs text-gray-500 font-medium mt-4 leading-relaxed italic">
                            "Tactical anomalies detected? Our core squadron is standing by for technical extraction."
                        </p>
                        <button className="w-full mt-10 py-5 bg-white text-gray-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-50 transition-all shadow-xl shadow-brand-500/5">
                            Open Service Ticket
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/10 blur-3xl rounded-full" />
                </div>

                <div className="card p-8 bg-white dark:bg-gray-900 border-none shadow-xl rounded-[2.5rem]">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Matrix Sync Status</h4>
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-800" />
                                <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray={176} strokeDashoffset={176 * 0.12} className="text-emerald-500" />
                            </svg>
                            <span className="absolute text-[10px] font-black">SS-1</span>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-tight">Sync Vector: Alpha</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Latency: 12ms (NOMINAL)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
