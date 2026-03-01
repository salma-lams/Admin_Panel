"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logoutThunk } from "../../store/authSlice";
import {
  LayoutDashboard, Users, ShoppingBag, Settings, LogOut, Shield, ChevronRight, BarChart3,
  ClipboardList, Megaphone, HelpCircle
} from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/users", icon: Users, adminOnly: true },
  { label: "Orders", href: "/dashboard/orders", icon: ClipboardList },
  { label: "Products", href: "/dashboard/products", icon: ShoppingBag },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Marketing", href: "/dashboard/marketing", icon: Megaphone },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help", href: "/dashboard/help", icon: HelpCircle },
];

interface Props { onClose?: () => void }

export default function Sidebar({ onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  async function handleLogout() {
    await dispatch(logoutThunk());
    document.cookie = "_auth=; path=/; max-age=0";
    toast.success("Logged out");
    router.push("/login");
  }

  return (
    <aside className="flex flex-col h-full bg-gray-950 border-r border-gray-800 w-64">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 shadow-lg shadow-brand-600/30">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg text-white tracking-tight">AdminHub</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon, adminOnly }) => {
          if (adminOnly && user?.role !== "admin") return null;
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="opacity-70" />}
              {adminOnly && !active && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-600/20 text-brand-400 font-semibold">ADMIN</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 pb-4 border-t border-gray-800 pt-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-900 mb-2">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center font-semibold text-sm text-white shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name ?? "User"}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role ?? "user"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          id="logout-btn"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
