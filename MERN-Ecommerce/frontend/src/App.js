import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import common from './common/index';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails, clearUserDetails } from './store/userSlice'; 
import { fetchCart, clearCart } from './store/cartSlice';     

function App() {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);
  const location = useLocation();

  console.log("Current Path:", location.pathname);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); 

    if (userId && token) { 
      
      dispatch(fetchUserDetails(userId));
      dispatch(fetchCart(userId));
    } else {
      
      dispatch(clearUserDetails()); 
      dispatch(clearCart());       
    }
  }, [dispatch]);

  const hideHeader = ["/login", "/sign-up", "/"].includes(location.pathname);
  const hideFooter = ["/login","signup","/"].includes(location.pathname);

  return (
    <>
      <ToastContainer position="top-center" />
      {!hideHeader && <Header />}
      
      <main className="min-h-[calc(100vh-120px)] pt-16">
        <Outlet />
      </main>
      
      <Footer />
    </>
  );
}

export default App;