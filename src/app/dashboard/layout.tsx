"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { getMeThunk } from "../../store/authSlice";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user, authChecked } = useAppSelector((s: any) => s.auth);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!authChecked) {
            dispatch(getMeThunk());
        }
    }, [dispatch, authChecked]);

    useEffect(() => {
        if (authChecked && !user) {
            router.replace("/login");
        }
    }, [authChecked, user, router]);

    if (!authChecked || (authChecked && !user)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm">Verifying Session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
                    <div className="relative z-50 animate-slide-in">
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
