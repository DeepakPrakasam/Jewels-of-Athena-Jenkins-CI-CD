import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";


const AdminViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const navigate = useNavigate();

  // Fetch products from the API
  const fetchProducts = () => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  // Handle the delete action
  const handleDelete = (id) => {
    // Confirm the deletion
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            // Remove the deleted product from the state
            setProducts(products.filter((product) => product._id !== id));
            alert("Product deleted successfully!");
          } else {
            alert("Failed to delete product.");
          }
        })
        .catch((err) => {
          console.error("Error deleting product:", err);
          alert("Failed to delete product.");
        });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-start">Manage Products</h2>

      <div className="row justify-content-center g-4">
        {products.map((item) => (
          <div className="col-auto" key={item._id}>
            <div className="card rounded-3 h-100 shadow-sm" style={{ width: "18rem" }}>
              {/* Check if image is a string and starts with "http" */}
              <img
                className="card-img-top img-fluid rounded-3"
                src={typeof item.image === "string" && item.image.startsWith("http") ? item.image : `/${item.image}`}
                alt={item.title}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{item.title}</h5>
                <h6 className="text-muted">₹{item.price}</h6>
              </div>
              <div className="card-footer mb-3 d-flex gap-3">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => navigate(`/admin/products/edit/${item._id}`)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-outline-danger w-100"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminViewProducts;
