import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FaceIcon from "@mui/icons-material/Face";
import profleImg from "../images/Profile.png";
import { useDispatch, useSelector } from "react-redux";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";
import Loader from "./Loader";
import {
  updateProfileError,
  updateProfileRequest,
  updateProfileReset,
  updateProfileSuccess,
} from "../../redux/profileSlice";
import MetaData from "./MetaData";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userSlice);
  const { error, loading, isUpdated } = useSelector(
    (state) => state.profileSlice
  );
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(profleImg);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // User Profile Update
  const updateProfileHandler = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("avatar", avatar);

    try {
      dispatch(updateProfileRequest());
      const res = await axios.patch(`${BASE_URL}/api/v1/me/update`, myForm, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);

      if (res?.data?.success) {
        // res?.data?.data?.user
        dispatch(updateProfileSuccess());
      }
    } catch (err) {
      console.log(err?.response?.data?.message);
      dispatch(updateProfileError(err?.response?.data?.message));
    }
  };

  const updateProfileDataChange = (e) => {
    e.preventDefault();
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
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

    if (userData) {
      setName(userData?.name);
      setEmail(userData?.email);
      setAvatarPreview(userData?.avatar?.url)
    }

    if (isUpdated) {
      navigate("/profile");
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
      dispatch(updateProfileReset());
    }
  }, [error, dispatch, userData, isUpdated]);

  return (
    <>
      {loading ? <Loader /> : ""}
      <MetaData title={"Update Profile"} />
      <div className="updateProfileContainer">
        <div className="updateProfileBox">
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Update Profile
          </Typography>
          <form
            className="updateProfileForm"
            encType="multipart/form-data"
            onSubmit={updateProfileHandler}
          >
            <div className="updateProfileName">
              <FaceIcon />
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <div className="updateProfileImage">
              <img src={avatarPreview} alt="Avatar Preview" />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateProfileDataChange}
              />
            </div>
            <Button
              type="submit"
              className="updateProfileButton"
              variant="contained"
              sx={{":hover":{color:"white!important"}}}
            >
              Update
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
