import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDashboard from "@/pages/user/books/UserDashboard";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageUsers from "@/pages/admin/ManageUsers";

import AdminRoutes from "./AdminRoutes";
import Login from "@/pages/auth/Login";

import Cart from "@/pages/user/cart/Cart";
import Profile from "@/pages/user/profile/Profile";
import ManageBooks from "@/pages/admin/ManageBooks";
import AddBook from "@/pages/admin/AddBook";
import OrderHistory from "@/pages/admin/OrderHistory";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        // user Routes
        <Route
          path="/user/dashboard"
          element={
            <AdminRoutes>
              <UserDashboard />
            </AdminRoutes>
          }
        />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/profile" element={<Profile />} />
        // admin Routes
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoutes adminOnly>
              <AdminDashboard />
            </AdminRoutes>
          }
        />
        <Route path="/admin/add-book" element={<AddBook />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route
          path="/admin/manage-users/order-history"
          element={<OrderHistory />}
        />
        <Route path="/admin/manage-books/:bookId" element={<ManageBooks />} />
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
