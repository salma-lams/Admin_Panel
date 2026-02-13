const Navbar = () => {
  return (
    <header className="h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">Admin</span>
        <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
      </div>
    </header>
  );
};

export default Navbar;
