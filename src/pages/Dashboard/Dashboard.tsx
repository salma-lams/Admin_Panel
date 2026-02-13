const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-400 text-sm">Total Users</h3>
          <p className="text-2xl font-bold mt-2">120</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-400 text-sm">Total Products</h3>
          <p className="text-2xl font-bold mt-2">75</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-400 text-sm">Revenue</h3>
          <p className="text-2xl font-bold mt-2">$5,400</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
