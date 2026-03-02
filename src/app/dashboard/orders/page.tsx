"use client";
import {
    Search, Filter, ChevronDown, MoreHorizontal, Download,
    CheckCircle2, Clock, Truck, AlertCircle, ShoppingCart,
    User, X, Eye, Printer, Package, CreditCard, ExternalLink,
    ChevronRight, Calendar, ArrowRight, ArrowUpRight, Activity,
    RefreshCw
} from "lucide-react";
import { useState, useMemo } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const ORDERS = [
    { id: "ORD-7281", customer: "Sophia Chen", email: "sophia.c@enterprise.com", date: "Oct 24, 2023", total: "$429.00", status: "Delivered", items: 3, tracking: "GX-99281-01" },
    { id: "ORD-9912", customer: "Marcus Wright", email: "m.wright@global.net", date: "Oct 23, 2023", total: "$1,290.50", status: "Processing", items: 1, tracking: "GX-99282-04" },
    { id: "ORD-4567", customer: "Isabella Rossi", email: "i.rossi@design.it", date: "Oct 23, 2023", total: "$89.99", status: "Shipped", items: 2, tracking: "GX-99283-09" },
    { id: "ORD-2234", customer: "David Miller", email: "d.miller@tech.com", date: "Oct 22, 2023", total: "$545.00", status: "On Hold", items: 5, tracking: "GX-99284-12" },
    { id: "ORD-1029", customer: "Emma Wilson", email: "e.wilson@corp.org", date: "Oct 21, 2023", total: "$320.00", status: "Delivered", items: 2, tracking: "GX-99285-15" },
    { id: "ORD-8871", customer: "James Anderson", email: "j.anderson@media.co", date: "Oct 21, 2023", total: "$125.00", status: "Cancelled", items: 1, tracking: "N/A" },
];

