import React from "react";
import MetaData from "./MetaData";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const Profile = () => {
  const { userData, error, loading, auth } = useSelector(
    (state) => state.userSlice
  );

  console.log(userData);
  return (
    <>
      {loading ? <Loader /> : ""}
      <MetaData title={`${userData?.name}'s Profile`} />
      <div className="container profileContainer">
        <div className="imageDiv">
          <Typography variant="h4">My Profile</Typography>
          <img src={userData?.avatar?.url} alt={userData?.name} />
          <Button variant="contained">
            <Link to={"/me/update"}>Edit Profile</Link>
          </Button>
        </div>
        <div className="userDetails">
          <div>
            <Typography variant="h5">Full Name</Typography>
            <Typography>{userData?.name}</Typography>
          </div>
          <div>
            <Typography variant="h5">Email</Typography>
            <Typography>{userData?.email}</Typography>
          </div>
          <div>
            <Typography variant="h5">Joined At</Typography>
            <Typography>
              {String(userData?.createdAt).substring(0, 10)}
            </Typography>
          </div>
          <div className="btn">
          <Button variant="contained">
            <Link to={"/orders"}>My Orders</Link>
            </Button>
          <Button variant="contained">
            <Link to={"/password/update"}>Change Password</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
