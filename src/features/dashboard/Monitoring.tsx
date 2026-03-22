"use client";
import { useState, useEffect } from "react";
import { 
    Cpu as CpuIcon, Terminal, HardDrive, 
    Zap 
} from "lucide-react";

// --- System Pulse Component ---
export const SystemPulse = () => {
    const [efficiency, setEfficiency] = useState(94.2);

    useEffect(() => {
        const interval = setInterval(() => {
            setEfficiency(prev => {
                const delta = (Math.random() - 0.5) * 0.4;
                return Math.min(100, Math.max(80, Number((prev + delta).toFixed(1))));
            });
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card p-8 bg-white dark:bg-gray-900 border-none shadow-xl rounded-[2.5rem] flex flex-col items-center justify-center text-center group hover:shadow-2xl hover:shadow-brand-500/10 transition-all">
            <div className="w-24 h-24 rounded-full border-8 border-gray-100 dark:border-gray-800 relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full border-8 border-brand-500 border-t-transparent animate-[spin_3s_linear_infinite]" />
                <CpuIcon size={32} className="text-brand-500 group-hover:scale-125 transition-transform" />
            </div>
            <h4 className="text-lg font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">System Pulse</h4>
            <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{efficiency}%</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Core Efficiency NOMINAL</p>
        </div>
    );
};

// --- Storage Matrix Component ---
export const StorageMatrix = () => {
    const items = [
        { label: 'Data Clusters', val: 78, color: 'bg-emerald-500', trend: '+2.1%' },
        { label: 'User Blobs', val: 42, color: 'bg-brand-500', trend: '+12.4%' },
        { label: 'Asset Buffers', val: 12, color: 'bg-amber-500', trend: 'Stable' },
    ];

    return (
        <div className="card p-8 bg-white dark:bg-gray-900 border-none shadow-xl rounded-[2.5rem] group hover:shadow-2xl hover:shadow-brand-500/10 transition-all">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] italic text-gray-900 dark:text-white">Storage Matrix</h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Resource Distribution</p>
                </div>
                <HardDrive size={16} className="text-gray-400 group-hover:text-brand-500 transition-colors" />
            </div>
            <div className="space-y-6">
                {items.map(item => (
                    <div key={item.label} className="group/item">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                            <span className="text-gray-400 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{item.label}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-300 italic">{item.trend}</span>
                                <span className="text-gray-900 dark:text-white">{item.val}%</span>
                            </div>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className={`h-full ${item.color} transition-all duration-1000 ease-out relative`} 
                                style={{ width: `${item.val}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Ops Stream Component ---
export const OpsStream = ({ logs }: { logs: any[] }) => {
    return (
        <div className="card p-0 border-none bg-gray-950 shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col h-full border border-white/5 group">
            <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Terminal size={16} className="text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Ops Stream</h3>
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Live Kernel Feed</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Uplink Active</span>
                </div>
            </div>
            <div className="flex-1 p-6 font-mono text-[11px] space-y-3 overflow-y-auto max-h-[380px] custom-scrollbar scroll-smooth">
                {logs.map((log: any) => (
                    <div key={log.id} className="group/log flex gap-3 animate-slide-in opacity-80 hover:opacity-100 transition-opacity">
                        <span className="text-gray-600 shrink-0 select-none">[{log.time}]</span>
                        <span className={
                            log.level === 'err' ? 'text-red-500 font-bold' : 
                            log.level === 'warn' ? 'text-amber-500' : 'text-gray-300'
                        }>
                            <span className="text-gray-500 mr-2 opacity-50">{'>'}</span>{log.msg}
                        </span>
                    </div>
                ))}
                {logs.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-600 animate-pulse py-20">
                        <Zap size={24} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Establishing Tactical Link...</span>
                    </div>
                )}
            </div>
        </div>
    );
};
