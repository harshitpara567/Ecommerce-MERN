// src/common/SummaryApi.js
const backendDomain = "https://ecommerce-mern-backend-fcbw.onrender.com"; // Make sure this matches your backend URL

const SummaryApi = {
  signUP: {
    url: `${backendDomain}/api/signup`,
    method: "POST",
  },
  signIn: {
    url: `${backendDomain}/api/signin`,
    method: "POST",
  },
  current_user: (userId) => ({
    url: `${backendDomain}/api/user-details/${userId}`,
    method: "GET",
  }),
  get_products: {
    url: `${backendDomain}/api/products`,
    method: "GET",
  },
  get_cart: (userId) => ({
    url: `${backendDomain}/api/cart/${userId}`,
    method: "GET",
  }),
  add_to_cart: {
    url: `${backendDomain}/api/cart/add`,
    method: "POST",
  },
  update_cart_item: {
    url: `${backendDomain}/api/cart/update`,
    method: "PUT",
  },
  remove_from_cart: (userId, productId) => ({
    url: `${backendDomain}/api/cart/remove/${userId}/${productId}`,
    method: "DELETE",
  }),
  clear_cart: (userId) => ({
    url: `${backendDomain}/api/cart/clear/${userId}`,
    method: "DELETE",
  }),
  // This is a function that returns the URL and method for a specific product ID.
  get_single_product: (productId) => ({
    url: `${backendDomain}/api/products/${productId}`,
    method: "GET",
  }),
  updateProfilePicture: (userId) => ({
    url: `${backendDomain}/api/user-details/${userId}/profile-picture`,
    method: "PUT",
  }),
  get_order_details: (orderId) => ({
    url: `${backendDomain}/api/orders/${orderId}`,
    method: "GET",
  }),
  create_cod_order: {
    url: `${backendDomain}/api/orders/cod`,
    method: "POST",
  },
};

export default SummaryApi; // Export SummaryApi as the default export
