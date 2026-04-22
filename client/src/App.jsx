import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import Navbar from './components/layout/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ManageRestaurants from './pages/admin/ManageRestaurants';
import ManageMenus from './pages/admin/ManageMenus';
import ManageOrders from './pages/admin/ManageOrders';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <div className="app">
            <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/restaurants" element={
                <ProtectedRoute adminOnly>
                  <ManageRestaurants />
                </ProtectedRoute>
              } />
              <Route path="/admin/menus" element={
                <ProtectedRoute adminOnly>
                  <ManageMenus />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute adminOnly>
                  <ManageOrders />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute adminOnly>
                  <AdminSettingsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
        </OrderProvider>
      </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
