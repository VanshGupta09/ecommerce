import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MetaData from "./MetaData";
import Sidebar from "./Sidebar";
import { productReset } from "../../redux/productsSlice";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import Loader from "./Loader";
import Box from "@mui/material/Box";
import {
  allUsersFail,
  allUsersReq,
  allUsersSuccess,
  resetState,
  userDeleteFail,
  userDeleteReq,
  userDeleteSuccess,
} from "../../redux/userSlice";

const UsersList = () => {
  const dispatch = useDispatch();
  const {
    error,
    allUsers,
    loading,
    searchedUser,
    userDeleted,
    userUpdated,
    message,
  } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();

  const deleteUserHandler = async (id) => {
    try {
      dispatch(userDeleteReq());
      const res = await axios.delete(`${BASE_URL}/api/v1/admin/user/${id}`, {
        withCredentials: true,
      });
      console.log(res);

      if (res?.data?.success) {
        dispatch(userDeleteSuccess(res?.data));
      }
    } catch (err) {
      console.log(err);
      dispatch(userDeleteFail(err?.response?.data?.message));
    }
  };

  const columns = [
    { field: "id", headerName: "User Id", minWidth: 180, flex: 0.8 },
    {
      field: "email",
      headerName: "Email",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.value === "admin" ? "greenColor" : "redColor";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      minWidth: 150,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/user/${params.row.id}`}>
              <EditIcon />
            </Link>
            <Button
              sx={{
                padding: "0",
                margin: "0",
                color: "black",
                minWidth: "30px",
                ":hover": { color: "rgb(25, 118, 210)" },
              }}
            >
              <DeleteIcon
                className="dltBtn"
                onClick={() => deleteUserHandler(params.row.id)}
              />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  allUsers?.forEach((item) => {
    rows.push({
      id: item._id,
      email: item.email,
      role: item.role,
      name: item.name,
    });
  });

  const getAllUsers = async () => {
    try {
      dispatch(allUsersReq());
      const res = await axios.get(`${BASE_URL}/api/v1/admin/users`, {
        withCredentials: true,
      });
      console.log(res);
      if (res.data.success) {
        dispatch(allUsersSuccess(res.data.data.users));
      }
    } catch (error) {
      console.log(error?.message);
      dispatch(allUsersFail(error?.message));
    }
  };

  useEffect(() => {
    getAllUsers();

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
      dispatch(productReset());
    }

    if (userDeleted) {
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
      dispatch(resetState());
      //   navigate("/admin/users");
    }
  }, [error, dispatch, userDeleted, message]);

  return (
    <>
      <MetaData title={`All users (Admin)`} />
      {loading ? <Loader /> : ""}
      <div className="dashboard">
        <div className="container">
          <Sidebar />
          <div className="adminProductContainer">
            <Typography
              sx={{ textAlign: "center", marginBlock: "10px 20px" }}
              variant="h3"
            >
              All Users
            </Typography>
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                className="productListTable"
                autoHeight
              />
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersList;
