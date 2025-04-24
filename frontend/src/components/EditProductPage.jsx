import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EditProductForm from "./EditProductForm";
import Footer from "./Footer";

const EditProductPage = () => {
  const { id } = useParams();
  const [editProduct, setEditProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }
        return res.json();
      })
      .then((data) => {
        // Handle image
        const image = typeof data.image === "string"
          ? data.image.split(",")[0] // in case it was saved as a comma-separated string
          : data.image?.path || "";

        const imagePath = image.startsWith("http") ? image : `/${image}`;
        setPreviewImage(imagePath);

        // Clean the image field to be a single string
        setEditProduct({ ...data, image });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setLoading(false);
      });
  }, [id]);

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
      setEditProduct({ ...editProduct, image: files[0] });
    } else {
      setEditProduct({ ...editProduct, [name]: value });
    }
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      const formData = new FormData();
      for (let key in updatedData) {
        formData.append(key, updatedData[key]);
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to update product:", errorText);
        throw new Error("Failed to update product");
      }

      await res.json();
      alert("Product updated successfully!");
      navigate("/admin/view-products");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (loading || !editProduct) return <div>Loading...</div>;

  return (
    <>
      <div className="container mt-4">
        <h2>Edit Product</h2>
        <EditProductForm
          product={editProduct}
          handleEditChange={handleEditChange}
          handleEditSubmit={handleEditSubmit}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
        />
      </div>
      <Footer />
    </>
  );
};

export default EditProductPage;
