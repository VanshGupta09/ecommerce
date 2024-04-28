import React, { useEffect } from "react";
import SideBar from "./Sidebar.jsx";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { useDispatch, useSelector } from "react-redux";
import {
  adminProductFail,
  adminProductReq,
  adminProductSuccess,
  newReviewClrErr,
} from "../../redux/productsSlice.js";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../../config.js";
import {
  myOrdersFail,
  myOrdersRequest,
  myOrdersSuccessWIthTotalAmount,
} from "../../redux/orderSlice.js";
import {
  allUsersFail,
  allUsersReq,
  allUsersSuccess,
} from "../../redux/userSlice.js";

const Dashboard = () => {
  let outOfStock = 0;
  const dispatch = useDispatch();
  const { error, product } = useSelector((state) => state.productsSlice);
  const { orders } = useSelector((state) => state.orderSlice);
  const { allUsers } = useSelector((state) => state.userSlice);

  product?.forEach((item) => {
    if (item.stock === 0) {
      outOfStock++;
    }
  });

  let totalAmount = 0;
  orders?.forEach((item) => {
    totalAmount=item.totalPrice;
  });

  const uData = [0, totalAmount];
  const xLabels = ["Initial Amount", "Amount Earned"];
  const chartData = [
    { value: product?.length - outOfStock, label: "In Stock" },
    { value: outOfStock, label: "Out Of Stock" },
  ];

  const getAdminProducts = async () => {
    try {
      dispatch(adminProductReq());
      const res = await axios.get(`${BASE_URL}/api/v1/admin/products`, {
        withCredentials: true,
      });
      console.log(res);
      if (res.data.success) {
        dispatch(adminProductSuccess(res.data.data));
      }
    } catch (error) {
      console.log(error?.message);
      dispatch(adminProductFail(error?.message));
    }
  };

  const gellAllOrders = async () => {
    try {
      dispatch(myOrdersRequest());
      const res = await axios.get(`${BASE_URL}/api/v1/admin/orders`, {
        withCredentials: true,
      });
      console.log(res);
      if (res.data.success) {
        dispatch(myOrdersSuccessWIthTotalAmount(res.data.data));
      }
    } catch (error) {
      console.log(error?.message);
      dispatch(myOrdersFail(error?.message));
    }
  };

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
    gellAllOrders();
    getAllUsers();
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
      dispatch(newReviewClrErr());
    }
    getAdminProducts();
  }, [error, dispatch]);

  return (
    <>
      <div className="dashboard">
        <div className="container">
          <SideBar />
          <div className="dashboardContainer">
            <Typography variant="h3">Dashboard</Typography>
            <div className="dashboardSummary">
              <div>
                <p style={{ color: "white" }}>
                  Total Amount <br />
                  {`₹${totalAmount}`}
                </p>
              </div>
            </div>
            <div className="dashboardContainerBox2">
              <Link to={"/admin/products"}>
                <p>Products</p>
                <p>{product?.length}</p>
              </Link>
              <Link to={"/admin/orders"}>
                <p>Orders</p>
                <p>{orders?.length}</p>
              </Link>
              <Link to={"/admin/users"}>
                <p>Users</p>
                <p>{allUsers?.length}</p>
              </Link>
            </div>
            <LineChart
              width={500}
              height={300}
              sx={{}}
              series={[
                // { data: pData, label: "pv" },
                { data: uData, label: "Total Amount" },
              ]}
              xAxis={[{ scaleType: "point", data: xLabels }]}
            />
            <PieChart
              series={[
                {
                  data: chartData,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: 0,
                  endAngle: 360,
                  cx: 150,
                  cy: 150,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
