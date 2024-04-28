import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "./MetaData.jsx";
import { Stack, Typography, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import axios from "axios";
import { BASE_URL } from "../../../config.js";
import {
  orderDetailsError,
  orderDetailsReq,
  orderDetailsSuccess,
  orderUpdateError,
  orderUpdateFail,
  orderUpdateReq,
  orderUpdateReset,
  orderUpdateSuccess,
} from "../../redux/orderSlice.js";
import { toast } from "react-toastify";
import Loader from "./Loader.jsx";

const UpdateOrder = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cartSlice);
  const { error, loading, order, isUpdated, allOrders } = useSelector(
    (state) => state.orderSlice
  );
  const { userData } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();

  //   const subtotal = cartItems.reduce(
  //     (acc, item) => acc + item.quantity * item.price,
  //     0
  //   );

  //   const shippingCharges = subtotal > 1000 ? 0 : 200;
  //   const tax = subtotal * 0.18;
  //   const totalPrice = subtotal + shippingCharges + tax;
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pincode}, ${shippingInfo.country}`;

  //   const proceedToPayment = () => {
  //     const data = { subtotal, shippingCharges, tax, totalPrice };

  //     sessionStorage.setItem("orderInfo", JSON.stringify(data));
  //     navigate("/process/payment");
  //   };

  const processOrder = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("status", status);

    try {
      dispatch(orderUpdateReq());
      const res = await axios.patch(`${BASE_URL}/api/v1/admin/${id}`, myForm, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);

      if (res.data.success) {
        console.log(res.data);
        dispatch(orderUpdateSuccess(res.data));
      }
    } catch (error) {
      console.log(error);
      dispatch(orderUpdateFail(error.message));
    }
  };

  const getOrderDetails = async () => {
    try {
      dispatch(orderDetailsReq());
      const res = await axios.get(`${BASE_URL}/api/v1/order/${id}`, {
        withCredentials: true,
      });
      console.log(res);

      if (res?.data?.success) {
        dispatch(orderDetailsSuccess(res?.data?.data?.order));
      }
    } catch (err) {
      console.log(err);
      dispatch(orderDetailsError(err?.response?.data?.message));
    }
  };
  // add user in orderdetails
  useEffect(() => {
    getOrderDetails();
    if (error) {
      toast.error(error, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(orderUpdateError());
    }
    if (isUpdated) {
      toast.success("Order Updated Successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(orderUpdateReset());
    }
  }, [error, isUpdated, dispatch]);

  {
    console.log(order);
  }
  return (
    <>
      {loading ? <Loader /> : ""}
      <MetaData title={"Process Order"} />
      <div className="dashboard">
        <div className="container">
          <Sidebar />
          <div className="newProductContainer">
            <div className="confirmOrder">
              <div className="container">
                <Stack className="confirmOrderPage" flexDirection={"row"}>
                  <div>
                    <div className="confirmShippingArea">
                      <Typography variant="h4">Shipping Info</Typography>
                      <div className="confirmShippingAreaBox">
                        <div>
                          <p>
                            Name: <span>{order?.user?.name}</span>
                          </p>
                        </div>
                        <div>
                          <p>
                            Phone: <span>{order?.shippingInfo?.phoneNo}</span>
                          </p>
                        </div>
                        <div>
                          <p>
                            Address:{" "}
                            <span>{`${order?.shippingInfo?.country}, ${order?.shippingInfo?.state}, ${order?.shippingInfo?.city}, ${order?.shippingInfo?.address}, ${order?.shippingInfo?.pincode}`}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="confirmCartItem">
                      <Typography variant="h6">Payment:</Typography>
                      <div>
                        <p
                          className={
                            order?.paymentInfo?.status === "succeeded" || "Successed"
                              ? "greenColor"
                              : "redColor"
                          }
                        >
                          {order?.paymentInfo.status === "succeeded" || "Successed"
                            ? "PAID"
                            : "NOT PAID"}
                        </p>
                      </div>
                      <div>
                        <p>
                          Amount: <span>{order?.totalPrice}</span>
                        </p>
                      </div>
                      <div className="confirmCartItemContainer">
                        <div>
                          <Typography variant="h6">Order Status:</Typography>
                          <p
                            className={
                              order?.orderStatus === "Delivered"
                                ? "greenColor"
                                : "redColor"
                            }
                          >
                            {order?.orderStatus}
                          </p>
                        </div>
                        <div className="orderDetailsCartItemsContainer"></div>
                      </div>
                      <div className="confirmCartItem">
                        {order?.orderedItems?.map((item) => (
                          <div key={item.product}>
                            <img src={item.image.url} alt="Product" />
                            <Link to={`/product/${item.product}`}>
                              {item?.name}{" "}
                            </Link>
                            <span>
                              {item.quantity} X ₹{item.price} ={" "}
                              <b>₹{item.price * item.quantity}</b>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* <div className="confirmCartItem">
                      <Typography variant="h5">Your Cart Items:</Typography>
                      <div className="confirmCartItemContainer">
                        {cartItems?.map((item) => (
                          <div key={item.product}>
                            <img src={item.image} alt="Product" />
                            <Link to={`/product/${item.product}`}>
                              {item?.name}
                            </Link>
                            <span>
                              {item.quantity} X ₹{item.price} ={" "}
                              <b>₹{item.price * item.quantity}</b>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div> */}
                  </div>
                  <div style={{display:(order?.orderStatus)==="Delivered"?"none":"block",}}>
                    <form
                      className="createProductForm"
                      encType="multipart/form-data"
                      onSubmit={processOrder}
                    >
                      <Typography variant="h6" sx={{ textAlign: "center" }}>
                        Update Order Status
                      </Typography>
                      <div className="productCategory">
                        <AccountTreeIcon />
                        <select onChange={(e) => setStatus(e.target.value)}>
                          <option value="">Process Order</option>
                          {order?.orderStatus === "Processing" && (
                            <option value="Shipped">Shipped</option>
                          )}
                          {order?.orderStatus === "Shipped" && (
                            <option value="Delivered">Delivered</option>
                          )}
                        </select>
                      </div>
                      <Button
                        type="submit"
                        className="addProductButton"
                        variant="contained"
                        disabled={
                          loading ? true : false || status === "" ? true : false
                        }
                      >
                        Process
                      </Button>
                    </form>
                  </div>
                </Stack>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateOrder;
