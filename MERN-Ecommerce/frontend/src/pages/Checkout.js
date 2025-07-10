// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import {
//     FaArrowLeft,
//     FaCreditCard,
//     FaMoneyBillWave,
//     FaShippingFast,
//     FaLock,
//     FaRegCheckCircle,
//     FaCcVisa,
//     FaCcMastercard,
//     FaCcAmex,
//     FaCcPaypal
// } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import { loadRazorpayScript } from '../helpers/razorPayment'; // Assuming this helper exists
// import axios from 'axios';

// const Checkout = () => {
//     const cartItems = useSelector((state) => state.cart.items);
//     const totalPrice = useSelector((state) => state.cart.totalPrice);
//     const user = useSelector((state) => state.user.userDetails);
//     const navigate = useNavigate();

//     const [shippingAddress, setShippingAddress] = useState({
//         name: user?.name || '',
//         email: user?.email || '',
//         address: '',
//         city: '',
//         state: '',
//         postalCode: '',
//         phone: user?.phone || '',
//     });

//     const [paymentMethod, setPaymentMethod] = useState('');
//     const [errors, setErrors] = useState({});
//     const [isPlacingOrder, setIsPlacingOrder] = useState(false);
//     const [orderStep, setOrderStep] = useState(1); // 1: Shipping, 2: Payment

//     // Calculate totals
//     const subtotal = totalPrice || 0;
//     const shipping = subtotal > 500 ? 0 : 50;
//     const tax = Math.round(subtotal * 0.05); // 5% tax
//     const finalTotal = subtotal + shipping + tax;

//     useEffect(() => {
//         // Scroll to top when component mounts
//         window.scrollTo(0, 0);

//         // Redirect if cart is empty
//         if (cartItems.length === 0) {
//             toast.info("Your cart is empty");
//             setTimeout(() => navigate('/cart'), 1000);
//         }
//     }, [cartItems.length, navigate]);

