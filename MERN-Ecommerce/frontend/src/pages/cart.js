// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCart, updateQuantity, removeFromCart } from "../store/cartSlice";
// import { MdRemove, MdAdd } from "react-icons/md";
// import { toast } from "react-toastify";
// import { Link, useNavigate} from "react-router-dom";
// import { loadRazorpayScript } from "../helpers/razorPayment";
// import axios from 'axios';

// const Cart = () => {
//   const dispatch = useDispatch();
//   const { items: cartItems, totalPrice, loading } = useSelector((state) => state.cart);
//   const user = useSelector((state) => state.user.userDetails);
//   const navigate = useNavigate();
  

//   useEffect(() => {
//     if (user?._id) {
//       dispatch(fetchCart(user._id));
//     }
//   }, [dispatch, user]);

//   const handleIncrease = (item) => {
//     const userId = user?._id;
//     if (!userId) {
//       console.error("No userId found, user is:", user);
//       return;
//     }

//     const productId = item?.productId?._id || item?.productId;

//     const payload = {
//       userId,
//       productId,
//       quantity: item.quantity + 1,
//     };

    
//     dispatch(updateQuantity(payload));
//   };

//   const handleDecrease = (item) => {
//     const newQuantity = item.quantity - 1;

//     if (newQuantity > 0) {
//       dispatch(updateQuantity({
//         userId: user._id,
//         productId: item.productId._id || item.productId, // depends on how it's structured
//         quantity: newQuantity,
//       }));
//     } else {
      
//       dispatch(removeFromCart({
//         userId: user._id,
//         productId: item.productId._id || item.productId,
//       }));
//     }
//   };

//   const handleRemove = (item) => {
//     dispatch(removeFromCart({
//       userId: user._id,
//       productId: item.productId._id || item.productId
//     }));
//   };

//   const handlePayment = async () => {
//     const res = await loadRazorpayScript();
//     if (!res) {
//       toast.error("Razorpayfaile d to load.");
//       return;
//     }
  
//     try {
//       const orderResponse = await axios.post("http://localhost:8080/api/payment/create-order", {
        
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount: totalPrice * 100 }), 
//       });
  
//       const { order } = await orderResponse.json();
  
//       const options = {
//         key: "aY8a3YKTCc57bxAypZWoWnDZ", 
//         amount: order.amount,
//         currency: order.currency,
//         name: "Shop With Us",
//         description: "",
//         order_id: order.id,
//         handler: function (response) {
//           toast.success("Payment successful!");
//           console.log("Payment ID:", response.razorpay_payment_id);
//           console.log("Order ID:", response.razorpay_order_id);
//           console.log("Signature:", response.razorpay_signature);
//         },
//         prefill: {
//           name: user?.name || "",
//           email: user?.email || "",
//           contact: user?.phone || "",
//         },
//         notes: {
//           address: "Shop With Us HQ",
//         },
//         theme: {
//           color: "#F37254",
//         },
//       };
  
//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();
//     } catch (error) {
//       toast.error("Payment failed. Try again.");
//       console.error("Payment error:", error);
//     }
//   };

  
//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold text-center mb-6">Shopping Cart</h2>

