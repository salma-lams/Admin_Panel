"use client";
import { useTheme } from "next-themes";
import { Sun, Moon, Bell, Menu, X, Check, Mail } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "../../hooks/redux";
import clsx from "clsx";

interface Props { onMenuClick: () => void }

const DUMMY_NOTIFICATIONS = [
    { id: 1, title: "New user registered", desc: "Jane Doe just signed up.", time: "5m ago", unread: true },
    { id: 2, title: "Server usage high", desc: "CPU usage exceeded 80%.", time: "1h ago", unread: true },
    { id: 3, title: "Daily report ready", desc: "Your analytics report is available.", time: "4h ago", unread: false },
    { id: 4, title: "Product out of stock", desc: "Wireless Mouse inventory is 0.", time: "1d ago", unread: false },
];

export default function Topbar({ onMenuClick }: Props) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const user = useAppSelector((s: any) => s.auth.user);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    return (
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 flex items-center gap-3 relative z-40">
            {/* Mobile menu */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <Menu size={20} />
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-2">
                {/* Notifications */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={clsx(
                            "relative p-2 rounded-xl transition-colors",
                            showNotifications
                                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white dark:ring-gray-950" />
                        )}
                    </button>

                    {/* Email Icon */}
                    <button className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                        <Mail size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white dark:ring-gray-950" />
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl shadow-gray-900/5 overflow-hidden animate-slide-in-down origin-top-right">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                                    >
                                        <Check size={14} />
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[70vh] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                        You have no notifications.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
                                        {notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={clsx(
                                                    "p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer flex gap-3",
                                                    notif.unread ? "bg-brand-50/50 dark:bg-brand-900/10" : ""
                                                )}
                                            >
                                                <div className="mt-0.5 shrink-0">
                                                    <div className={clsx(
                                                        "w-2 h-2 rounded-full mt-1.5",
                                                        notif.unread ? "bg-brand-500" : "bg-transparent"
                                                    )} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={clsx(
                                                        "text-sm font-medium truncate",
                                                        notif.unread ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                                                    )}>
                                                        {notif.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{notif.desc}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-center">
                                <button className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Theme toggle */}
                {mounted && (
                    <button
                        id="theme-toggle"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                )}

                {/* Avatar */}
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center font-semibold text-sm text-white">
                        {user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none">{user?.name ?? "User"}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize leading-none mt-0.5">{user?.role ?? "user"}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
