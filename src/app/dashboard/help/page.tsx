"use client";
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 mb-2">
                <HelpCircle size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Need assistance? Browse our documentation or contact our 24/7 technical support team.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mt-4">
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-left hover:border-brand-500/50 transition-colors">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Documentation</h3>
                    <p className="text-xs text-gray-500 mt-1">Read guides on all platform features.</p>
                </div>
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-left hover:border-brand-500/50 transition-colors">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Contact Support</h3>
                    <p className="text-xs text-gray-500 mt-1">Get in touch with our expert team.</p>
                </div>
            </div>
        </div>
    );
}