//     const validateShippingForm = () => {
//         const newErrors = {};
//         if (!shippingAddress.name) newErrors.name = "Name is required";
//         if (!shippingAddress.email) newErrors.email = "Email is required";
//         else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) newErrors.email = "Email is invalid";
//         if (!shippingAddress.address) newErrors.address = "Address is required";
//         if (!shippingAddress.city) newErrors.city = "City is required";
//         if (!shippingAddress.state) newErrors.state = "State is required";
//         if (!shippingAddress.postalCode) newErrors.postalCode = "Postal code is required";
//         if (!shippingAddress.phone) newErrors.phone = "Phone number is required";
//         else if (!/^\d{10}$/.test(shippingAddress.phone.replace(/\D/g, '')))
//             newErrors.phone = "Please enter a valid 10-digit phone number";

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setShippingAddress((prev) => ({
//             ...prev,
//             [name]: value,
//         }));

//         // Clear error when user types
//         if (errors[name]) {
//             setErrors({
//                 ...errors,
//                 [name]: null
//             });
//         }
//     };

//     const handlePaymentMethodChange = (e) => {
//         setPaymentMethod(e.target.value);
//         if (errors.paymentMethod) {
//             setErrors({
//                 ...errors,
//                 paymentMethod: null
//             });
//         }
//     };

//     const handleContinueToPayment = () => {
//         if (validateShippingForm()) {
//             setOrderStep(2);
//             window.scrollTo(0, 0);
//         }
//     };

//     const handleBackToShipping = () => {
//         setOrderStep(1);
//         window.scrollTo(0, 0);
//     };

//     const handlePlaceOrder = async () => {
//         if (!paymentMethod) {
//             setErrors({
//                 ...errors,
//                 paymentMethod: "Please select a payment method"
//             });
//             return;
//         }

//         setIsPlacingOrder(true);

//         if (paymentMethod === 'cash') {
//             // Simulate order processing for Cash on Delivery
//             try {
//                 console.log('Placing order with Cash on Delivery:', {
//                     cartItems,
//                     totalPrice: finalTotal,
//                     shippingAddress,
//                     paymentMethod,
//                 });

//                 await new Promise(resolve => setTimeout(resolve, 1500));

//                 toast.success('Order placed successfully! Cash on Delivery selected.');
//                 navigate('/order-confirmation');
//             } catch (error) {
//                 toast.error('There was an error processing your order. Please try again.');
//             } finally {
//                 setIsPlacingOrder(false);
//             }
//         } else if (paymentMethod === 'card') {
//             // Integrate Razorpay for Card Payments
//             const res = await loadRazorpayScript();
//             if (!res) {
//                 toast.error("Razorpay failed to load.");
//                 setIsPlacingOrder(false);
//                 return;
//             }

//             try {
//                 const orderResponse = await axios.post("http://localhost:8080/api/payment/create-order", {
//                     amount: finalTotal * 100 // Amount in paise
//                 });

//                 const { id: order_id, amount, currency } = orderResponse.data;

//                 const options = {
//                     key: "rzp_test_nMCrdCBZT6Cxwn", // Replace with your actual Key ID from .env
//                     amount: amount,
//                     currency: currency,
//                     name: "Shop With Us",
//                     description: "Secure Payment",
//                     order_id: order_id,
//                     handler: function (response) {
//                         toast.success("Payment successful!");
//                         console.log("Payment ID:", response.razorpay_payment_id);
//                         console.log("Order ID:", response.razorpay_order_id);
//                         console.log("Signature:", response.razorpay_signature);
//                         navigate('/order-confirmation'); // Redirect to order confirmation page
//                     },
//                     prefill: {
//                         name: shippingAddress.name,
//                         email: shippingAddress.email,
//                         contact: shippingAddress.phone,
//                     },
//                     notes: {
//                         shipping_address: shippingAddress.address + ', ' + shippingAddress.city + ', ' + shippingAddress.state + ' ' + shippingAddress.postalCode,
//                     },
//                     theme: {
//                         color: "#3399cc",
//                     },
//                     modal: {
//                         ondismiss: function() {
//                             toast.error('Payment cancelled.');
//                             setIsPlacingOrder(false);
//                         }
//                     }
//                 };

//                 const paymentObject = new window.Razorpay(options);
//                 paymentObject.open();
//             } catch (error) {
//                 toast.error("Payment failed. Please try again.");
//                 console.error("Payment error:", error);
//                 setIsPlacingOrder(false);
//             }
//         }
//     };

//     const renderShippingStep = () => (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//             className="bg-white rounded-xl shadow-md p-6 md:p-8"
//         >
//             <div className="flex items-center mb-6">
//                 <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">1</div>
//                 <h3 className="text-xl font-bold text-gray-800 ml-3 flex items-center">
//                     <FaShippingFast className="mr-2" /> Shipping Information
//                 </h3>
//             </div>

//             <div className="space-y-5">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     <div>
//                         <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Full Name *</label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={shippingAddress.name}
//                             onChange={handleInputChange}
//                             placeholder="John Doe"
//                             className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
//                         />
//                         {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//                     </div>
//                     <div>
//                         <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email Address *</label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             value={shippingAddress.email}
//                             onChange={handleInputChange}
//                             placeholder="your@email.com"
//                             className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
//                         />
//                         {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//                     </div>
//                 </div>

//                 <div>
//                     <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-2">Street Address *</label>
//                     <input
//                         type="text"
//                         id="address"
//                         name="address"
//                         value={shippingAddress.address}
//                         onChange={handleInputChange}
//                         placeholder="123 Main Street, Apt 4B"
//                         className={`w-full p-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
//                     />
//                     {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
//                     <div>
//                         <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2">City *</label>
//                         <input
//                             type="text"
//                             id="city"
//                             name="city"
//                             value={shippingAddress.city}
//                             onChange={handleInputChange}
//                             placeholder="New York"
//                             className={`w-full p-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
//                         />
//                         {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
//                     </div>
//                     <div>
//                         <label htmlFor="state" className="block text-gray-700 text-sm font-medium mb-2">State *</label>
//                         <input
//                             type="text"
//                             id="state"
//                             name="state"
//                             value={shippingAddress.state}
//                             onChange={handleInputChange}
//                             placeholder="NY"
//                             className={`w-full p-3 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
//                         />
//                         {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
//                     </div>
//                     <div className="col-span-2 md:col-span-1">
//                         <label htmlFor="postalCode" className="block text-gray-700 text-sm font-medium mb-2">Postal Code *</label>
//                         <input
//                             type="text"
//                             id="postalCode"
//                             name="postalCode"
//                             value={shippingAddress.postalCode}
//                             onChange={handleInputChange}
//                             placeholder="10001"
//                             className={`w-full p-3 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
//                         />
//                         {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
//                     </div>
//                 </div>

//                 <div>
//                     <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">Phone Number *</label>
//                     <input
//                         type="tel"
//                         id="phone"
//                         name="phone"
//                         value={shippingAddress.phone}
//                         onChange={handleInputChange}
//                         placeholder="(123) 456-7890"
//                         className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
//                     />
//                     {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
//                 </div>

//                 <div className="mt-6 flex justify-between items-center">
//                     <Link to="/cart" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
//                         <FaArrowLeft className="mr-2" /> Back to Cart
//                     </Link>
//                     <button
//                         onClick={handleContinueToPayment}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-all"
//                     >
//                         Continue to Payment <FaCreditCard className="ml-2" />
//                     </button>
//                 </div>
//             </div>
//         </motion.div>
//     );

//     const renderPaymentStep = () => (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//             className="bg-white rounded-xl shadow-md p-6 md:p-8"
//         >
//             <div className="flex items-center mb-6">
//                 <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">2</div>
//                 <h3 className="text-xl font-bold text-gray-800 ml-3 flex items-center">
//                     <FaCreditCard className="mr-2" /> Payment Method
//                 </h3>
//             </div>

//             {/* Payment Options */}
//             <div className="space-y-4">
//                 <div className="mb-6">
//                     <h4 className="text-gray-700 font-medium mb-3">Select a payment method</h4>

//                     <div className={`border ${errors.paymentMethod ? 'border-red-500' : 'border-gray-200'} rounded-lg p-1`}>
//                         <label
//                             htmlFor="card"
//                             className={`flex items-center p-4 cursor-pointer rounded-md ${paymentMethod === 'card' ? 'bg-blue-50 border border-blue-300' : 'hover:bg-gray-50'}`}
//                         >
//                             <input
//                                 type="radio"
//                                 id="card"
//                                 name="paymentMethod"
//                                 value="card"
//                                 className="form-radio h-5 w-5 text-blue-600"
//                                 onChange={handlePaymentMethodChange}
//                                 checked={paymentMethod === 'card'}
//                             />
//                             <div className="ml-3">
//                                 <span className="font-medium text-gray-800 flex items-center">
//                                     <FaCreditCard className="mr-2 text-blue-600" /> Credit/Debit Card
//                                 </span>
//                                 <span className="text-sm text-gray-500 mt-1 block">Pay securely with your card</span>
//                             </div>
//                             <div className="ml-auto flex items-center space-x-2">
//                                 <FaCcVisa size={24} className="text-blue-700" />
//                                 <FaCcMastercard size={24} className="text-red-500" />
//                                 <FaCcAmex size={24} className="text-blue-500" />
//                                 <FaCcPaypal size={24} className="text-blue-400" />
//                             </div>
//                         </label>

//                         <label
//                             htmlFor="cash"
//                             className={`flex items-center p-4 cursor-pointer rounded-md mt-2 ${paymentMethod === 'cash' ? 'bg-green-50 border border-green-300' : 'hover:bg-gray-50'}`}
//                         >
//                             <input
//                                 type="radio"
//                                 id="cash"
//                                 name="paymentMethod"
//                                 value="cash"
//                                 className="form-radio h-5 w-5 text-green-600"
//                                 onChange={handlePaymentMethodChange}
//                                 checked={paymentMethod === 'cash'}
//                             />
//                             <div className="ml-3">
//                                 <span className="font-medium text-gray-800 flex items-center">
//                                     <FaMoneyBillWave className="mr-2 text-green-600" /> Cash on Delivery
//                                 </span>
//                                 <span className="text-sm text-gray-500 mt-1 block">Pay when you receive your order</span>
//                             </div>
//                         </label>
//                     </div>

//                     {errors.paymentMethod && (
//                         <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>
//                     )}

//                     {paymentMethod === 'card' && (
//                         <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
//                             <p className="text-sm text-gray-700 flex items-center">
//                                 <FaLock className="mr-2 text-blue-600" />
//                                 You will be redirected to a secure payment gateway to complete your purchase safely.
//                             </p>
//                         </div>
//                     )}
//                 </div>

//                 <div className="mt-8 flex justify-between items-center">
//                     <button
//                         onClick={handleBackToShipping}
//                         className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
//                     >
//                         <FaArrowLeft className="mr-2" /> Back to Shipping
//                     </button>

//                     <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={handlePlaceOrder}
//                         disabled={isPlacingOrder}
//                         className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-all ${isPlacingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}
//                     >
//                         {isPlacingOrder ? (
//                             <>
//                                 <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></div>
//                                 Processing...
//                             </>
//                         ) : (
//                             <>
//                                 Place Order <FaRegCheckCircle className="ml-2" />
//                             </>
//                         )}
//                     </motion.button>
//                 </div>
//             </div>
//         </motion.div>
//     );

//     const renderOrderSummary = () => (
//         <div className="bg-white rounded-xl shadow-md p-6 md:p-8 sticky top-4">
//             <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
//             <div className="max-h-64 overflow-auto mb-4 pr-2">
//                 {cartItems.map((item) => {
//                     const product = item.productId || {};
//                     const itemTotal = (product.price || 0) * item.quantity;

//                     return (
//                         <div key={product._id || Math.random()} className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
//                             <div className="flex items-center">
//                                 <div className="relative">
//                                     <img
//                                         src={product.image || "https://via.placeholder.com/70"}
//                                         alt={product.name || "Product"}
//                                         className="w-16 h-16 object-cover rounded-md"
//                                     />
//                                     <span className="absolute -top-2 -right-2 bg-gray-200 text-gray-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                                         {item.quantity}
//                                     </span>
//                                 </div>
//                                 <div className="ml-4">
//                                     <h4 className="font-medium text-gray-800 text-sm">
//                                         {product.name || 'Unknown Product'}
//                                     </h4>
//                                     <p className="text-gray-500 text-xs">₹{product.price || 0} each</p>
//                                 </div>
//                             </div>
//                             <span className="font-medium">₹{itemTotal}</span>
//                         </div>
//                     );
//                 })}
//             </div>

//             <div className="border-t border-gray-200 pt-4 space-y-3">
//                 <div className="flex justify-between text-gray-600">
//                     <span>Subtotal</span>
//                     <span>₹{subtotal.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                     <span>Shipping</span>
//                     <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                     <span>Tax (5%)</span>
//                     <span>₹{tax.toLocaleString()}</span>
//                 </div>
//                 <div className="border-t border-dashed pt-3 mt-2 flex justify-between font-bold text-lg text-gray-800">
//                     <span>Total</span>
//                     <span>₹{finalTotal.toLocaleString()}</span>
//                 </div>
//             </div>

//             <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
//                 <FaLock className="mr-2 text-green-600" /> Your payment information is secure
//             </div>
//         </div>
//     );

//     if (cartItems.length === 0) {
//         return (
//             <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
//                 <div className="text-center">
//                     <div className="text-gray-400 text-6xl mb-4">
//                         <FaShippingFast />
//                     </div>
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
//                     <p className="text-gray-600 mb-6">Add some products to your cart to checkout</p>
//                     <Link to="/home" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg inline-block transition-colors">
//                         Continue Shopping
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
//             <div className="max-w-6xl mx-auto">
//                 {/* Checkout Header */}
//                 <div className="text-center mb-8">
//                     <h2 className="text-3xl font-bold text-gray-800">Checkout</h2>
//                     <p className="text-gray-500 mt-2">Complete your purchase securely</p>

//                     {/* Progress Steps */}
//                     <div className="flex justify-center items-center mt-6">
//                         <div className={`flex items-center ${orderStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderStep >= 1 ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'} font-medium`}>
//                                 1
//                             </div>
//                             <span className="ml-2 hidden sm:inline">Shipping</span>
//                         </div>
//                         <div className={`w-16 sm:w-24 h-1 mx-2 ${orderStep >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                         <div className={`flex items-center ${orderStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderStep >= 2 ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'} font-medium`}>
//                                 2
//                             </div>
//                             <span className="ml-2 hidden sm:inline">Payment</span>
//                         </div>
//                         <div className={`w-16 sm:w-24 h-1 mx-2 bg-gray-300`}></div>
//                         <div className="flex items-center text-gray-400">
//                             <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-500 font-medium">
//                                 3
//                             </div>
//                             <span className="ml-2 hidden sm:inline">Confirmation</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     <div className="lg:col-span-2">
//                         {orderStep === 1 ? renderShippingStep() : renderPaymentStep()}
//                     </div>
//                     <div className="lg:col-span-1">
//                         {renderOrderSummary()}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Checkout;
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FaArrowLeft,
    FaCreditCard,
    FaMoneyBillWave,
    FaShippingFast,
    FaLock,
    FaRegCheckCircle,
    FaCcVisa,
    FaCcMastercard,
    FaCcAmex,
    FaCcPaypal
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { loadRazorpayScript } from '../helpers/razorPayment'; // Assuming this helper exists
import axios from 'axios';
import SummaryApi from '../common/index';

const Checkout = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const totalPrice = useSelector((state) => state.cart.totalPrice);
    const user = useSelector((state) => state.user.userDetails);
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        phone: user?.phone || '',
    });

    const [paymentMethod, setPaymentMethod] = useState('');
    const [errors, setErrors] = useState({});
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderStep, setOrderStep] = useState(1); // 1: Shipping, 2: Payment

    // Calculate totals
    const subtotal = totalPrice || 0;
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const finalTotal = subtotal + shipping + tax;

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);

        // Redirect if cart is empty
        if (cartItems.length === 0) {
            toast.info("Your cart is empty");
            setTimeout(() => navigate('/cart'), 1000);
        }
    }, [cartItems.length, navigate]);

    const validateShippingForm = () => {
        const newErrors = {};
        if (!shippingAddress.name) newErrors.name = "Name is required";
        if (!shippingAddress.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) newErrors.email = "Email is invalid";
        if (!shippingAddress.address) newErrors.address = "Address is required";
        if (!shippingAddress.city) newErrors.city = "City is required";
        if (!shippingAddress.state) newErrors.state = "State is required";
        if (!shippingAddress.postalCode) newErrors.postalCode = "Postal code is required";
        if (!shippingAddress.phone) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(shippingAddress.phone.replace(/\D/g, '')))
            newErrors.phone = "Please enter a valid 10-digit phone number";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        if (errors.paymentMethod) {
            setErrors({
                ...errors,
                paymentMethod: null
            });
        }
    };

    const handleContinueToPayment = () => {
        if (validateShippingForm()) {
            setOrderStep(2);
            window.scrollTo(0, 0);
        }
    };

    const handleBackToShipping = () => {
        setOrderStep(1);
        window.scrollTo(0, 0);
    };

    const handlePlaceOrder = async () => {
        if (!paymentMethod) {
            setErrors({
                ...errors,
                paymentMethod: "Please select a payment method"
            });
            return;
        }

        setIsPlacingOrder(true);

        if (paymentMethod === 'cash') {
            setIsPlacingOrder(true);
            try {
                const orderData = {
                    items: cartItems.map(item => ({
                        productId: item.productId, // Send the entire productId object
                        quantity: item.quantity,
                    })),
                    totalAmount: finalTotal,
                    shippingAddress,
                    paymentMethod: 'Cash on Delivery', // Explicitly set payment method
                    subtotal: subtotal,
                    shippingFee: shipping,
                    tax: tax,
                    userId: user?._id,
                };

                console.log("Order Data being sent:", JSON.stringify(orderData, null, 2));

                const response = await fetch(SummaryApi.create_cod_order.url, {
                    method: SummaryApi.create_cod_order.method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error creating COD order:', errorData);
                    toast.error('There was an error processing your order. Please try again.');
                } else {
                    const responseData = await response.json();
                    const backendOrderId = responseData.orderId;

                    toast.success(`Order placed successfully! Cash on Delivery selected. Order ID: ${backendOrderId}`);
                    navigate(`/order-confirmation?orderId=${backendOrderId}`);
                }
            } catch (error) {
                console.error('Error placing COD order:', error);
                toast.error('There was an error processing your order. Please try again.');
            } finally {
                setIsPlacingOrder(false);
            }

        } else if (paymentMethod === 'card') {
            // Integrate Razorpay for Card Payments
            const res = await loadRazorpayScript();
            if (!res) {
                toast.error("Razorpay failed to load.");
                setIsPlacingOrder(false);
                return;
            }

            try {
                const orderResponse = await axios.post("http://localhost:8080/api/payment/create-order", {
                    amount: finalTotal * 100 // Amount in paise
                });

                const { id: order_id, amount, currency } = orderResponse.data;

                const options = {
                    key: "rzp_test_nMCrdCBZT6Cxwn", // Replace with your actual Key ID from .env
                    amount: amount,
                    currency: currency,
                    name: "Shop With Us",
                    description: "Secure Payment",
                    order_id: order_id,
                    handler: function (response) {
                        toast.success("Payment successful!");
                        console.log("Payment ID:", response.razorpay_payment_id);
                        console.log("Order ID:", response.razorpay_order_id);
                        console.log("Signature:", response.razorpay_signature);
                        navigate(`/order-confirmation?razorpay_order_id=${response.razorpay_order_id}`); // Redirect to order confirmation page with razorpay_order_id
                    },
                    prefill: {
                        name: shippingAddress.name,
                        email: shippingAddress.email,
                        contact: shippingAddress.phone,
                    },
                    notes: {
                        shipping_address: shippingAddress.address + ', ' + shippingAddress.city + ', ' + shippingAddress.state + ' ' + shippingAddress.postalCode,
                    },
                    theme: {
                        color: "#3399cc",
                    },
                    modal: {
                        ondismiss: function() {
                            toast.error('Payment cancelled.');
                            setIsPlacingOrder(false);
                        }
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            } catch (error) {
                toast.error("Payment failed. Please try again.");
                console.error("Payment error:", error);
                setIsPlacingOrder(false);
            }
        }
    };

    const renderShippingStep = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 md:p-8"
        >
            <div className="flex items-center mb-6">
                <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">1</div>
                <h3 className="text-xl font-bold text-gray-800 ml-3 flex items-center">
                    <FaShippingFast className="mr-2" /> Shipping Information
                </h3>
            </div>

            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Full Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={shippingAddress.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={shippingAddress.email}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-2">Street Address *</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street, Apt 4B"
                        className={`w-full p-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    <div>
                        <label htmlFor="city" className="block text-gray-700 text-sm font-medium mb-2">City *</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={shippingAddress.city}
                            onChange={handleInputChange}
                            placeholder="New York"
                            className={`w-full p-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-gray-700 text-sm font-medium mb-2">State *</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={shippingAddress.state}
                            onChange={handleInputChange}
                            placeholder="NY"
                            className={`w-full p-3 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        />
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label htmlFor="postalCode" className="block text-gray-700 text-sm font-medium mb-2">Postal Code *</label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={shippingAddress.postalCode}
                            onChange={handleInputChange}
                            placeholder="10001"
                            className={`w-full p-3 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        />
                        {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">Phone Number *</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                        className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <Link to="/cart" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                        <FaArrowLeft className="mr-2" /> Back to Cart
                    </Link>
                    <button
                        onClick={handleContinueToPayment}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-all"
                    >
                        Continue to Payment <FaCreditCard className="ml-2" />
                    </button>
                </div>
            </div>
        </motion.div>
    );

    const renderPaymentStep = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 md:p-8"
        >
            <div className="flex items-center mb-6">
                <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">2</div>
                <h3 className="text-xl font-bold text-gray-800 ml-3 flex items-center">
                    <FaCreditCard className="mr-2" /> Payment Method
                </h3>
            </div>

            {/* Payment Options */}
            <div className="space-y-4">
                <div className="mb-6">
                    <h4 className="text-gray-700 font-medium mb-3">Select a payment method</h4>

                    <div className={`border ${errors.paymentMethod ? 'border-red-500' : 'border-gray-200'} rounded-lg p-1`}>
                        <label
                            htmlFor="card"
                            className={`flex items-center p-4 cursor-pointer rounded-md ${paymentMethod === 'card' ? 'bg-blue-50 border border-blue-300' : 'hover:bg-gray-50'}`}
                        >
                            <input
                                type="radio"
                                id="card"
                                name="paymentMethod"
                                value="card"
                                className="form-radio h-5 w-5 text-blue-600"
                                onChange={handlePaymentMethodChange}
                                checked={paymentMethod === 'card'}
                            />
                            <div className="ml-3">
                                <span className="font-medium text-gray-800 flex items-center">
                                    <FaCreditCard className="mr-2 text-blue-600" /> Credit/Debit Card
                                </span>
                                <span className="text-sm text-gray-500 mt-1 block">Pay securely with your card</span>
                            </div>
                            <div className="ml-auto flex items-center space-x-2">
                                <FaCcVisa size={24} className="text-blue-700" />
                                <FaCcMastercard size={24} className="text-red-500" />
                                <FaCcAmex size={24} className="text-blue-500" />
                                <FaCcPaypal size={24} className="text-blue-400" />
                            </div>
                        </label>

                        <label
                            htmlFor="cash"
                            className={`flex items-center p-4 cursor-pointer rounded-md mt-2 ${paymentMethod === 'cash' ? 'bg-green-50 border border-green-300' : 'hover:bg-gray-50'}`}
                        >
                            <input
                                type="radio"
                                id="cash"
                                name="paymentMethod"
                                value="cash"
                                className="form-radio h-5 w-5 text-green-600"
                                onChange={handlePaymentMethodChange}
                                checked={paymentMethod === 'cash'}
                            />
                            <div className="ml-3">
                                <span className="font-medium text-gray-800 flex items-center">
                                    <FaMoneyBillWave className="mr-2 text-green-600" /> Cash on Delivery
                                </span>
                                <span className="text-sm text-gray-500 mt-1 block">Pay when you receive your order</span>
                            </div>
                        </label>
                    </div>

                    {errors.paymentMethod && (
                        <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>
                    )}

                    {paymentMethod === 'card' && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm text-gray-700 flex items-center">
                                <FaLock className="mr-2 text-blue-600" />
                                You will be redirected to a secure payment gateway to complete your purchase safely.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={handleBackToShipping}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Shipping
                    </button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder}
                        className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-all ${isPlacingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isPlacingOrder ? (
                            <>
                                <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                Place Order <FaRegCheckCircle className="ml-2" />
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );

    const renderOrderSummary = () => (
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 sticky top-4">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
            <div className="max-h-64 overflow-auto mb-4 pr-2">
                {cartItems.map((item) => {
                    const product = item.productId || {};
                    const itemTotal = (product.price || 0) * item.quantity;

                    return (
                        <div key={product._id || Math.random()} className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                            <div className="flex items-center">
                                <div className="relative">
                                    <img
                                        src={product.image || "https://via.placeholder.com/70"}
                                        alt={product.name || "Product"}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <span className="absolute -top-2 -right-2 bg-gray-200 text-gray-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-medium text-gray-800 text-sm">
                                        {product.name || 'Unknown Product'}
                                    </h4>
                                    <p className="text-gray-500 text-xs">₹{product.price || 0} each</p>
                                </div>
                            </div>
                            <span className="font-medium">₹{itemTotal}</span>
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-dashed pt-3 mt-2 flex justify-between font-bold text-lg text-gray-800">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                <FaLock className="mr-2 text-green-600" /> Your payment information is secure
            </div>
        </div>
    );

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">
                        <FaShippingFast />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some products to your cart to checkout</p>
                    <Link to="/home" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg inline-block transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Checkout Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Checkout</h2>
                    <p className="text-gray-500 mt-2">Complete your purchase securely</p>

                    {/* Progress Steps */}
                    <div className="flex justify-center items-center mt-6">
                        <div className={`flex items-center ${orderStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderStep >= 1 ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'} font-medium`}>
                                1
                            </div>
                            <span className="ml-2 hidden sm:inline">Shipping</span>
                        </div>
                        <div className={`w-16 sm:w-24 h-1 mx-2 ${orderStep >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`flex items-center ${orderStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderStep >= 2 ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'} font-medium`}>
                                2
                            </div>
                            <span className="ml-2 hidden sm:inline">Payment</span>
                        </div>
                        <div className={`w-16 sm:w-24 h-1 mx-2 bg-gray-300`}></div>
                        <div className="flex items-center text-gray-400">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-500 font-medium">
                                3
                            </div>
                            <span className="ml-2 hidden sm:inline">Confirmation</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {orderStep === 1 ? renderShippingStep() : renderPaymentStep()}
                    </div>
                    <div className="lg:col-span-1">
                        {renderOrderSummary()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;