"use client";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Users, Activity, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState, useEffect } from "react";

// Dummy data for analytics
const revenueData = [
    { name: 'Mon', revenue: 4000, profit: 2400 },
    { name: 'Tue', revenue: 3000, profit: 1398 },
    { name: 'Wed', revenue: 2000, profit: 9800 },
    { name: 'Thu', revenue: 2780, profit: 3908 },
    { name: 'Fri', revenue: 1890, profit: 4800 },
    { name: 'Sat', revenue: 2390, profit: 3800 },
    { name: 'Sun', revenue: 3490, profit: 4300 },
];

const deviceData = [
    { name: "Desktop", value: 65 },
    { name: "Mobile", value: 25 },
    { name: "Tablet", value: 10 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Track your product's performance and user engagement metrics here.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stats cards */}
                <div className="card p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">$45,231.89</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-sm">
                        <ArrowUpRight size={16} className="text-emerald-500" />
                        <span className="text-emerald-500 font-medium">+20.1%</span>
                        <span className="text-gray-400">from last month</span>
                    </div>
                </div>

                <div className="card p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Users</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">2,350</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center text-brand-600">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-sm">
                        <ArrowUpRight size={16} className="text-emerald-500" />
                        <span className="text-emerald-500 font-medium">+15.2%</span>
                        <span className="text-gray-400">from last month</span>
                    </div>
                </div>

                <div className="card p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3.24%</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-sm">
                        <ArrowDownRight size={16} className="text-red-500" />
                        <span className="text-red-500 font-medium">-1.1%</span>
                        <span className="text-gray-400">from last month</span>
                    </div>
                </div>

                <div className="card p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Daily Sessions</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12,430</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                            <Activity size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-sm">
                        <ArrowUpRight size={16} className="text-emerald-500" />
                        <span className="text-emerald-500 font-medium">+7.4%</span>
                        <span className="text-gray-400">from last month</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card p-6 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="text-brand-500" size={20} />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue vs Profit</h2>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                                <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="text-brand-500" size={20} />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Device Usage</h2>
                    </div>
                    <div className="h-[300px] flex flex-col justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
