import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first.");

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.message);
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Something went wrong.");
    }
  };

  const handleBuyNow = () => {
    alert("🚀 Proceeding to checkout (Buy Now feature coming soon)");
    // TODO: Redirect to a checkout/order creation page
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center mt-5">Product not found.</div>;
  }

  return (
    <>
      <div className="container mt-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="product-image">
              <img
                src={
                  product.image?.startsWith("http")
                    ? product.image
                    : `/${product.image}`
                }
                alt={product.title}
                className="img-fluid rounded shadow-lg"
                style={{
                  maxHeight: "500px",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="product-details card p-4 shadow-sm" style={{ borderRadius: "10px" }}>
              <h2 className="product-title" style={{ fontSize: "2rem", fontWeight: "bold", color: "#333", marginBottom: "15px" }}>
                {product.title}
              </h2>
              <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "10px" }}>
                <strong>Category:</strong> {product.category}
              </p>
              <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "10px" }}>
                <strong>Subcategory:</strong> {product.subcategory}
              </p>
              <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "10px" }}>
                <strong>Metal & Purity:</strong> {product.metalPurity}
              </p>
              <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "10px" }}>
                <strong>Weight:</strong> {product.weight} grams
              </p>
              <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "10px" }}>
                <strong>Price:</strong> ₹{product.price}
              </p>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  marginBottom: "10px",
                  textAlign: "justify", // Justify the description text
                  lineHeight: "1.4", // Adjust line height for readability
                }}
              >
                <strong>Description:</strong> {product.description}
              </p>

              <div className="mt-4 d-flex justify-content-start gap-3">
                <button
                  className="btn btn-warning custom-btn"
                  disabled={!isLoggedIn}
                  onClick={handleAddToCart}
                  style={{
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    transition: "transform 0.3s ease",
                    borderRadius: "5px",
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn-success custom-btn"
                  disabled={!isLoggedIn}
                  onClick={handleBuyNow}
                  style={{
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    transition: "transform 0.3s ease",
                    borderRadius: "5px",
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                >
                  Buy Now
                </button>
              </div>
              {!isLoggedIn && (
                <p className="text-danger mt-2" style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  Please login to make a purchase.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
