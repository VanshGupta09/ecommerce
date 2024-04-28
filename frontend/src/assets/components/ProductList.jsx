import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MetaData from "./MetaData";
import Sidebar from "./Sidebar";
import {
  adminProductFail,
  adminProductReq,
  adminProductSuccess,
  newProductFail,
  newReviewReq,
  newReviewReset,
  newReviewSuccess,
  productReset,
} from "../../redux/productsSlice";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import Loader from "./Loader";

const ProductList = () => {
  const dispatch = useDispatch();
  const { error, product, success, loading } = useSelector(
    (state) => state.productsSlice
  );

  const deleteProduct = async (id) => {
    try {
      dispatch(newReviewReq());
      const res = await axios.delete(`${BASE_URL}/api/v1/product/${id}`, {
        withCredentials: true,
      });
      console.log(res);

      if (res?.data?.success) {
        dispatch(newReviewSuccess(res?.data?.success));
      }
    } catch (err) {
      console.log(err);
      dispatch(newProductFail(err?.response?.data?.message));
    }
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 200, flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 100,
      flex: 0.3,
    },
    {
      field: "price",
      headerName: "Price",
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
            <Link to={`/admin/product/${params.row.id}`}>
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
              <DeleteIcon className="dltBtn" onClick={() => deleteProduct(params.row.id)} />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  product?.forEach((item) => {
    rows.push({
      id: item._id,
      stock: item.stock,
      price: item.price,
      name: item.name,
    });
  });

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
      dispatch(productReset());
    }

    getAdminProducts();

    if (success) {
      toast.success("Product Deleted Successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(newReviewReset());
    }
  }, [error, dispatch, success]);

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
              All Products
            </Typography>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              className="productListTable"
              autoHeight
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
