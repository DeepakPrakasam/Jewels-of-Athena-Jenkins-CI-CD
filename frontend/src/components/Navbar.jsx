import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar({ toastRef }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(userRole);
  
    // Redirect to dashboard ONLY if current path is exactly "/admin"
    if (userRole === "admin" && window.location.pathname === "/admin") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);
  

  const showToast = (message, type = "primary") => {
    toastRef?.current?.show(message, type);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    showToast("Logged out successfully", "info");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-light rounded-2" style={{ backgroundColor: "#ffd0d0" }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/"><strong>DJ</strong></Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse justify-content-lg-center" id="navbarNav">
          <ul className="navbar-nav">
            {role === "admin" ? (
              <>
                {/* Dropdown for Manage Products */}
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <strong>Manage Products</strong>
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/admin/view-products">View All Products</Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin/add-product">Add Product</Link>
                    </li>
                  </ul>
                </li>

                {/* Manage Orders */}
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/orders"><strong>Manage Orders</strong></Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/"><strong>All Jewellery</strong></Link></li>
                <li className="nav-item"><Link className="nav-link" to="/gold"><strong>Gold</strong></Link></li>
                <li className="nav-item"><Link className="nav-link" to="/silver"><strong>Silver</strong></Link></li>
                <li className="nav-item"><Link className="nav-link" to="#"><strong>Platinum</strong></Link></li>
                <li className="nav-item"><Link className="nav-link" to="#"><strong>Collections</strong></Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Auth Buttons */}
        <div className="d-flex align-items-center" id="auth-buttons">
          {isLoggedIn ? (
            <>
              <button className="btn btn-link text-dark me-3" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i> LOG OUT
              </button>
              {role !== "admin" && (
                <Link to="/cart" className="text-dark">
                  <i className="fas fa-shopping-cart fa-lg"></i>
                </Link>
              )}
            </>
          ) : (
            <Link to="/login" className="btn btn-link text-dark me-3">
              <i className="fas fa-user me-2"></i> LOG IN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
