"use client";
import { ClipboardList } from "lucide-react";

export default function OrdersPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 mb-2">
                <ClipboardList size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Track and manage all customer orders here. This section is currently under development to integrate with your e-commerce backend.
            </p>
            <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20">
                    Sync Orders
                </button>
                <button className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    Export CSV
                </button>
            </div>
        </div>
    );
}
