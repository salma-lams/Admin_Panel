import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

/* ================= TYPES ================= */

type User = {
  id: number;
  name: string;
  email: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
};

/* ================= MOCK DATA ================= */

const mockUsers: User[] = [
  { id: 1, name: "Sara Johnson", email: "sara@mail.com" },
  { id: 2, name: "Adam Smith", email: "adam@mail.com" },
  { id: 3, name: "Lina Brown", email: "lina@mail.com" },
  { id: 4, name: "John Carter", email: "john@mail.com" },
  { id: 5, name: "Emily Clark", email: "emily@mail.com" },
  { id: 6, name: "Daniel Lee", email: "daniel@mail.com" },
  { id: 7, name: "Sophia Kim", email: "sophia@mail.com" },
];

const mockProducts: Product[] = [
  { id: 1, name: "Pro Plan", price: 120 },
  { id: 2, name: "Starter Plan", price: 60 },
  { id: 3, name: "Enterprise", price: 350 },
  { id: 4, name: "Growth Plan", price: 180 },
  { id: 5, name: "Advanced Plan", price: 240 },
];

/* ================= MAIN ================= */

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers);
      setProducts(mockProducts);
    }, 400);
  }, []);

  const revenue = useMemo(
    () => products.reduce((acc, p) => acc + p.price, 0),
    [products]
  );

  const avgPrice =
    products.length > 0 ? (revenue / products.length).toFixed(0) : 0;

  const chartData = products.map((p, index) => ({
    name: `P${index + 1}`,
    revenue: p.price,
    users: Math.floor(Math.random() * 100) + 20,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 px-8 py-14">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* HEADER */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
              Performance Dashboard
            </h1>
            <p className="text-slate-500 mt-3 text-lg">
              Real-time business analytics overview
            </p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl shadow-lg transition">
            Generate Report
          </button>
        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <KPI
            title="Users"
            value={users.length}
            icon={<Users size={22} />}
            growth="+12%"
            color="blue"
          />

          <KPI
            title="Revenue"
            value={`$${revenue}`}
            icon={<DollarSign size={22} />}
            growth="+18%"
            color="green"
          />

          <KPI
            title="Avg Price"
            value={`$${avgPrice}`}
            icon={<TrendingUp size={22} />}
            growth="-4%"
            color="red"
          />

          <KPI
            title="Products"
            value={products.length}
            icon={<Package size={22} />}
            growth="+5%"
            color="blue"
          />
        </div>

        {/* CHART + USERS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* CHART */}
          <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-8">
              Revenue & Users Growth
            </h2>

            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* USERS CARD */}
          <div className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-8">
              Latest Users
            </h2>

            <div className="space-y-6">
              {users.slice(-5).map((u) => (
                <div
                  key={u.id}
                  className="flex justify-between items-center p-4 rounded-2xl hover:bg-slate-50 transition"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{u.name}</p>
                    <p className="text-sm text-slate-500">{u.email}</p>
                  </div>

                  <span className="text-xs px-4 py-1.5 rounded-full bg-green-100 text-green-600 font-medium">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ================= KPI COMPONENT ================= */

const KPI = ({
  title,
  value,
  icon,
  growth,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  growth: string;
  color: "green" | "red" | "blue";
}) => {
  const colorStyles = {
    green: "bg-green-50 text-green-600 border-green-200",
    red: "bg-red-50 text-red-600 border-red-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
  };

  const isPositive = growth.startsWith("+");

  return (
    <div className={`p-8 rounded-3xl border shadow-lg transition hover:-translate-y-1 hover:shadow-2xl ${colorStyles[color]}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{title}</span>
        {icon}
      </div>

      <h3 className="text-4xl font-bold mt-6">{value}</h3>

      <div className="flex items-center gap-2 mt-4 text-sm font-medium">
        {isPositive ? (
          <ArrowUpRight size={16} />
        ) : (
          <ArrowDownRight size={16} />
        )}
        {growth} this month
      </div>
    </div>
  );
};

export default Dashboard;
