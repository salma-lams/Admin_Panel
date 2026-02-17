const Dashboard = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            120
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm">
            Total Products
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            75
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm">
            Revenue
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            $5,400
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
