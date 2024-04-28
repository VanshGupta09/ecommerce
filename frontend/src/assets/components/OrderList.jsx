import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MetaData from "./MetaData";
import Sidebar from "./Sidebar";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import Loader from "./Loader";
import {
  deleteOrderFail,
  deleteOrderReq,
  deleteOrderSuccess,
  deleteOrderReset,
  myOrdersClrErr,
  myOrdersFail,
  myOrdersRequest,
  myOrdersSuccess,
} from "../../redux/orderSlice";

const OrderList = () => {
  const dispatch = useDispatch();
  const { error, orders, loading, isUpdated, isDeleted } = useSelector(
    (state) => state.orderSlice
  );

  const deleteOrder = async (id) => {
    try {
      dispatch(deleteOrderReq());
      const res = await axios.delete(`${BASE_URL}/api/v1/admin/${id}`, {
        withCredentials: true,
      });
      console.log(res);

      if (res?.data?.success) {
        dispatch(deleteOrderSuccess(res?.data?.success));
      }
    } catch (err) {
      console.log(err);
      dispatch(deleteOrderFail(err?.response?.data?.message));
    }
  };

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
          <>
            <Link to={`/admin/order/${params.row.id}`}>
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
              <DeleteIcon className="dltBtn" onClick={() => deleteOrder(params.row.id)} />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];
  console.log(orders);
  orders?.forEach((item, ind) => {
    rows.push({
      itemsQty: item.orderedItems.length,
      id: item._id,
      status: item.orderStatus,
      amount: item.totalPrice,
    });
  });

  const gellAllOrders = async () => {
    try {
      dispatch(myOrdersRequest());
      const res = await axios.get(`${BASE_URL}/api/v1/admin/orders`, {
        withCredentials: true,
      });
      console.log(res);
      if (res.data.success) {
        dispatch(myOrdersSuccess(res.data.data.orders));
      }
    } catch (error) {
      console.log(error?.message);
      dispatch(myOrdersFail(error?.message));
    }
  };

  useEffect(() => {
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
      dispatch(myOrdersClrErr());
    }

    gellAllOrders();

    if (isDeleted) {
      toast.success("Order Deleted Successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(deleteOrderReset());
    }
  }, [error, dispatch, isDeleted]);

  return (
    <>
      <MetaData title={`All products (Admin)`} />
      {loading ? <Loader /> : ""}
      <div className="dashboard">
        <div className="container">
          <Sidebar />
          <div className="adminProductContainer">
            <Typography
              sx={{ textAlign: "center", marginBlock: "10px 20px" }}
              variant="h3"
            >
              All Orders
            </Typography>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              className="orderListTable"
              autoHeight
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderList;
