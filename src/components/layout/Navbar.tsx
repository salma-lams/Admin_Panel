"use client";

import { usePathname } from "next/navigation";

function getTitle(pathname: string): string {
  if (pathname.startsWith("/users")) return "Users";
  if (pathname.startsWith("/products")) return "Products";
  if (pathname.startsWith("/login")) return "Login";
  return "Dashboard";
}

export default function Navbar() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">{getTitle(pathname)}</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Admin</span>
        <div className="h-8 w-8 rounded-full bg-blue-600" />
      </div>
    </header>
  );
}
