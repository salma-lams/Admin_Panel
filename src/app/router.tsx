import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../pages/Users/Users";
import Products from "../pages/Products/Products";
import Login from "../pages/auth/Login";

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/products" element={<Products />} />
      </Route>
    </Routes>
  );
}
