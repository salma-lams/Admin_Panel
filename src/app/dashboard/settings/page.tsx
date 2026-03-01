"use client";
import { useState } from "react";
import { Bell, Shield, Key, Smartphone, Globe, Moon, Save, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"general" | "security" | "notifications">("general");
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Settings saved successfully");
        }, 800);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800">
                {(["general", "security", "notifications"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={clsx(
                            "px-4 py-2.5 text-sm font-medium capitalize transition-colors duration-200 border-b-2",
                            activeTab === tab
                                ? "border-brand-500 text-brand-600 dark:text-brand-400"
                                : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">

                {/* General Settings */}
                {activeTab === "general" && (
                    <div className="space-y-8 animate-fade-in">
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Globe size={18} className="text-brand-500" />
                                Regional Settings
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
                                    <select className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                                        <option>English (US)</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                                    <select className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                                        <option>Pacific Time (PT) - Los Angeles</option>
                                        <option>Eastern Time (ET) - New York</option>
                                        <option>Central European Time (CET) - Paris</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Moon size={18} className="text-brand-500" />
                                Appearance
                            </h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                                    <p className="text-xs text-gray-500">Toggle dark mode interface.</p>
                                </div>
                                {/* Toggle switch placeholder */}
                                <div className="w-11 h-6 bg-brand-500 rounded-full relative cursor-pointer flex items-center shadow-inner">
                                    <div className="w-4 h-4 rounded-full bg-white absolute right-1 shadow" />
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                    <div className="space-y-8 animate-fade-in">
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Key size={18} className="text-brand-500" />
                                Change Password
                            </h3>
                            <div className="space-y-4 max-w-md">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                                </div>
                                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors">
                                    Update Password
                                </button>
                            </div>
                        </section>

                        <hr className="border-gray-200 dark:border-gray-800" />

                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                                <Shield size={18} />
                                Danger Zone
                            </h3>
                            <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                <div>
                                    <p className="text-sm font-bold text-red-900 dark:text-red-400">Delete Account</p>
                                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">Permanently delete your account and all data. This action is not reversible.</p>
                                </div>
                                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shrink-0">
                                    Delete Account
                                </button>
                            </div>
                        </section>
                    </div>
                )}

                {/* Notifications Settings */}
                {activeTab === "notifications" && (
                    <div className="space-y-6 animate-fade-in">
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Bell size={18} className="text-brand-500" />
                                Email Notifications
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { title: "Security Alerts", desc: "Get notified when important security events occur.", active: true },
                                    { title: "Weekly Reports", desc: "Receive a weekly summary of your dashboard statistics.", active: true },
                                    { title: "Marketing News", desc: "Hear about latest features and new products.", active: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                        <div className={clsx(
                                            "w-11 h-6 rounded-full relative cursor-pointer flex items-center shadow-inner transition-colors",
                                            item.active ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
                                        )}>
                                            <div className={clsx(
                                                "w-4 h-4 rounded-full bg-white absolute shadow transition-all",
                                                item.active ? "right-1" : "left-1"
                                            )} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* Footer Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium shadow-sm shadow-brand-600/30 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        <span>{loading ? "Saving..." : "Save Preferences"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
