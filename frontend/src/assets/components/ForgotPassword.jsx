import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import profleImg from "../images/Profile.png";
import { useDispatch, useSelector } from "react-redux";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";
import Loader from "./Loader";
import MetaData from "./MetaData";
import {
  forgotPassFail,
  forgotPassStart,
  forgotPassSuccess,
} from "../../redux/profileSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, isUpdated, message } = useSelector(
    (state) => state.profileSlice
  );
  const [email, setEmail] = useState("");

  // Login user
  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email);

    try {
      dispatch(forgotPassStart());
      const res = await axios.post(
        `${BASE_URL}/api/v1/password/forgot`,
        myForm,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      if (res?.data?.success) {
        console.log(res.data?.message);
        dispatch(forgotPassSuccess(res?.data?.message));
        toast.success(message, {
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
    } catch (err) {
      console.log(err);
      dispatch(forgotPassFail(err?.response?.data?.message));
    }
  };

  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(error);
    }

    if (message) {
      toast.success(message, {
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
  }, [error, dispatch, message]);

  return (
    <>
      {loading ? <Loader /> : ""}
      <MetaData title={"Forgot Password"} />
      <div className="updateProfileContainer">
        <div className="updateProfileBox smallBox">
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Forgot Password
          </Typography>
          <form className="updateProfileForm" onSubmit={forgotPasswordHandler}>
            <div className="updateProfileEmail">
              <MailOutlineIcon />
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="updateProfileButton"
              variant="contained"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
