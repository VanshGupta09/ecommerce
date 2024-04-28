import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock';
import { useDispatch, useSelector } from "react-redux";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";
import Loader from "./Loader";
import MetaData from "./MetaData";
import { updatePasswordError, updatePasswordRequest, updatePasswordReset, updatePasswordSuccess } from "../../redux/profileSlice";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, isUpdated } = useSelector(
    (state) => state.profileSlice
  );
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // User Profile Update
  const updatePasswordHandler = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    try {
      dispatch(updatePasswordRequest());
      const res = await axios.patch(
        `${BASE_URL}/api/v1/password/update`,
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
        toast.success("Password Changed Successfully", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        dispatch(updatePasswordSuccess());
      }
    } catch (err) {
      console.log(err?.response?.data?.message);
      dispatch(updatePasswordError(err?.response?.data?.message));
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

    if (isUpdated) {
      toast.success("Profile Updated Successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/profile");
      dispatch(updatePasswordReset());
    }
  }, [error, dispatch,  isUpdated]);

  return (
    <>
      {loading ? <Loader /> : ""}
      <MetaData title={"Change Password"} />
      <div className="updateProfileContainer">
        <div className="updateProfileBox">
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Change Password
          </Typography>
          <form
            className="updateProfileForm"
            // this is used to upload image through form
            // encType="multipart/form-data"
            onSubmit={updatePasswordHandler}
          >
            <div className="loginPassword">
              <VpnKeyIcon />
              <input
                type="password"
                required
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                />
            </div>
            <div className="loginPassword">
              <LockOpenIcon />
              <input
                type="password"
                required
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              Change
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
