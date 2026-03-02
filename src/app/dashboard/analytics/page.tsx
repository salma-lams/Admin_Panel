"use client";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line,
    ComposedChart
} from "recharts";
import {
    TrendingUp, Users, Activity, DollarSign, ArrowUpRight, ArrowDownRight,
    Globe, Zap, MousePointer2, Clock, Calendar, Download, RefreshCcw
} from "lucide-react";
import { useState, useEffect } from "react";

// Advanced Mock Data
const performanceData = [
    { name: 'Jan', revenue: 45000, expenses: 32000, target: 40000 },
    { name: 'Feb', revenue: 52000, expenses: 34000, target: 40000 },
    { name: 'Mar', revenue: 48000, expenses: 31000, target: 45000 },
    { name: 'Apr', revenue: 61000, expenses: 38000, target: 45000 },
    { name: 'May', revenue: 55000, expenses: 36000, target: 50000 },
    { name: 'Jun', revenue: 67000, expenses: 40000, target: 50000 },
];

const trafficSources = [
    { name: "Direct", value: 45 },
    { name: "Social", value: 25 },
    { name: "Referral", value: 20 },
    { name: "Other", value: 10 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 animate-fade-in p-2">
            {/* Header Control Panel */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
                        Enterprise <span className="text-brand-600">Intelligence</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Analytics Sync: Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <button className="p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 transition-all">
                        <RefreshCcw size={18} />
                    </button>
                    <div className="h-6 w-[1px] bg-gray-100 dark:bg-gray-800" />
                    <button className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors">
                        <Calendar size={16} />
                        Last 30 Days
                    </button>
                    <button className="btn-primary !py-2 !px-4 !rounded-xl !text-xs !uppercase !tracking-tighter">
                        <Download size={14} />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Hyper-Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Gross Revenue", val: "$128,430", trend: "+24.5%", icon: DollarSign, color: "text-brand-500", bg: "bg-brand-500/10" },
                    { label: "Active Sessions", val: "42,891", trend: "+12.2%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Global Reach", val: "184", trend: "+2", icon: Globe, color: "text-violet-500", bg: "bg-violet-500/10" },
                    { label: "Avg. Latency", val: "42ms", trend: "-8ms", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
                ].map((stat, i) => (
                    <div key={i} className="card p-6 flex flex-col justify-between group">
                        <div className="flex justify-between items-start">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-lg shadow-black/5`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stat.trend.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1 tracking-tighter group-hover:text-brand-600 transition-colors">{stat.val}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Data Visualization Core */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Performance Chart */}
                <div className="lg:col-span-2 card p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Fiscal Performance</h2>
                            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest italic">Revenue Flow vs Operational Costs</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                <span className="text-[10px] font-black text-gray-500 uppercase">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black text-gray-500 uppercase">Target</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gradientRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 800 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 800 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}
                                    itemStyle={{ color: '#f8fafc', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}
                                    labelStyle={{ color: '#6366f1', marginBottom: '8px', fontWeight: 900 }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fill="url(#gradientRev)" />
                                <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="8 8" dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Distribution */}
                <div className="card p-8 bg-gray-900 text-white border-none shadow-2xl shadow-brand-900/10">
                    <h2 className="text-xl font-black uppercase tracking-tighter mb-8 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Traffic Matrix</h2>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={trafficSources}
                                    innerRadius={75}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {trafficSources.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 space-y-4">
                        {trafficSources.map((source, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest">{source.name}</span>
                                </div>
                                <span className="text-sm font-black text-white">{source.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Insight Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Conversion Rate", val: "3.24%", sub: "+0.4% this week", icon: MousePointer2 },
                    { label: "Retention Sync", val: "94.8%", sub: "Stable baseline", icon: RefreshCcw },
                    { label: "Session Depth", val: "12m 4s", sub: "Deep engagement", icon: Clock },
                ].map((insight, i) => (
                    <div key={i} className="card p-5 border-dashed border-gray-200 dark:border-gray-800 bg-transparent flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                            <insight.icon size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{insight.label}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-lg font-black text-gray-900 dark:text-white leading-none">{insight.val}</span>
                                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded leading-none italic">{insight.sub}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
