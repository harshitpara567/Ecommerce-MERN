// import React from "react";
// import { Link } from "react-router-dom";
// import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 text-white py-8 mt-auto">
//       <div className="container mx-auto px-4">
//         {/* Top Section */}
//         <div className="flex flex-wrap justify-between items-center border-b border-gray-700 pb-6">
//           <div className="w-full md:w-1/3 text-center md:text-left">
//             <h2 className="text-2xl font-bold">ShopWithUs</h2>
//             <p className="text-gray-400 mt-2">Best online store for all your needs.</p>
//           </div>

//           {/* Newsletter */}
//           <div className="w-full md:w-1/3 text-center mt-4 md:mt-0">
//             <h3 className="text-lg font-semibold">Subscribe to our Newsletter</h3>
//             <form className="flex justify-center mt-2">
//               <input type="email" placeholder="Enter your email" className="border px-4 py-2 rounded-l-md text-black" />
//               <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-r-md">Subscribe</button>
//             </form>
//           </div>

//           {/* Social Media */}
//           <div className="w-full md:w-1/3 text-center md:text-right mt-4 md:mt-0">
//             <h3 className="text-lg font-semibold">Follow Us</h3>
//             <div className="flex justify-center md:justify-end gap-4 mt-2">
//               <Link to="#" className="text-gray-400 hover:text-white"><FaFacebookF size={20} /></Link>
//               <Link to="#" className="text-gray-400 hover:text-white"><FaTwitter size={20} /></Link>
//               <Link to="#" className="text-gray-400 hover:text-white"><FaInstagram size={20} /></Link>
//               <Link to="#" className="text-gray-400 hover:text-white"><FaYoutube size={20} /></Link>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="flex flex-wrap justify-between text-gray-400 text-sm pt-6">
//           <div>&copy; 2025 ShopWithUs. All rights reserved.</div>
//           <div>
//             <Link to="/privacy-policy" className="mr-4 hover:text-white">Privacy Policy</Link>
//             <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaMapMarkerAlt, FaPhone, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">ShopWithUs</h2>
            <p className="text-gray-300 leading-relaxed">Your trusted destination for quality products and exceptional shopping experiences. We're dedicated to bringing you the best.</p>
            <div className="flex space-x-4">
              <Link to="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-red-600 flex items-center justify-center transition-all duration-300">
                <FaFacebookF size={16} />
              </Link>
              <Link to="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-red-600 flex items-center justify-center transition-all duration-300">
                <FaTwitter size={16} />
              </Link>
              <Link to="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-red-600 flex items-center justify-center transition-all duration-300">
                <FaInstagram size={16} />
              </Link>
              <Link to="#" className="w-8 h-8 rounded-full bg-gray-700 hover:bg-red-600 flex items-center justify-center transition-all duration-300">
                <FaYoutube size={16} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-red-500">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Shop</Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Categories</Link>
              </li>
              <li>
                <Link to="/about-us" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info
          <div className="space-y-4">
            <h3 className="text-lg font-semibold relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-red-500">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Shopping Avenue, Retail District, City, Country</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-red-500 flex-shrink-0" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-red-500 flex-shrink-0" />
                <span className="text-gray-300">support@shopwithus.com</span>
              </li>
            </ul>
          </div> */}

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-red-500">Newsletter</h3>
            <p className="text-gray-300">Subscribe to receive updates on new products and special promotions.</p>
            <form className="mt-2 relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300" 
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 bottom-0 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-r-lg transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>


        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm pt-6">
          <div className="mb-4 md:mb-0">
            &copy; 2025 ShopWithUs. All rights reserved. Made with <FaHeart className="inline text-red-500 mx-1" /> for our customers.
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-300">Terms & Conditions</Link>
            <Link to="/faq" className="hover:text-white transition-colors duration-300">FAQ</Link>
            <Link to="/shipping" className="hover:text-white transition-colors duration-300">Shipping Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;