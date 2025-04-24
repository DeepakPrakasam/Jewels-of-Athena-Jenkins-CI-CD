import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Toast from "../components/Toast";

import Footer from "../components/Footer";

function Login({ toastRef }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const showToast = (message, type) => {
    toastRef.current?.show(message, type); // Use the passed toastRef
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🔐 Login button clicked");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailOrPhone, password }),
      });

      const data = await res.json();
      console.log("📦 Response from server:", data);

      if (res.ok) {
        console.log("✅ Login success");
        localStorage.setItem("token", data.token);
      
        const [, payload] = data.token.split(".");
        const decoded = JSON.parse(atob(payload));
        localStorage.setItem("role", decoded.role);
      
        showToast("Login successful!", "success");
      
        setTimeout(() => {
          if (decoded.role === "admin") {
            window.location.href = "/admin/dashboard";  // 👉 Redirect admin to admin panel
          } else {
            window.location.href = "/";  // 👉 Redirect user to homepage
          }
        }, 1500);
      }
      
       else {
        showToast(data.message || "Login failed", "danger");
      }
    } catch (err) {
      console.error("🚨 Login error:", err);
      showToast("Login failed. Try again.", "danger");
    }
  };
  return (
    <>
      <div
        style={{
          maxWidth: "500px",
          margin: "50px auto",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "20px",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff3d3",
            padding: "15px",
            textAlign: "center",
            borderRadius: "10px 10px 0 0",
            marginBottom: "20px",
          }}
        >
          <h4 className="mb-3 rounded-3">Dhandapani Jewellery</h4>
        </div>

        <form onSubmit={handleLogin}>
          <h4 className="d-flex justify-content-center">
            Login to Dhandapani Jewellery
          </h4>
          <p className="text-center">
            Login with your email address or mobile number to get the coupons
            associated with your account.
          </p>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="emailOrPhone"
              placeholder="Enter your email or phone"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <button type="button" className="btn btn-outline-primary w-100">
              Login with OTP
            </button>
          </div>

          <div style={{ textAlign: "center" }}>
            <span
              style={{
                padding: "0 10px",
                fontWeight: 600,
                display: "inline-block",
                borderTop: "1px solid #ccc",
                width: "100%",
              }}
            >
              or
            </span>
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <button type="submit" className="btn btn-outline-secondary w-100">
              Login
            </button>
          </div>

          <div className="mb-3 text-center">
            <p>Login with</p>
            <button type="button" className="btn btn-outline-danger w-100 mb-2">
              <i className="fab fa-google me-2"></i> Google
            </button>
          </div>

          <div className="text-center">
            <a
              href="/signup"
              style={{ color: "#7a2f00", textDecoration: "none" }}
            >
              New User? Sign Up
            </a>{" "}
            |{" "}
            <a href="#" style={{ color: "#7a2f00", textDecoration: "none" }}>
              Forgot Password
            </a>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Login;
