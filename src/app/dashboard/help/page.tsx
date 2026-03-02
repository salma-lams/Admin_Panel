"use client";
import {
    HelpCircle, Search, LifeBuoy, Book, MessageSquare,
    ArrowRight, PlayCircle, FileText, ExternalLink,
    ChevronRight, Zap, ShieldCheck, Cpu
} from "lucide-react";
import { useState } from "react";

const DOCS = [
    { title: "Network Architecture", desc: "Understanding our global edge nodes and latency optimization.", icon: Cpu },
    { title: "Security Protocol 7", desc: "Enterprise-grade encryption and RBAC implementation guides.", icon: ShieldCheck },
    { title: "API Integration v16", desc: "Seamlessly connect your legacy systems to our cloud.", icon: Zap },
];

export default function HelpPage() {
    return (
        <div className="space-y-8 animate-fade-in p-2 min-h-screen">
            {/* Hero Section */}
            <div className="card-premium p-10 bg-gray-900 border-none shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Command <span className="text-brand-500">Support</span>
                    </h1>
                    <p className="text-gray-400 font-bold mt-4 text-sm uppercase tracking-[0.2em] leading-relaxed">
                        Access our global intelligence database and specialized technical assistance units 24/7.
                    </p>

                    <div className="relative mt-10 group/search">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/search:text-brand-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Query the database (e.g. 'Latency protocols', 'JWT rotation')..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 backdrop-blur-sm transition-all"
                        />
                    </div>
                </div>
                <HelpCircle size={300} className="absolute -bottom-20 -right-20 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            </div>

            {/* Support Channels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { l: "Intel Base", d: "Browse technical docs", i: Book, c: "text-blue-500" },
                    { l: "Direct Uplink", d: "Live comms with engineers", i: MessageSquare, c: "text-emerald-500" },
                    { l: "Resource Center", d: "Download assets & SDKs", i: FileText, c: "text-violet-500" },
                ].map((ch, i) => (
                    <div key={i} className="card p-6 flex items-center justify-between group cursor-pointer hover:border-brand-500/40">
                        <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${ch.c} shadow-inner group-hover:scale-110 transition-transform`}>
                                <ch.i size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{ch.l}</h3>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">{ch.d}</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
                    </div>
                ))}
            </div>

            {/* Trending Docs */}
            <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Trending Intelligence</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {DOCS.map((doc, i) => (
                        <div key={i} className="card p-8 group hover:bg-brand-600 transition-all duration-500">
                            <doc.icon size={40} className="text-brand-500 group-hover:text-white transition-colors" />
                            <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-white mt-6 uppercase italic tracking-tighter">{doc.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/70 mt-3 font-medium leading-relaxed">{doc.desc}</p>
                            <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-600 group-hover:text-white transition-colors">
                                Read Protocol <ArrowRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Support */}
            <div className="card p-8 border-dashed border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6 text-center md:text-left">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                        <PlayCircle size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Mission Briefings</h3>
                        <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-widest">Watch our technical deep-dives on system scalability.</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                    Open Academy <ExternalLink size={14} />
                </button>
            </div>
        </div>
    );
}
