import React from "react";
import { lazy } from "react";
import { useSelector } from "react-redux";
import MetaData from "./MetaData.jsx";
import { Stack, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const CheckoutSteps = lazy(() => import("./CheckoutSteps.jsx"));

const ConfirmOrder = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cartSlice);
  const { userData } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + shippingCharges + tax;
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pincode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = { subtotal, shippingCharges, tax, totalPrice };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/process/payment");
  };

  return (
    <>
      <div className="confirmOrder">
        <MetaData title={"Confirm Order"} />
        <CheckoutSteps activeSteps={1} />
        <div className="container">
          <Stack className="confirmOrderPage" flexDirection={"row"}>
            <div>
              <div className="confirmShippingArea">
                <Typography variant="h4">Shipping Info</Typography>
                <div className="confirmShippingAreaBox">
                  <div>
                    <p>
                      Name: <span>{userData?.name}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Phone: <span>{shippingInfo?.phoneNo}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Address: <span>{address}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="confirmCartItem">
                <Typography variant="h5">Your Cart Items:</Typography>
                <div className="confirmCartItemContainer">
                  {cartItems?.map((item) => (
                    <div key={item.product}>
                      <img src={item.image} alt="Product"/>
                      <Link to={`/product/${item.product}`}>{item?.name}</Link>
                      <span>
                        {item.quantity} X ₹{item.price} ={" "}
                        <b>₹{item.price * item.quantity}</b>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
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
            </div>
          </Stack>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
