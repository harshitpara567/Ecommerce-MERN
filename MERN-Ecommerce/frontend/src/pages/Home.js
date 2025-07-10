import React, { useState, useEffect } from "react";
import { HiShoppingCart, HiOutlineHeart, HiStar, HiChevronRight } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../store/cartSlice";
import SummaryApi from "../common";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(SummaryApi.get_products.url, {
          method: SummaryApi.get_products.method,
          credentials: "include",
        });

        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
          const uniqueCategories = [...new Set(data.data.map(product => product.category || "Uncategorized"))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch]);

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    const userId = localStorage.getItem("userId");
    const quantity = 1;

    if (!userId || !productId) return;

    dispatch(addToCart({ userId, productId, quantity }));
    
    const button = e.currentTarget;
    button.classList.add("animate-pulse", "bg-green-600");
    setTimeout(() => {
      button.classList.remove("animate-pulse", "bg-green-600");
    }, 1000);
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    pauseOnHover: true,
    fade: true,
    cssEase: 'linear'
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 4);
    const hasHalfStar = (rating || 4) - fullStars >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<HiStar key={i} className="text-yellow-400 inline-block" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<HiStar key={i} className="text-yellow-400 inline-block opacity-60" />);
      } else {
        stars.push(<HiStar key={i} className="text-gray-300 inline-block" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Slider */}
      <div className="relative">
        <Slider {...sliderSettings} className="hero-slider">
          <div className="relative h-96 md:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
              alt="FutureTech"
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex flex-col items-start justify-center px-8 md:px-16">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold text-white max-w-2xl mb-6"
              >
                Welcome to the <span className="text-blue-400">Future</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-300 max-w-lg mb-8"
              >
                Discover cutting-edge technology for tomorrow's world
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link 
                  to="/shop" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium text-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
                >
                  Shop Now <HiChevronRight className="mt-0.5" />
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="relative h-96 md:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
              alt="Electronics"
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex flex-col items-start justify-center px-8 md:px-16">
              <h1 className="text-4xl md:text-6xl font-bold text-white max-w-2xl mb-6">
                Premium <span className="text-purple-400">Electronics</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-lg mb-8">
                High-performance devices for work and play
              </p>
              <Link 
                to="/category/electronics" 
                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
              >
                Explore <HiChevronRight className="mt-0.5" />
              </Link>
            </div>
          </div>

          <div className="relative h-96 md:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1483982258113-b72862e6cff6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
              alt="Fashion"
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 flex flex-col items-start justify-center px-8 md:px-16">
              <h1 className="text-4xl md:text-6xl font-bold text-white max-w-2xl mb-6">
                Trendy <span className="text-pink-400">Fashion</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-lg mb-8">
                Style that speaks before you do
              </p>
              <Link 
                to="/category/clothing" 
                className="bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white px-8 py-3 rounded-lg font-medium text-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-pink-500/30"
              >
                Discover <HiChevronRight className="mt-0.5" />
              </Link>
            </div>
          </div>
        </Slider>
      </div>

      {/* Features */}
      <div className="bg-gray-800/50 py-12 border-t border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ),
                title: "Quality Products",
                desc: "Premium selection"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Fast Delivery",
                desc: "Within 24-48 hours"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Secure Payment",
                desc: "100% secure checkout"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                ),
                title: "Easy Returns",
                desc: "30-day return policy"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-0"
          >
            Our <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Products</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            <button 
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${selectedCategory === "all" 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              All Products
            </button>
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${selectedCategory === category 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-gray-800/50 rounded-xl shadow-lg overflow-hidden animate-pulse border border-gray-700">
                <div className="w-full h-64 bg-gray-700"></div>
                <div className="p-5">
                  <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400">We couldn't find any products in this category.</p>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Link
                      to={`/product/${product._id}`}
                      className="group block bg-gray-800/50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 no-underline border border-gray-700 hover:border-blue-500"
                    >
                      <div className="relative overflow-hidden h-64">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <button 
                            className="w-9 h-9 rounded-full bg-gray-900/80 shadow-md flex items-center justify-center text-gray-300 hover:text-pink-500 transition-colors duration-300"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Handle wishlist logic here
                            }}
                          >
                            <HiOutlineHeart className="h-5 w-5" />
                          </button>
                        </div>
                        {product.discount && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="text-xs text-blue-400 mb-1">{product.category || "General"}</div>
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
                          {product.name}
                        </h3>
                        <div className="mb-3">
                          {renderStars(product.rating)}
                          <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 0})</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="text-lg font-bold text-white">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                            )}
                          </div>
                          {cartItems.some(item => item.productId === product._id) && (
                            <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded-full border border-green-800">
                              In Cart
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(product._id, e)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <HiShoppingCart className="h-5 w-5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Featured Collection */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative">
              <img 
                src="https://images.unsplash.com/photo-1607082352121-fa243f3dde32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80" 
                alt="Featured Collection" 
                className="w-full h-full object-cover min-h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent md:bg-none md:from-transparent md:to-gray-900/80 flex items-center md:items-end p-8">
                <div className="md:w-3/4">
                  <span className="text-blue-400 font-medium">Featured Collection</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white my-3">Summer Tech Essentials</h2>
                  <p className="text-gray-300 mb-6">Discover our curated collection of must-have tech items for the season.</p>
                  <Link 
                    to="/category/electronics" 
                    className="inline-flex items-center bg-white text-gray-900 hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Explore Collection <HiChevronRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-6">
                {filteredProducts.slice(0, 4).map((product) => (
                  <Link 
                    key={product._id} 
                    to={`/product/${product._id}`}
                    className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300 group"
                  >
                    <div className="h-40 mb-3 overflow-hidden rounded-lg">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-white font-medium mb-1 line-clamp-1 group-hover:text-blue-400">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">₹{product.price}</span>
                      <div className="flex">
                        {renderStars(product.rating)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;