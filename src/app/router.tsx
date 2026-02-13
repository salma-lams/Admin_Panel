import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../pages/Users/Users";
import Products from "../pages/Products/Products";
import Login from "../pages/auth/Login";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "products",
        element: <Products />,
      },
    ],
  },
]);

export default router;
