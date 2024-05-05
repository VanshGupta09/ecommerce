import React, { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FaceIcon from "@mui/icons-material/Face";
import profleImg from "../images/Profile.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";
import Loader from "./Loader";
import {
  errorFetching,
  errorRegister,
  startFetching,
  startRegister,
  successFetching,
  successRegister,
} from "../../redux/userSlice";

const LoginSignUp = () => {
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profleImg);
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, error, loading, auth } = useSelector(
    (state) => state.userSlice
  );

  const { name, email, password } = user;

  const switchTab = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.remove("shiftToNeutral");
      switcherTab.current.classList.add("shiftToRight");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  // Login user
  const loginHandler = async (e) => {
    e.preventDefault();
    // console.log(loginEmail, loginPassword);
    try {
      dispatch(startFetching());
      const res = await axios.post(
        `${BASE_URL}/api/v1/login`,
        {
          email: loginEmail,
          password: loginPassword,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      if (res?.data?.success) {
        dispatch(successFetching(res?.data?.data?.user));
        toast.success("Login successfull", {
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
      dispatch(errorFetching(err?.response?.data?.message));
    }
  };

  // User registration
  const registerHandler = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);

    try {
      dispatch(startRegister());
      const res = await axios.post(`${BASE_URL}/api/v1/register`, myForm, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);

      if (res?.data?.success) {
        dispatch(successRegister(res?.data?.data?.user));
        toast.success("Registration successfull", {
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
      console.log(err?.response?.data?.message);
      dispatch(errorRegister(err?.response?.data?.message));
    }
  };

  const registerDataChange = (e) => {
    e.preventDefault();
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  useEffect(() => {
    // console.log(error,loading,userData);
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
    }
    if (auth) {
      navigate("/account");
    }
  }, [error, dispatch, auth]);

  return (
    <>
      {loading ? <Loader /> : ""}
      <div className="loginSignUpContainer">
        <div className="loginSignUpBox">
          <div>
            <div className="loginSignUpToggle">
              <Typography onClick={(e) => switchTab(e, "login")}>
                Login
              </Typography>
              <Typography onClick={(e) => switchTab(e, "register")}>
                Register
              </Typography>
            </div>
            <div className="underline" ref={switcherTab}></div>
          </div>
          <form className="loginForm" ref={loginTab} onSubmit={loginHandler}>
            <div className="loginEmail">
              <MailOutlineIcon />
              <input
                type="email"
                required
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="loginPassword">
              <LockOpenIcon />
              <input
                type="password"
                required
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <Link to={"/password/forgot"}>Forget Password?</Link>
            <Button type="submit" className="loginButton" variant="contained">
              Login
            </Button>
          </form>
          <form
            className="signUpForm"
            ref={registerTab}
            encType="multipart/form-data"
            onSubmit={registerHandler}
          >
            <div className="signUpName">
              <FaceIcon />
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={registerDataChange}
              />
            </div>
            <div className="signUpEmail">
              <MailOutlineIcon />
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={registerDataChange}
              />
            </div>
            <div className="signUpPassword">
              <LockOpenIcon />
              <input
                type="password"
                required
                name="password"
                placeholder="Password"
                value={password}
                onChange={registerDataChange}
              />
            </div>
            <div className="registerImage">
              <img src={avatarPreview} alt="Avatar Preview" />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={registerDataChange}
              />
            </div>
            <Button type="submit" className="signUpButton" variant="contained">
              Register
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginSignUp;
