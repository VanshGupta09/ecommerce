import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config.js";
import {
  autoLoginSuccess,
  autoLoginUser,
  errorAutoLogin,
} from "./redux/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./assets/components/Loader.jsx";
import { ToastContainer, toast } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const Home = lazy(() => import("./assets/pages/Home.jsx"));
const Footer = lazy(() => import("./assets/components/Footer.jsx"));
const Header = lazy(() => import("./assets/components/Header.jsx"));
const ProductDetails = lazy(() =>
  import("./assets/components/ProductDetails.jsx")
);
const Products = lazy(() => import("./assets/pages/Products.jsx"));
const LoginSignUp = lazy(() => import("./assets/components/LoginSignUp.jsx"));
const Profile = lazy(() => import("./assets/components/Profile.jsx"));
const UpdateProfile = lazy(() =>
  import("./assets/components/UpdateProfile.jsx")
);
const UpdatePassword = lazy(() =>
  import("./assets/components/UpdatePassword.jsx")
);
const ForgotPassword = lazy(() =>
  import("./assets/components/ForgotPassword.jsx")
);
const ResetPassword = lazy(() =>
  import("./assets/components/ResetPassword.jsx")
);
const Cart = lazy(() => import("./assets/components/Cart.jsx"));
const Shipping = lazy(() => import("./assets/components/Shipping.jsx"));
const ConfirmOrder = lazy(() => import("./assets/components/ConfirmOrder.jsx"));
const Payment = lazy(() => import("./assets/components/Payment.jsx"));
const OrderSuccess = lazy(() => import("./assets/components/OrderSuccess.jsx"));
const Orders = lazy(() => import("./assets/components/Orders.jsx"));
const OrderDetails = lazy(() => import("./assets/components/OrderDetails.jsx"));
const Dashboard = lazy(() => import("./assets/components/Dashboard.jsx"));
const ProductList = lazy(() => import("./assets/components/ProductList.jsx"));
const NewProduct = lazy(() => import("./assets/components/NewProduct.jsx"));
const UpdateProduct = lazy(() => import("./assets/components/UpdateProduct.jsx"));
const OrderList = lazy(() => import("./assets/components/OrderList.jsx"));
const UpdateOrder = lazy(() => import("./assets/components/UpdateOrder.jsx"));
const UsersList = lazy(() => import("./assets/components/UsersList.jsx"));
const UpdateUser = lazy(() => import("./assets/components/UpdateUser.jsx"));
const ProductReviews = lazy(() => import("./assets/components/ProductReviews.jsx"));

const App = () => {
  const dispatch = useDispatch();
  const { loading, auth, userData } = useSelector((state) => state.userSlice);
  const [stripeApiKey, setStripeApiKey] = useState("");

  // User autologin
  const autoLogin = async (e) => {
    try {
      dispatch(autoLoginUser());
      const res = await axios.get(`${BASE_URL}/api/v1/me`, {
        withCredentials: true,
      });
      console.log(res);

      if (res?.data?.success) {
        dispatch(autoLoginSuccess(res?.data?.data?.user));
      }
    } catch (err) {
      console.log(err);
      dispatch(errorAutoLogin(err?.response?.data?.message));
    }
  };

  // Stripe Api Key
  const getSripeApiKey = async () => {
    const res = await axios.get(`${BASE_URL}/api/v1/stripeapikey`, {
      withCredentials: true,
    });
    if (res?.data?.success) {
      setStripeApiKey(res.data.stripeApiKey);
    }
  };

  useEffect(() => {
    autoLogin();
    getSripeApiKey();
  }, []);

  window.addEventListener("contextmenu",(e)=>e.preventDefault())

  return (
    <>
      {loading ? <Loader /> : ""}
      <BrowserRouter>
        <Suspense>
          <ToastContainer />
          <Header />
          <Routes>
            {auth ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/*" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/me/update" element={<UpdateProfile />} />
                <Route path="/password/update" element={<UpdatePassword />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/products/:keyword" element={<Products />} />
                <Route path="/products" element={<Products />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/success" element={<OrderSuccess />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/confirm" element={<ConfirmOrder />} />
                <Route path="/order/:id" element={<OrderDetails />} />
                {userData.role === "admin" && (
                  <>
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/products" element={<ProductList />} />
                    <Route path="/admin/product" element={<NewProduct />} />
                    <Route path="/admin/orders" element={<OrderList />} />
                    <Route path="/admin/order/:id" element={<UpdateOrder />} />
                    <Route path="/admin/users" element={<UsersList />} />
                    <Route path="/admin/user/:id" element={<UpdateUser />} />
                    <Route path="/admin/reviews" element={<ProductReviews />} />
                    <Route
                      path="/admin/product/:id"
                      element={<UpdateProduct />}
                    />
                  </>
                )}
                {stripeApiKey && (
                  <Route
                    path="/process/payment"
                    element={
                      <>
                        <Elements stripe={loadStripe(stripeApiKey)}>
                          <Payment />
                        </Elements>
                      </>
                    }
                  />
                )}
              </>
            ) : (
              <>
                <Route path="/login" element={<LoginSignUp />} />
                <Route path="/password/forgot" element={<ForgotPassword />} />
                <Route
                  path="/password/reset/:token"
                  element={<ResetPassword />}
                />
                <Route path="/*" element={<LoginSignUp />} />
              </>
            )}
          </Routes>
          <Footer />
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;
