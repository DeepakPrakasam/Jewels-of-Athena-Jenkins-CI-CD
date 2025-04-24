import { useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar'; 
import Toast from './components/Toast';
import PriceTicker from './components/PriceTicker';
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AddProductForm from './components/AddProductForm';
import Gold from './pages/Gold';
import AdminViewProducts from './components/AdminViewProducts';
import EditProductPage from './components/EditProductPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
function App() {
  const toastRef = useRef();

  return (
    <BrowserRouter>
      <PriceTicker />
      <Navbar toastRef={toastRef} />  {/* Render Navbar once here */}
      <Toast ref={toastRef} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gold" element={<Gold/>} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/goldpage/:category" element={<Gold />} />
        <Route path="/login" element={<Login toastRef={toastRef} />} />
        <Route path="/signup" element={<Signup toastRef={toastRef} />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminDashboard /></ProtectedRoute>}/>
        <Route 
          path="/admin/add-product" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddProductForm/>
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/view-products" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminViewProducts/> </ProtectedRoute>}/>
        <Route path="/admin/products/edit/:id" element={<ProtectedRoute allowedRoles={["admin"]}> <EditProductPage/> </ProtectedRoute>}/>

        </Routes>
    </BrowserRouter>
  );
}

export default App;
