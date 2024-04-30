import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PinDropIcon from "@mui/icons-material/PinDrop";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from "@mui/icons-material/Public";
import PhoneIcon from "@mui/icons-material/Phone";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import { Country, City, State } from "country-state-city";
import { toast } from "react-toastify";
import { Button, Typography } from "@mui/material";
import MetaData from "./MetaData";
import { lazy } from "react";
import { saveShippingInfo } from "../../redux/cartSlice.js";
import { useNavigate } from "react-router-dom";

const CheckoutSteps = lazy(() => import("./CheckoutSteps.jsx"));

const Shipping = () => {
  const { shippingInfo } = useSelector((state) => state.cartSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [address, setAddress] = useState(shippingInfo?.address);
  const [city, setCity] = useState(shippingInfo?.city);
  const [state, setState] = useState(shippingInfo?.state);
  const [country, setCountry] = useState(shippingInfo?.country);
  const [pincode, setPincode] = useState(shippingInfo?.pincode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo);

  const ShippingSubmit = (e) => {
    e.preventDefault();
    if (phoneNo.length > 10 || phoneNo.length < 10) {
      toast("Phone number should be 10 digit", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    dispatch(saveShippingInfo({address, city, state, country, pincode, phoneNo}));
    navigate("/order/confirm");
  };

  return (
    <>
      <MetaData title={"Shipping Details"} />
      <CheckoutSteps activeSteps={0} />
      <div className="updateProfileContainer">
        <div className="updateProfileBox shippingBox">
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Shipping
          </Typography>
          <form
            className="updateProfileForm"
            encType="multipart/form-data"
            onSubmit={ShippingSubmit}
          >
            <div className="updateProfileName">
              <HomeIcon />
              <input
                type="text"
                placeholder="Name"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="updateProfileName">
              <LocationCityIcon />
              <input
                type="text"
                placeholder="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="updateProfileName">
              <PinDropIcon />
              <input
                type="number"
                placeholder="Pin Code"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <div className="updateProfileName">
              <PhoneIcon />
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>
            <div className="updateProfileName">
              <PublicIcon />
              <select
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Country</option>
                {Country?.getAllCountries().map((elm) => (
                  <option value={elm.isoCode} key={elm.isoCode}>
                    {elm.name}
                  </option>
                ))}
              </select>
            </div>
            {country && (
              <div className="updateProfileName">
                <TransferWithinAStationIcon />{" "}
                <select
                  value={state}
                  required
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">State</option>
                  {State?.getStatesOfCountry(country).map((elm) => (
                    <option value={elm.isoCode} key={elm.isoCode}>
                      {elm.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Button
              type="submit"
              className="updateProfileButton"
              variant="contained"
              disabled={state ? false : true}
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Shipping;
