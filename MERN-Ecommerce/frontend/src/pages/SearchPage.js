import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import common from "../common";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const abortController = new AbortController();

  const fetchSearchResults = async () => {
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = common.get_products;
      if (!endpoint || (typeof endpoint !== 'function' && !endpoint.url)) {
        throw new Error("Invalid API configuration");
      }

      const url = typeof endpoint === 'function' 
        ? endpoint(query).url 
        : `${endpoint.url}?search=${encodeURIComponent(query)}`;

      const method = typeof endpoint === 'function' 
        ? endpoint(query).method || 'GET' 
        : endpoint.method || 'GET';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal
      });

      // ... rest of your success/error handling
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      if (!abortController.signal.aborted) setLoading(false);
    }
  };

  const debounceTimer = setTimeout(fetchSearchResults, 500);
  return () => {
    abortController.abort();
    clearTimeout(debounceTimer);
  };
}, [query]);

  // Render states
  if (loading) {
    return <div className="text-center mt-10">Loading search results...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500">
        {query ? `No products found for "${query}"` : "Enter a search query"}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        Search Results for "{query}"
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg p-4 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;