//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : cartItems.length === 0 ? (
//         <div className="text-center">
//           <p>Your cart is empty.</p>
//           <Link to="/home" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full inline-block mt-4">
//             Continue Shopping
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             {cartItems.map((item, index) => {
//               const product = item.productId || {};
//               const productId = product._id || item.productId;

//               return (
//                 <div
//                   key={productId || index}
//                   className="flex justify-between items-center border p-4 rounded-lg"
//                 >
//                   {/* Product Image & Details */}
//                   <div className="flex items-center">
//                     <img
//                       src={product.image || "https://via.placeholder.com/150"}
//                       alt={product.name || "Product"}
//                       className="w-20 h-20 object-cover rounded-md"
//                     />
//                     <div className="ml-4">
//                       <h3 className="text-lg font-semibold">{product.name || "Unknown Product"}</h3>
//                       <p className="text-gray-600">₹{product.price || 0}</p>
//                     </div>
//                   </div>

//                   {/* Quantity Controls */}
//                   <div className="flex items-center gap-4">
//                     <button
//                       onClick={() => handleDecrease(item)}
//                       className="bg-gray-200 p-2 rounded-full"
//                       // disabled={item.quantity <= 1}
//                     >
//                       <MdRemove />
//                     </button>
//                     <span className="text-lg">{item.quantity}</span>
//                     <button
//                       onClick={() => handleIncrease(item)}
//                       className="bg-gray-200 p-2 rounded-full"
//                     >
//                       <MdAdd />
//                     </button>
//                   </div>

//                   {/* Price Calculation */}
//                   <div className="text-lg font-semibold">
//                     ₹{(product.price || 0) * item.quantity}
//                   </div>

//                   {/* Remove Button */}
//                   <button
//                     onClick={() => handleRemove(item)}
//                     className="bg-red-500 text-white p-2 rounded-full"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//           <div className="border p-4 rounded-lg">
//             <h3 className="text-xl font-semibold mb-4">Checkout</h3>
//             <div className="space-y-2">
//               {cartItems.map((item, index) => {
//                 const product = item.productId || {};
//                 return (
//                   <div key={product._id || index} className="flex justify-between items-center">
//                     <span>{product.name || "Unknown Product"} ({item.quantity})</span>
//                     <span>₹{(product.price || 0) * item.quantity}</span>
//                   </div>
//                 );
//               })}
//               <div className="border-t pt-2 mt-4 flex justify-between font-bold text-lg">
//                 <span>Total:</span>
//                 <span>₹{totalPrice}</span>
//               </div>
//               <button
//                   onClick={handlePayment}
//                     className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full w-full mt-4"
//               >
//                             Pay Now
//                </button>
//               <Link to="/home" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full w-full mt-2 block text-center">
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateQuantity, removeFromCart } from "../store/cartSlice";
import { 
  MdRemove, 
  MdAdd, 
  MdDeleteOutline, 
  MdShoppingCart, 
  MdArrowBack,
  MdSecurity,
  MdPayment
} from "react-icons/md";
import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcPaypal, 
  FaCcAmex,
  FaLock
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const dispatch = useDispatch();
  const { items: cartItems, totalPrice, loading } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.userDetails);
  const navigate = useNavigate();
  const [isCheckoutHovered, setIsCheckoutHovered] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user]);

  const handleIncrease = (item) => {
    const userId = user?._id;
    if (!userId) {
      toast.error("Please log in to update your cart");
      return;
    }

    const productId = item?.productId?._id || item?.productId;
    const payload = {
      userId,
      productId,
      quantity: item.quantity + 1,
    };

    dispatch(updateQuantity(payload));
    toast.success("Item quantity updated");
  };

  const handleDecrease = (item) => {
    const newQuantity = item.quantity - 1;

    if (newQuantity > 0) {
      dispatch(updateQuantity({
        userId: user._id,
        productId: item.productId._id || item.productId,
        quantity: newQuantity,
      }));
      toast.success("Item quantity updated");
    } else {
      handleRemove(item);
    }
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart({
      userId: user._id,
      productId: item.productId._id || item.productId
    }));
    toast.info("Item removed from cart");
  };

  // Add a delay before navigating to checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    
    setIsCheckoutHovered(true);
    setTimeout(() => {
      navigate('/checkout');
    }, 300);
  };

  const renderEmptyCart = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
      <MdShoppingCart className="text-gray-300 text-8xl mb-6" />
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h3>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Looks like you haven't added any products to your cart yet.
        Browse our collection and find something you'll love!
      </p>
      <Link to="/home" className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
        <MdArrowBack className="mr-2" />
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h2>
        <p className="text-gray-500 mt-2">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cartItems.map((item, index) => {
                const product = item.productId || {};
                const productId = product._id || item.productId;
                const itemTotal = (product.price || 0) * item.quantity;

                return (
                  <motion.div
                    key={productId || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {/* Product Image & Details */}
                    <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0 w-full md:w-auto">
                      <div className="relative">
                        <img
                          src={product.image || "https://via.placeholder.com/150"}
                          alt={product.name || "Product"}
                          className="w-24 h-24 object-cover rounded-lg shadow-sm"
                        />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                        <h3 className="text-lg font-bold text-gray-800">{product.name || "Unknown Product"}</h3>
                        <p className="text-gray-500">Unit Price: ₹{product.price || 0}</p>
                      </div>
                    </div>

                    {/* Controls and Price */}
                    <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto mt-4 md:mt-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="bg-gray-100 hover:bg-gray-200 px-3 py-2 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <MdRemove />
                        </button>
                        <span className="px-4 py-2 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="bg-gray-100 hover:bg-gray-200 px-3 py-2 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <MdAdd />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-lg font-bold text-gray-800">
                        ₹{itemTotal.toLocaleString()}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="Remove item"
                      >
                        <MdDeleteOutline size={24} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Order Summary</h3>
              <div className="space-y-3 max-h-80 overflow-auto pr-2">
                {cartItems.map((item, index) => {
                  const product = item.productId || {};
                  const itemTotal = (product.price || 0) * item.quantity;
                  
                  return (
                    <div key={product._id || index} className="flex justify-between items-center text-gray-600">
                      <div className="flex items-center">
                        <span className="font-medium truncate max-w-[150px]">
                          {product.name || "Unknown Product"}
                        </span>
                        <span className="ml-2 text-gray-400">×{item.quantity}</span>
                      </div>
                      <span>₹{itemTotal.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{totalPrice > 500 ? "Free" : "₹50"}</span>
                </div>
                <div className="border-t border-dashed my-4 pt-4 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>₹{(totalPrice > 500 ? totalPrice : totalPrice + 50).toLocaleString()}</span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className={`bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg w-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center ${isCheckoutHovered ? 'bg-green-700' : ''}`}
                >
                  Proceed to Checkout
                </motion.button>
                
                <Link 
                  to="/home" 
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg w-full mt-3 block text-center transition-colors duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-6 text-gray-500">
                  <FaCcVisa size={28} className="text-blue-700" />
                  <FaCcMastercard size={28} className="text-red-500" />
                  <FaCcPaypal size={28} className="text-blue-800" />
                  <FaCcAmex size={28} className="text-blue-500" />
                </div>
                <div className="flex items-center justify-center mt-4 text-gray-500 text-sm">
                  <FaLock className="mr-1" />
                  <span>Secure Payment</span>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  All transactions are secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;