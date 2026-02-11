import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkStyle =
    "block px-4 py-2 rounded hover:bg-gray-700 transition text-sm";

  return (
    <aside className="w-60 bg-gray-900 text-white p-4 space-y-3">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <NavLink to="/dashboard" className={linkStyle}>
        Dashboard
      </NavLink>

      <NavLink to="/users" className={linkStyle}>
        Users
      </NavLink>

      <NavLink to="/products" className={linkStyle}>
        Products
      </NavLink>
    </aside>
  );
}
