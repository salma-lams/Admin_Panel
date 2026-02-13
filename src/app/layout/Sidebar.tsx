import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkStyle =
    "block px-4 py-3 rounded-lg transition hover:bg-gray-800";

  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-800 p-4">
      <h1 className="text-2xl font-bold mb-8 text-yellow-400">
        Admin Panel
      </h1>

      <nav className="space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? "bg-yellow-500 text-black" : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? "bg-yellow-500 text-black" : ""}`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? "bg-yellow-500 text-black" : ""}`
          }
        >
          Products
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
