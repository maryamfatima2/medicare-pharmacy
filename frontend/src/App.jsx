import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import MedicineList from './pages/MedicineList';
import MedicineDetails from './pages/MedicineDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import OrderSuccess from './pages/OrderSuccess';
import About from './pages/About';
import Contact from './pages/Contact';
import Categories from './pages/Categories';
import ForgotPassword from './pages/ForgotPassword';
import Wishlist from './pages/Wishlist';
import DynamicCRUD from './pages/DynamicCRUD';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageMedicines from './pages/admin/ManageMedicines';
import AddMedicine from './pages/admin/AddMedicine';
import EditMedicine from './pages/admin/EditMedicine';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/ManageCategories';

import { useAuth } from './context/AuthContext';

function App() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/medicines" element={<MedicineList />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/medicine/:id" element={<MedicineDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />

          {/* User Protected Routes */}
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <OrderHistory /> : <Navigate to="/login" />} />
          <Route path="/order/:id" element={user ? <OrderDetails /> : <Navigate to="/login" />} />
          <Route path="/order-success/:id" element={user ? <OrderSuccess /> : <Navigate to="/login" />} />
          <Route path="/wishlist" element={user ? <Wishlist /> : <Navigate to="/login" />} />
          
          <Route path="/dynamic" element={<DynamicCRUD />} />

          {/* Admin Routes */}
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admin/medicines" element={isAdmin ? <ManageMedicines /> : <Navigate to="/" />} />
          <Route path="/admin/medicine/add" element={isAdmin ? <AddMedicine /> : <Navigate to="/" />} />
          <Route path="/admin/medicine/edit/:id" element={isAdmin ? <EditMedicine /> : <Navigate to="/" />} />
          <Route path="/admin/orders" element={isAdmin ? <ManageOrders /> : <Navigate to="/" />} />
          <Route path="/admin/users" element={isAdmin ? <ManageUsers /> : <Navigate to="/" />} />
          <Route path="/admin/categories" element={isAdmin ? <ManageCategories /> : <Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
