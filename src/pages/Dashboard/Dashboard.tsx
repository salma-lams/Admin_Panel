import { useEffect, useState } from "react";
import { getUsers } from "../../features/users/user.api";
import { getProducts } from "../../features/products/product.api";
import type { User } from "../../features/users/user.types";
import type { Product } from "../../features/products/product.types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await getUsers();
      const productsData = await getProducts();
      setUsers(usersData);
      setProducts(productsData);
    };
    fetchData();
  }, []);

  const revenue = products.reduce((acc, p) => acc + p.price, 0);

  const chartData = products.map((p) => ({
    name: p.name,
    revenue: p.price,
  }));

  return (
    <div className="min-h-screen bg-slate-100 p-10 space-y-12">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
            Platform analytics & performance overview
          </p>
        </div>

        <button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:opacity-90 transition">
          + New Report
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPI title="Users" value={users.length} />
        <KPI title="Products" value={products.length} />
        <KPI highlight title="Revenue" value={`$${revenue}`} />
        <KPI title="Growth" value="+18%" />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Revenue Analytics
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                fill="#c7d2fe"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Recent Activity
          </h2>

          <div className="space-y-4 text-sm text-slate-600">
            {users.slice(-4).map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-slate-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Joined platform
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <Card title="Latest Users">
          {users.slice(-5).map((u) => (
            <Row key={u.id} left={u.name} right={u.email} />
          ))}
        </Card>

        <Card title="Top Products">
          {products.slice(-5).map((p) => (
            <Row
              key={p.id}
              left={p.name}
              right={`$${p.price}`}
            />
          ))}
        </Card>

      </div>

    </div>
  );
};

const KPI = ({
  title,
  value,
  highlight,
}: {
  title: string;
  value: number | string;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-3xl p-6 border shadow-sm transition hover:shadow-md ${
      highlight
        ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-transparent"
        : "bg-white border-gray-100"
    }`}
  >
    <p className={`text-sm ${highlight ? "text-indigo-100" : "text-slate-500"}`}>
      {title}
    </p>
    <h3 className="text-3xl font-bold mt-2">
      {value}
    </h3>
  </div>
);

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold text-slate-800 mb-4">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Row = ({
  left,
  right,
}: {
  left: string;
  right: string;
}) => (
  <div className="flex justify-between text-sm text-slate-600 border-b pb-3">
    <span>{left}</span>
    <span className="font-medium text-slate-800">
      {right}
    </span>
  </div>
);

export default Dashboard;
