"use client";
import { Megaphone } from "lucide-react";

export default function MarketingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 mb-2">
                <Megaphone size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketing</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Create campaigns, manage newsletter subscribers, and track promotion performance from this dashboard.
            </p>
            <button className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20">
                Create New Campaign
            </button>
        </div>
    );
}
