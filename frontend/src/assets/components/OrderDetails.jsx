import React, { useEffect } from "react";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  orderClearErrors,
  orderDetailsError,
  orderDetailsReq,
  orderDetailsSuccess,
} from "../../redux/orderSlice";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";
import MetaData from "./MetaData";
import { Stack, Typography } from "@mui/material";

const OrderDetails = () => {
  const { error, loading, order } = useSelector((state) => state.orderSlice);
  const dispatch = useDispatch();
  const { id } = useParams();
  // order id = 6603d36faeea7760bca82d0d
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

  useEffect(() => {
    if (error) {
      toast.error(error?.response?.data?.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(orderClearErrors());
    }

    getOrderDetails();
  }, [dispatch, error]);
  console.log(order);
  return (
    <>
      {loading ? <Loader /> : ""}
      <MetaData title={"Order Details"} />
      <div className="confirmOrder">
        {/* <CheckoutSteps activeSteps={1} /> */}
        <div className="container">
          <Stack className="confirmOrderPage" flexDirection={"row"}>
            <div>
              <div className="confirmShippingArea">
                <Typography variant="h4">Order #{order?._id}</Typography>
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
                      <span>{`${order?.shippingInfo.address}, ${order?.shippingInfo.city}, ${order?.shippingInfo.state}, ${order?.shippingInfo.pincode}, ${order?.shippingInfo.country}`}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="confirmCartItem">
                <Typography variant="h6">Payment:</Typography>
                <div>
                  <p
                    className={
                      order?.paymentInfo.status === "succeeded"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {order?.paymentInfo.status === "succeeded"
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
                        order?.paymentInfo.status === "Delivered"
                          ? "greenColor"
                          : "redColor"
                      }
                    >
                      {order?.orderStatus}
                    </p>
                  </div>
                  <div className="orderDetailsCartItemsContainer">
                  </div>
                </div>
                <div className="confirmCartItem">
                  {order?.orderedItems?.map((item) => (
                    <div
                      key={item.product}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <img src={item.image.url} alt="Product" />
                      <div>
                        <Link to={`/product/${item.product}`}>
                          {item?.name}{" "}
                        </Link>
                        <span>
                          ({item.quantity} X ₹{item.price} ={" "}
                          <b>₹{item.price * item.quantity}</b>)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* <div>
              <div className="oderSummary">
                <Typography variant="h5">Order Summary</Typography>
                <div>
                  <div>
                    <p>
                      Subtotal: <span>₹{subtotal}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Shipping Charges: <span>₹{shippingCharges}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      GST: <span>₹{tax}</span>
                    </p>
                  </div>
                </div>
                <div className="orderSummaryTotal">
                  <p>
                    <b>Total:</b>
                    <span> ₹{totalPrice}</span>
                  </p>
                </div>
                <Button variant="contained" onClick={proceedToPayment}>
                  Procced To Payment
                </Button>
              </div>
            </div> */}
          </Stack>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
