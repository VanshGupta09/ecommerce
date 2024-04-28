import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";
import Loader from "./Loader";
import MetaData from "./MetaData";
import {
  resetPassFail,
  resetPassStart,
  resetPassSuccess,
} from "../../redux/profileSlice";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, success } = useSelector(
    (state) => state.profileSlice
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();

  // Reset user password
  const updateResetHandler = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);

    try {
      dispatch(resetPassStart());
      const res = await axios.patch(
        `${BASE_URL}/api/v1/password/reset/${token}`,
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
        // toast.success("Password Changed Successfully", {
        //   position: "bottom-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        // });
        dispatch(resetPassSuccess(res?.data?.success));
      }
    } catch (err) {
      console.log(err?.response?.data?.message);
      dispatch(resetPassFail(err?.response?.data?.message));
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

    if (success) {
      toast.success("Password Updated Successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/login");
    }
  }, [error, dispatch, success]);
  return (
    <>
      {loading ? <Loader /> : ""}
      <MetaData title={"Change Password"} />
      <div className="updateProfileContainer">
        <div className="updateProfileBox forgetPassBox">
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Change Password
          </Typography>
          <form className="updateProfileForm" onSubmit={updateResetHandler}>
            <div className="loginPassword">
              <LockOpenIcon />
              <input
                type="password"
                required
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="loginPassword">
              <LockIcon />
              <input
                type="password"
                required
                placeholder="New Password Confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="updateProfileButton"
              variant="contained"
            >
              Update
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
