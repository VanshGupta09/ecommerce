import React, { useEffect, useRef, useState } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "./MetaData";
import { Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config";
import {
  createOrderReq,
  createOrderSuccess,
  orderClearErrors,
} from "../../redux/orderSlice";
import Loader from "./Loader";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { userData } = useSelector((state) => state.userSlice);
  const { shippingInfo, cartItems } = useSelector((state) => state.cartSlice);
  const { error } = useSelector((state) => state.orderSlice);
  const dispatch = useDispatch();
  const payBtn = useRef(null);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [submitBtn, setSubmitBtn] = useState(false);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderedItems: cartItems,
    itemPrice: orderInfo.subTotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitBtn(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/payment/process`,
        paymentData,
        config
      );
      console.log(res);

      if (res?.data?.success) {
        const client_secret = res.data.client_secret;

        if (!stripe || !elements) return;

        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: userData.name,
              email: userData.email,
              address: {
                line1: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                country: shippingInfo.country,
                postal_code: shippingInfo.pincode,
              },
            },
          },
        });
        console.log(result);
        if (result.error) {
          setSubmitBtn(false);
          toast.error(result.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          if (result.paymentIntent.status == "succeeded") {
            order.paymentInfo = {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
            };
            try {
              dispatch(createOrderReq());
              const { data } = await axios.post(
                `${BASE_URL}/api/v1/order/create`,
                order,
                config
              );
              if (data.success) {
                dispatch(createOrderSuccess(data));
              }
            } catch (error) {
              console.log(error.response.data.message);
              dispatch(createOrderSuccess(error.response.data.message));
            }
            toast.success("Payment Successfull", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            localStorage.clear("cartItems");
            localStorage.clear("shippingInfo");
            navigate("/success");
          } else {
            toast.error("Some error occured while processing your payment", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      setSubmitBtn(false);
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
    }
  };

  useEffect(() => {
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
      dispatch(orderClearErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      <div className="paymentPage">
        <div className="container">
          <MetaData title="Payment" />
          <CheckoutSteps activeSteps={2} />
          <form encType="multipart/form-data" onSubmit={submitHandler}>
            <Typography variant="h4">Card Info</Typography>
            <div>
              <CreditCardIcon />
              <CardNumberElement className="paymentInput" />
            </div>
            <div>
              <EventIcon />
              <CardExpiryElement className="paymentInput" />
            </div>
            <div>
              <VpnKeyIcon />
              <CardCvcElement className="paymentInput" />
            </div>
            <Button
              type="submit"
              className="PaymentFormBtn"
              variant="contained"
              ref={payBtn}
              disabled={submitBtn}
            >
              {`Pay ₹${orderInfo.totalPrice}`}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Payment;
