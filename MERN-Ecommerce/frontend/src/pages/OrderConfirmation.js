// import React from "react";
// import { useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";

// const OrderConfirmation = () => {
//   const user = useSelector((state) => state.user.user); // Assuming user info is here
//   const cartItems = useSelector((state) => state.cart.items);
//   const total = useSelector((state) => state.cart.totalPrice);
//   const location = useLocation();

//   // Assuming orderId is passed via navigate('/order-confirmation', { state: { orderId: "123" } });
//   const { orderId } = location.state || {};

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white shadow-md rounded-2xl p-6">
//         <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Successful!</h2>
//         <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>

//         <div className="mb-6">
//           <h3 className="text-xl font-semibold mb-2">📦 Order ID:</h3>
//           <p className="text-gray-800">{orderId || "N/A"}</p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <h3 className="text-xl font-semibold mb-2">👤 Customer Details</h3>
//             <p><strong>Name:</strong> {user?.name}</p>
//             <p><strong>Email:</strong> {user?.email}</p>
//             <p><strong>Phone:</strong> {user?.phone}</p>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold mb-2">💳 Payment Details</h3>
//             <p><strong>Payment Status:</strong> Paid</p>
//             <p><strong>Payment Mode:</strong> Razorpay</p>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-xl font-semibold mb-4">🛍️ Order Summary</h3>
//           <div className="space-y-4">
//             {cartItems.map((item) => (
//               <div key={item._id} className="flex justify-between border-b pb-2">
//                 <span>{item.name} x {item.quantity}</span>
//                 <span>₹{item.price * item.quantity}</span>
//               </div>
//             ))}
//             <div className="flex justify-between font-bold text-lg pt-4">
//               <span>Total:</span>
//               <span>₹{total}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmation;
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import SummaryApi from '../common/index'; // Assuming you have this

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('razorpay_order_id');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setError("Order ID not found.");
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SummaryApi.get_order_details(orderId).url, {
        method: SummaryApi.get_order_details(orderId).method,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrderData(data.data); // Assuming your backend returns the order data in a 'data' field
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto mt-10 p-8 bg-white shadow-lg rounded-md">Loading order details...</div>;
  }

  if (error) {
    return <div className="container mx-auto mt-10 p-8 bg-white shadow-lg rounded-md">Error: {error}</div>;
  }

  if (!orderData) {
    return <div className="container mx-auto mt-10 p-8 bg-white shadow-lg rounded-md">No order details found.</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-8 bg-white shadow-lg rounded-md">
      <div className="flex flex-col items-center justify-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Order Successful!</h2>
        <p className="text-gray-600 mb-4">
          Thank you for your order. It has been placed successfully.
        </p>
        <p className="text-gray-600 mb-4">
          Your Order ID is: <span className="font-semibold">{orderData._id || orderId}</span>
        </p>

        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Order Summary</h3>
        {orderData.items && orderData.items.map(item => (
          <div key={item._id} className="flex justify-between w-full max-w-md mb-2">
            <span className="text-gray-600">{item.name} x {item.quantity}</span>
            <span className="text-gray-700">${item.price * item.quantity}</span>
          </div>
        ))}

        <div className="border-t border-gray-300 pt-4 mt-4 w-full max-w-md">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 font-semibold">Subtotal:</span>
            <span className="text-gray-700">${orderData.subtotal}</span> {/* Assuming this field exists */}
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 font-semibold">Shipping:</span>
            <span className="text-gray-700">${orderData.shippingFee || 0}</span> {/* Assuming this field exists */}
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>${orderData.totalAmount}</span> {/* Assuming this field exists */}
          </div>
        </div>

        <p className="text-gray-600 mt-6 mb-4">
          You will receive an email confirmation with further details shortly.
        </p>
        <Link to="/orders" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-colors duration-300">
          View Order History
        </Link>
        <Link to="/" className="mt-4 text-red-600 hover:text-red-700 hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
