// src/components/ProductDetails.js - Debug Version

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { HiShoppingCart, HiArrowLeft } from "react-icons/hi";
import common from "../common";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      // Debug: Log what we're working with
      console.log("ProductId:", productId);
      console.log("Common module:", common);
      console.log("SummaryApi:", common?.SummaryApi);
      console.log("Available methods:", common?.SummaryApi ? Object.keys(common.SummaryApi) : "No SummaryApi");

      if (!productId) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      if (!common) {
        setError("Common module is not available.");
        setLoading(false);
        return;
      }

      if (!common.SummaryApi) {
        setError("SummaryApi is not available in common module.");
        setLoading(false);
        return;
      }

      if (!common.SummaryApi.get_single_product) {
        setError(`get_single_product method not found. Available methods: ${Object.keys(common.SummaryApi).join(', ')}`);
        setLoading(false);
        return;
      }

      if (typeof common.SummaryApi.get_single_product !== 'function') {
        setError("get_single_product is not a function.");
        setLoading(false);
        return;
      }

      try {
        const apiConfig = common.SummaryApi.get_single_product(productId);
        console.log("API Config:", apiConfig);

        const response = await fetch(apiConfig.url, {
          method: apiConfig.method,
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.success) {
          setProduct(data.data);
        } else {
          setError(data.message || "Failed to fetch product details.");
          console.error("API Error:", data.message);
        }
      } catch (err) {
        setError("An error occurred while fetching product details.");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      setError("Please log in to add items to cart.");
      return;
    }

    if (!productId) {
      setError("Product ID missing for cart.");
      return;
    }

    try {
      dispatch(addToCart({ 
        userId, 
        productId, 
        quantity: 1,
        product: product
      }));

      alert("Product added to cart successfully!");
      
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add product to cart.");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-6">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleGoBack}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <HiArrowLeft />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">📦</div>
          <p className="text-gray-500 mb-4">Product not found.</p>
          <button
            onClick={handleGoBack}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <HiArrowLeft />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium"
        >
          <HiArrowLeft size={20} />
          Back to Products
        </button>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={product.image || "/api/placeholder/500/500"}
                alt={product.name || "Product"}
                className="w-full h-96 md:h-full object-cover"
                onError={(e) => {
                  e.target.src = "/api/placeholder/500/500";
                }}
              />
            </div>

            <div className="md:w-1/2 p-8">
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {product.name || "Product Name"}
                  </h1>
                  
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {product.description || "No description available."}
                  </p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-teal-600">
                      ₹{product.price || "0"}
                    </span>
                  </div>

                  {product.category && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">Category: </span>
                      <span className="text-sm text-gray-600">{product.category}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl transition-colors"
                >
                  <HiShoppingCart size={24} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;