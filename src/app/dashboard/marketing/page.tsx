"use client";
import {
    Megaphone, Send, BarChart3, Users, Zap,
    ArrowRight, Sparkles, Target, Layers, Plus,
    MessageSquare, Eye, MousePointerClick, Share2, TrendingUp
} from "lucide-react";

const CAMPAIGNS = [
    { name: "Black Friday Blitz", status: "Active", reach: "42.8k", conv: "3.2%", spend: "$4,500", color: "text-brand-500", bg: "bg-brand-500/10" },
    { name: "Holiday Season Launch", status: "Draft", reach: "0", conv: "0%", spend: "$0", color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Winter Clearance", status: "Ended", reach: "128.5k", conv: "4.8%", spend: "$12,300", color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

export default function MarketingPage() {
    return (
        <div className="space-y-8 animate-fade-in p-2">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                        Marketing <span className="text-brand-600">Ops</span>
                    </h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Growth Acceleration & Strategy</p>
                </div>
                <button className="btn-primary !px-8 !py-4 shadow-brand-600/30">
                    <Zap size={18} className="fill-current" />
                    <span>Launch New Campaign</span>
                </button>
            </div>

            {/* Quick Actions / Channel Hub */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { l: "Email Blast", i: Send, c: "text-blue-500" },
                    { l: "SMS Alerts", i: MessageSquare, c: "text-emerald-500" },
                    { l: "Social Ads", i: Share2, c: "text-fuchsia-500" },
                    { l: "Search SEO", i: Target, c: "text-amber-500" },
                ].map((ch, i) => (
                    <button key={i} className="card p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all text-center group">
                        <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${ch.c} shadow-inner group-hover:rotate-12 transition-transform`}>
                            <ch.i size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{ch.l}</span>
                    </button>
                ))}
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Campaigns List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Active Strategic Movements</h2>
                        <span className="text-[10px] font-bold text-brand-500 cursor-pointer hover:underline uppercase">View Full History</span>
                    </div>
                    {CAMPAIGNS.map((c, i) => (
                        <div key={i} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-brand-500/30 transition-all border-dashed">
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-3xl ${c.bg} ${c.color} flex items-center justify-center shadow-lg shadow-black/5`}>
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic">{c.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase ${c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>{c.status}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Deployed on Oct 20</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-8 md:gap-12">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Impression Reach</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white mt-0.5">{c.reach}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Conversion</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white mt-0.5">{c.conv}</p>
                                </div>
                                <button className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:bg-brand-600 transition-colors shadow-xl">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Side Insights */}
                <div className="space-y-6">
                    <div className="card p-8 bg-brand-600 text-white shadow-2xl shadow-brand-600/40 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Campaign Efficiency</h3>
                            <p className="text-4xl font-black mt-4">84.2%</p>
                            <p className="text-xs font-medium mt-2 opacity-60">Global performance index is rising. Consider increasing budget for Active Blitz.</p>
                            <button className="mt-8 px-5 py-2.5 bg-white text-brand-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-gray-100 transition-all">
                                Efficiency Report <ArrowRight size={14} />
                            </button>
                        </div>
                        <BarChart3 size={150} className="absolute -bottom-8 -right-8 opacity-10 rotate-12" />
                    </div>

                    <div className="card p-6 space-y-5">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Reach Distribution</h3>
                        {[
                            { l: "Total Views", v: "1.2M", i: Eye },
                            { l: "Unique Clicks", v: "420K", i: MousePointerClick },
                            { l: "Conversion Rate", v: "4.8%", i: TrendingUp },
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                        <stat.i size={16} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.l}</span>
                                </div>
                                <span className="text-sm font-black text-gray-900 dark:text-white uppercase italic">{stat.v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
