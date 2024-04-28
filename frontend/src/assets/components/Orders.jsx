import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import MetaData from "./MetaData";
import Loader from "./Loader";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  myOrdersClrErr,
  myOrdersFail,
  myOrdersRequest,
  myOrdersSuccess,
} from "../../redux/orderSlice";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { Link } from "react-router-dom";
import { Launch } from "@mui/icons-material";

const Orders = () => {
  const { userData } = useSelector((state) => state.userSlice);
  const { error, loading, orders } = useSelector((state) => state.orderSlice);
  // const { error, loading } = useSelector((state) => state.orderSlice);
  const dispatch = useDispatch();

  const columns = [
    { field: "id", headerName: "Order Id", minWidth: 300, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 90,
      flex: 0.5,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 90,
      flex: 0.3,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
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
          <Link to={`/order/${params.row.id}`}>
            <Launch />
          </Link>
        );
      },
    },
  ];

  const rows = [];

  // const orders = [
  //   {
  //     orderItems: ["berb", "bedf", "bedfsv"],
  //     _id: "ertyuiiudjhgfc",
  //     orderStatus: "Processing",
  //     totalPrice: 30000,
  //   },
  //   {
  //     orderItems: ["berb", "bedf", "bedfsv"],
  //     _id: "ertyuiiujhgfc",
  //     orderStatus: "Delivered",
  //     totalPrice: 40000,
  //   },
  // ];

  orders?.forEach((item, ind) => {
    rows.push({
      itemsQty: item.orderedItems.length,
      id: item._id,
      status: item.orderStatus,
      amount: item.totalPrice,
    });
  });

  const fetchOrders = async () => {
    try {
      dispatch(myOrdersRequest());
      const res = await axios.get(`${BASE_URL}/api/v1/orders`, {
        withCredentials: true,
      });
      console.log(res);

      if (res?.data?.success) {
        dispatch(myOrdersSuccess(res?.data?.data?.orders));
      }
    } catch (err) {
      console.log(err);
      dispatch(myOrdersFail(err?.response?.data?.message));
    }
  };

  useEffect(() => {
    fetchOrders();
    if (error) {
      toast.error(error?.response?.data?.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(myOrdersClrErr());
    }
  }, [dispatch, error]);

  return (
    <>
      {loading ? <Loader /> : ""}
      <MetaData title={`${userData.name} - Orders`} />
      <div className="myOrdersPage">
        <div className="container">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          className="myOrdersTable"
          autoHeight
        />
        <Typography className="myOrdersHeading">
          {userData.name}'s Orders
        </Typography>
        </div>
      </div>
    </>
  );
};

export default Orders;
