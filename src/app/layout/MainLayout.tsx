import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8 overflow-y-auto flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default MainLayout;
