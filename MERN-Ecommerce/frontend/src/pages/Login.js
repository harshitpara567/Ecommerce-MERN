import React, { useState, useEffect } from 'react';
import loginIcons from '../assest/assest/signin.gif';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/cartSlice'; 
import { fetchUserDetails } from '../store/userSlice'; 

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        identifier: "",
        password: ""
    });
    const [isFocused, setIsFocused] = useState({
        identifier: false,
        password: false
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.user.userDetails); 
    
    useEffect(() => {
        if (userDetails) {
            navigate("/home");
        }
    }, [userDetails, navigate]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFocus = (field) => {
        setIsFocused(prev => ({
            ...prev,
            [field]: true
        }));
    };

    const handleBlur = (field) => {
        setIsFocused(prev => ({
            ...prev,
            [field]: false
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const dataResponse = await fetch(SummaryApi.signIn.url, {
                method: SummaryApi.signIn.method,
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const dataApi = await dataResponse.json();

            if (dataApi.success) {
                if (dataApi.data?._id) {
                    localStorage.setItem("userId", dataApi.data._id); 
                    localStorage.setItem("token", dataApi.token); 
                    
                    dispatch(fetchUserDetails(dataApi.data._id));
                    dispatch(fetchCart(dataApi.data._id));
                }

                toast.success(dataApi.message);
                navigate("/home");
            } else if (dataApi.error) {
                toast.error(dataApi.message);
            }
        } catch (error) {
            toast.error("Login failed. Please try again.");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4">
                        <img src={loginIcons} alt="login icons" className="w-full h-full object-contain" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-white">Welcome Back!</h2>
                    <p className="mt-2 text-sm text-gray-300">Sign in to continue your journey</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-gray-300 mb-1">
                                Email or Phone
                            </label>
                            <div className={`mt-1 relative rounded-md shadow-sm transition-all duration-200 ${isFocused.identifier ? 'ring-2 ring-purple-500' : ''}`}>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className={`h-5 w-5 ${isFocused.identifier ? 'text-purple-400' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    id="identifier"
                                    type="text"
                                    name="identifier"
                                    value={data.identifier}
                                    onChange={handleOnChange}
                                    onFocus={() => handleFocus('identifier')}
                                    onBlur={() => handleBlur('identifier')}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none transition-all duration-200"
                                    placeholder="Enter email or phone number"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-gray-300 flex justify-between mb-1">
                                <span>Password</span>
                                <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
                                    Forgot password?
                                </Link>
                            </label>
                            <div className={`mt-1 relative rounded-md shadow-sm transition-all duration-200 ${isFocused.password ? 'ring-2 ring-purple-500' : ''}`}>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className={`h-5 w-5 ${isFocused.password ? 'text-purple-400' : 'text-gray-400'}`} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    onChange={handleOnChange}
                                    onFocus={() => handleFocus('password')}
                                    onBlur={() => handleBlur('password')}
                                    required
                                    className="block w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none transition-all duration-200"
                                    placeholder="Enter your password"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="text-gray-400 hover:text-purple-400 focus:outline-none transition-colors duration-200"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-purple-500/30'}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                <>
                                    Sign In
                                    <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link 
                            to="/sign-up" 
                            className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200 inline-flex items-center"
                        >
                            Create an account <FaArrowRight className="ml-1 text-sm" />
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Login;