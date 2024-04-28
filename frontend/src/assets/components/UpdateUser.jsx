import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";
import Loader from "./Loader";
import MetaData from "./MetaData";
import Sidebar from "./Sidebar";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  newProductFail,
  newProductReq,
  newProductSuccess,
  newReviewClrErr,
} from "../../redux/productsSlice";
import {
  clrErr,
  resetState,
  userDetailsFail,
  userDetailsReq,
  userDetailsSuccess,
  userUpdateFail,
  userUpdateReq,
  userUpdateSuccess,
} from "../../redux/userSlice";

const UpdateUser = () => {
  const {} = useSelector((state) => state.profileSlice);
  const { error, searchedUser, userUpdated, loading } = useSelector(
    (state) => state.userSlice
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const updateUserSubmitHandler = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    try {
      dispatch(userUpdateReq());
      const res = await axios.patch(
        `${BASE_URL}/api/v1/admin/user/${id}`,
        myForm,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);

      if (res.data.success) {
        console.log("success");
        dispatch(userUpdateSuccess(res.data));
      }
    } catch (error) {
      console.log(error);
      dispatch(userUpdateFail(error.message));
    }
  };

  const getUserDetails = async () => {
    try {
      dispatch(userDetailsReq());
      const res = await axios.get(`${BASE_URL}/api/v1/admin/user/${id}`, {
        withCredentials: true,
      });
      console.log(res);

      if (res.data.success) {
        dispatch(userDetailsSuccess(res.data.data.user));
      }
    } catch (err) {
      console.log(err.response);
      dispatch(userDetailsFail(err.response.data.message));
    }
  };

  useEffect(() => {
    if (searchedUser?._id !== id) {
      getUserDetails();
    } else {
      setName(searchedUser?.name);
      setEmail(searchedUser?.email);
      setRole(searchedUser?.role);
    }

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
      dispatch(clrErr());
    }

    if (userUpdated) {
      navigate("/admin/users");
      toast.success("User Updated Successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(resetState());
    }
  }, [dispatch, error, userUpdated, id, searchedUser]);

  return (
    <>
      <MetaData title={`Update User`} />
      {loading ? <Loader /> : ""}
      <div className="dashboard">
        <div className="container">
          <Sidebar />
          <div className="newProductContainer">
            <form
              className="createProductForm"
              onSubmit={updateUserSubmitHandler}
            >
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                Update User
              </Typography>
              <div className="productName">
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="productPrice">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="productCategory">
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <Button
                type="submit"
                className="addProductButton"
                variant="contained"
                disabled={loading ? true : false || role === "" ? true : false}
              >
                Update
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
