import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
const GoldPage = () => {
  const [goldItems, setGoldItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
      .then((res) => res.json()) 
      .then((data) => {
        console.log("Fetched goldItems =", data);
        setGoldItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching gold items:", err);
        setLoading(false);
      });
  }, []);
  
  return (
    <>
        <div>
      {/* Header Image */}
      <div>
        <img
          src="/goldheader.webp"
          alt="Gold Collection"
          className="img-fluid mt-3"
        />
      </div>

      {/* Heading */}
      <h1
        style={{ fontFamily: "Merriweather, serif" }}
        className="d-flex justify-content-center mt-4"
      >
        <i>
          Designed For <strong>Everyday Moments</strong>
        </i>
      </h1>
      

      {/* Loading Indicator */}
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-warning" role="status"></div>
        </div>
      ) : (
        <div className="container mt-5 mb-5">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-4">
            {goldItems.map((item, index) => (
              <div className="col" key={index}>
                <div className="card rounded-3 h-100" onClick={() => navigate(`/product/${item._id}`)} style={{ cursor: "pointer" }}>
                  <img
                    className="card-img-top img-fluid rounded-3"
                    src={item.image.startsWith("http") ? item.image : `/${item.image}`}
                    alt={item.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <h4
                      className="card-title"
                      style={{ fontFamily: "Verdana, sans-serif" }}
                    >
                      ₹{item.price}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default GoldPage;
