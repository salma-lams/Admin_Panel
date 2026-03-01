"use client";
import { useAppSelector } from "../../../hooks/redux";
import { Mail, Shield, Calendar, User } from "lucide-react";

export default function ProfilePage() {
    const user = useAppSelector((s) => s.auth.user);

    if (!user) return null;

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your account information</p>
            </div>

            <div className="card p-8">
                {/* Avatar */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                    <div className="w-24 h-24 rounded-3xl bg-brand-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-brand-600/30">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <p className="text-gray-400 mt-1">{user.email}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className={user.role === "admin" ? "badge-admin" : "badge-user"}>{user.role}</span>
                            <span className="badge-active">Active</span>
                        </div>
                    </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { icon: User, label: "Full Name", value: user.name },
                        { icon: Mail, label: "Email", value: user.email },
                        { icon: Shield, label: "Role", value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
                        { icon: Calendar, label: "Account", value: "Active" },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                                <Icon size={18} className="text-brand-600 dark:text-brand-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