const TABS = ["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_MAP: Record<string, any> = {
    "Delivered": { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
    "Processing": { color: "text-brand-500", bg: "bg-brand-500/10", icon: Clock },
    "Shipped": { color: "text-violet-500", bg: "bg-violet-500/10", icon: Truck },
    "On Hold": { color: "text-amber-500", bg: "bg-amber-500/10", icon: AlertCircle },
    "Cancelled": { color: "text-red-500", bg: "bg-red-500/10", icon: AlertCircle },
};

export default function OrdersPage() {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("All Orders");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const filteredOrders = useMemo(() => {
        return ORDERS.filter(o => {
            const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                o.customer.toLowerCase().includes(search.toLowerCase());
            const matchesTab = activeTab === "All Orders" || o.status === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [search, activeTab]);

    return (
        <div className="space-y-6 animate-fade-in p-2 relative min-h-[80vh]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                        Logistics <span className="text-brand-600">Terminal</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Global Fulfillment Sync</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-brand-600 transition-all shadow-sm">
                        <Printer size={18} />
                    </button>
                    <button className="btn-primary !px-6 !py-3 !rounded-2xl shadow-brand-600/30 group">
                        <Package size={18} className="group-hover:rotate-12 transition-transform" />
                        <span className="font-black uppercase tracking-tighter">Manifest New Batch</span>
                    </button>
                </div>
            </div>

            {/* Metrics Quick-Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { l: "Velocity", v: "42/hr", i: Truck, c: "text-brand-500" },
                    { l: "Settled", v: "$14.2k", i: CreditCard, c: "text-emerald-500" },
                    { l: "Pending", v: "18", i: Clock, c: "text-amber-500" },
                    { l: "Efficiency", v: "99.4%", i: CheckCircle2, c: "text-violet-500" },
                ].map((m, i) => (
                    <div key={i} className="card p-4 flex items-center gap-4 group cursor-default">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", m.c.replace('text-', 'bg-').replace('500', '500/10'))}>
                            <m.i size={20} className={m.c} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{m.l}</p>
                            <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{m.v}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Control Strip */}
            <div className="card p-2 flex flex-col md:flex-row items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50 border-dashed border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-1 p-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 w-full md:w-auto overflow-x-auto no-scrollbar">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                activeTab === tab
                                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20"
                                    : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Scan signal (Order ID, Principal name)..."
                        className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-xs font-medium focus:ring-2 focus:ring-brand-500/50 transition-all outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Logistics Table */}
            <div className="card-premium border-none shadow-none !bg-transparent">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-gray-400">
                                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Sequence</th>
                                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Principal Entity</th>
                                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Fulfillment</th>
                                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Settlement</th>
                                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center glass rounded-3xl border-dashed">
                                        <div className="flex flex-col items-center gap-3">
                                            <AlertCircle size={40} className="text-gray-300" />
                                            <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">No Signal Detected</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((o) => (
                                    <tr
                                        key={o.id}
                                        className="group cursor-pointer"
                                        onClick={() => setSelectedOrder(o)}
                                    >
                                        <td className="px-6 py-5 bg-white dark:bg-gray-900 first:rounded-l-3xl border-y border-l border-gray-100 dark:border-gray-800 group-hover:border-brand-500/40 transition-all">
                                            <div className="flex items-center gap-4 pr-10">
                                                <div className="w-10 h-10 rounded-[1.2rem] bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 group-hover:text-brand-600 transition-all">
                                                    <ShoppingCart size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 dark:text-white tracking-widest uppercase">{o.id}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-tighter">{o.date}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 group-hover:border-brand-500/40 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-600/10 flex items-center justify-center font-black text-[10px] text-brand-600">
                                                    {o.customer[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">{o.customer}</span>
                                                    <span className="text-[9px] text-gray-500 font-medium italic lowercase">{o.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 group-hover:border-brand-500/40 transition-all">
                                            {(() => {
                                                const s = STATUS_MAP[o.status];
                                                return (
                                                    <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-transparent group-hover:border-current transition-all", s.bg, s.color)}>
                                                        <s.icon size={12} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">{o.status}</span>
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-5 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 group-hover:border-brand-500/40 transition-all">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 dark:text-white">{o.total}</span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <span className="text-[9px] text-emerald-500 font-black uppercase tracking-tighter italic">Settled via stripe</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 bg-white dark:bg-gray-900 last:rounded-r-3xl border-y border-r border-gray-100 dark:border-gray-800 group-hover:border-brand-500/40 transition-all text-right">
                                            <button className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:group-hover:bg-brand-900/40 transition-all active:scale-90">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Drawer (Ultra Senior Detail View) */}
            <div className={cn(
                "fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white dark:bg-gray-950 shadow-2xl z-[100] transform transition-transform duration-500 ease-in-out border-l border-gray-100 dark:border-gray-800 p-8 flex flex-col no-scrollbar overflow-y-auto",
                selectedOrder ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-600/10 text-brand-600 flex items-center justify-center">
                            <ShoppingCart size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Order Profile</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedOrder?.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedOrder(null)}
                        className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {selectedOrder && (
                    <div className="space-y-10 animate-fade-in">
                        {/* Status Hub */}
                        <div className="card-premium p-6 bg-gray-900 border-none relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em] mb-4">Current Deployment Status</p>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-3xl font-black text-white italic uppercase">{selectedOrder.status}</h3>
                                    <div className="flex flex-col items-end">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Tracking Code</p>
                                        <p className="text-sm font-black text-emerald-500 tracking-tighter">{selectedOrder.tracking}</p>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full mt-6 relative overflow-hidden">
                                    <div className="absolute inset-y-0 left-0 bg-brand-600 transition-all duration-1000 w-[75%]" />
                                    <div className="absolute inset-y-0 left-0 bg-brand-600/50 animate-ping w-[75%]" />
                                </div>
                            </div>
                            <Activity size={100} className="absolute -bottom-10 -right-10 text-white/5 opacity-10" />
                        </div>

                        {/* Principal Profile */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Principal Entity</h4>
                            <div className="card p-6 flex items-center gap-5">
                                <div className="w-14 h-14 rounded-3xl bg-brand-600 flex items-center justify-center text-white font-black text-xl">
                                    {selectedOrder.customer[0]}
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">{selectedOrder.customer}</p>
                                    <p className="text-xs text-gray-500 font-medium italic">{selectedOrder.email}</p>
                                </div>
                                <button className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-brand-600 transition-all flex items-center justify-center">
                                    <ExternalLink size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Fiscal Assets */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Manifest</h4>
                                <span className="text-[10px] text-gray-400 font-bold">{selectedOrder.items} items listed</span>
                            </div>
                            <div className="space-y-3">
                                {[1, 2].map(i => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-brand-600">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Premium Asset #{i}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Asset Ref: GX-PX-0{i}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-gray-900 dark:text-white tracking-widest">$144.50</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary Footer */}
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-gray-400 uppercase tracking-widest">Total Transaction</span>
                                <span className="font-black text-2xl text-gray-900 dark:text-white tracking-tighter">{selectedOrder.total}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <button className="btn-secondary !py-4 shadow-sm">
                                    <Eye size={16} /> Full Invoice
                                </button>
                                <button className="btn-primary !py-4 shadow-brand-600/20">
                                    <RefreshCw size={16} /> Re-Sync Order
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Overlay */}
            {selectedOrder && (
                <div
                    onClick={() => setSelectedOrder(null)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] animate-fade-in"
                />
            )}
        </div>
    );
}
