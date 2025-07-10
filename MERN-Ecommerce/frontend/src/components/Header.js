import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails, clearUserDetails } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaRegCircleUser, FaStore, FaBolt } from "react-icons/fa6";
import { GrSearch } from "react-icons/gr";
import { MdPersonOutline, MdLogout, MdShoppingCart, MdMenu, MdClose, MdHome, MdCategory, MdContactMail } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";

const Header = () => {
  const user = useSelector((state) => state.user.userDetails || {});
  const cartItems = useSelector((state) => state.cart.items || []);
  const [greeting, setGreeting] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [profilePicURL, setProfilePicURL] = useState("");
  const backendURL = 'http://localhost:8080';
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Debounced search handler
  const handleSearch = useDebouncedCallback((value) => {
    if (value) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    } else {
      navigate("/search");
    }
  }, 500);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return "Good morning";
    if (currentHour >= 12 && currentHour < 18) return "Good afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    setGreeting(user.name ? `${getGreeting()}, ${user.name}!` : `${getGreeting()}, Guest!`);
  }, [user.name]);

  useEffect(() => {
    if (user.profilePicture) {
      const cleanedPath = user.profilePicture.replace(/\\/g, '/');
      const filename = cleanedPath.split('/').pop();
      setProfilePicURL(`${backendURL}/uploads/${filename}`);
    } else {
      setProfilePicURL("");
    }
  }, [user.profilePicture, backendURL]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    dispatch(clearUserDetails());
    toast.success("Successfully logged out!");
    setIsDropdownOpen(false);
    setIsHamburgerOpen(false);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
    if (!isDropdownOpen) setIsHamburgerOpen(false);
  };

  const toggleHamburger = () => {
    setIsHamburgerOpen(prev => !prev);
    if (!isHamburgerOpen) setIsDropdownOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (hamburgerRef.current && !hamburgerRef.current.contains(event.target)) {
        setIsHamburgerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 shadow-lg bg-gradient-to-r from-white to-gray-50 fixed w-full z-40 border-b border-gray-100">
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to={"/"} className="group" aria-label="Home">
            <div className="flex items-center space-x-2 transform group-hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <FaStore className="text-white text-xl" />
                  <HiSparkles className="absolute -top-1 -right-1 text-yellow-400 text-xs animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent group-hover:from-red-700 group-hover:to-red-900 transition-all duration-300">
                  Future Store
                </h1>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden lg:flex items-center w-full max-w-sm">
          <div className="relative w-full">
            <label htmlFor="desktopSearch" className="sr-only">Search products</label>
            <input
              type="search"
              id="desktopSearch"
              name="searchQuery"
              placeholder="Search amazing products..."
              className="w-full outline-none px-4 py-2 text-gray-700 bg-gray-50 rounded-full border-2 border-transparent focus:border-red-300 focus:bg-white transition-all duration-300 shadow-sm focus:shadow-md"
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              value={search}
              aria-label="Search products"
              autoComplete="off"
            />
            <button 
              className="absolute right-1 top-1 bottom-1 bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center rounded-full px-4 text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
              aria-label="Submit search"
            >
              <GrSearch className="text-sm" />
            </button>
          </div>
        </div>

        {/* User Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {greeting}
          </div>

          {/* Profile Dropdown */}
          <div className="cursor-pointer relative flex justify-center" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center focus:outline-none group"
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
            >
              {profilePicURL ? (
                <div className="relative">
                  <img
                    src={profilePicURL}
                    className="w-10 h-10 rounded-full object-cover border-3 border-gray-200 group-hover:border-red-400 transition-all duration-300 shadow-md group-hover:shadow-lg"
                    alt={user.name || "User Profile"}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-red-600 transition-all duration-300 bg-gray-100 hover:bg-red-50 shadow-md hover:shadow-lg group">
                  <FaRegCircleUser className="text-2xl" />
                </div>
              )}
            </button>

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-xl overflow-hidden z-50 transform origin-top-right transition-all duration-200 ease-out top-full ring-1 ring-black ring-opacity-5 border border-gray-100">
                {/* ... (keep existing dropdown content) ... */}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative flex items-center">
            <Link
              to="/cart"
              className="text-gray-600 hover:text-red-600 transition-all duration-300 group relative"
              aria-label="Shopping cart"
            >
              <div className="p-2 rounded-full bg-gray-100 group-hover:bg-red-50 transition-all duration-300 shadow-md group-hover:shadow-lg">
                <MdShoppingCart className="text-2xl" />
              </div>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-bold w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="relative" ref={hamburgerRef}>
            <button
              onClick={toggleHamburger}
              className="p-2 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-300 shadow-md hover:shadow-lg group"
              aria-label="Menu"
              aria-expanded={isHamburgerOpen}
            >
              {isHamburgerOpen ? (
                <MdClose className="text-2xl transform group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <MdMenu className="text-2xl group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>

            {isHamburgerOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl rounded-xl overflow-hidden z-50 transform origin-top-right transition-all duration-200 ease-out border border-gray-100">
                <div className="py-2">
                  {/* Mobile Search */}
                  <div className="lg:hidden px-6 py-3">
                    <label htmlFor="mobileSearch" className="sr-only">Search products</label>
                    <input
                      type="search"
                      id="mobileSearch"
                      name="searchQuery"
                      placeholder="Search products..."
                      className="w-full outline-none px-4 py-2 text-gray-700 bg-gray-50 rounded-lg border-2 border-transparent focus:border-red-300 focus:bg-white transition-all duration-300"
                      onChange={(e) => {
                        setSearch(e.target.value);
                        handleSearch(e.target.value);
                      }}
                      value={search}
                      aria-label="Search products"
                      autoComplete="off"
                    />
                  </div>
                  {/* ... (keep existing mobile menu links) ... */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;