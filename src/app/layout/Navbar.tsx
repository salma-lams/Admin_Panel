const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
      
      <h2 className="text-lg font-semibold text-gray-800">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Admin
        </span>
        <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
      </div>

    </header>
  );
};

export default Navbar;
