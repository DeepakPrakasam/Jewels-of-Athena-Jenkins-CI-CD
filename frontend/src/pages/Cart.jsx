import React, { useEffect, useState } from "react";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload?.id;

    fetch(`/api/cart/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Cart fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("🗑️ " + data.message);
        fetchCart(); // refresh cart
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  const handleCheckout = () => {
    alert("💳 Checkout functionality coming soon!");
    // TODO: Redirect to /checkout or trigger order logic
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.product.price, 0);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>{/* for remove btn */}</th> 
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const imageSrc = item.product.image?.startsWith("http")
                  ? item.product.image
                  : `/${item.product.image}`;

                return (
                  <tr key={item._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={imageSrc}
                          alt={item.product.title}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <span>{item.product.title}</span>
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>₹{item.product.price}</td>
                    <td>₹{item.quantity * item.product.price}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemove(item.product._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h4>Total: ₹{getTotal()}</h4>
          <button className="btn btn-success mt-3" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
