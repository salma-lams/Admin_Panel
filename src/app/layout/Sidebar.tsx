import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkStyle =
    "block px-4 py-3 rounded-xl transition font-medium";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 shadow-sm">

      <h1 className="text-2xl font-bold mb-10 text-blue-600">
        Admin Panel
      </h1>

      <nav className="space-y-2">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Products
        </NavLink>

      </nav>

    </aside>
  );
};

export default Sidebar;
