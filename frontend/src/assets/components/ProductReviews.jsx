import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import StarIcon from "@mui/icons-material/Star";
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
import {
  AllreviewsFail,
  AllreviewsRequest,
  AllreviewsSuccess,
  DeletereviewFail,
  DeletereviewRequest,
  DeletereviewSuccess,
  resetSuccess,
} from "../../redux/reviewSlice";

const ProductReviews = () => {
  const [productId, setProductId] = useState("");
  const dispatch = useDispatch();
  const { reviews, loading, error, success } = useSelector(
    (state) => state.reviewSlice
  );

  const deleteReviewHandler = async (reviewsId) => {
    try {
      dispatch(DeletereviewRequest());
      const res = await axios.delete(
        `${BASE_URL}/api/v1/review?&productId=${productId}&reviewsId=${reviewsId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res);

      if (res?.data?.success) {
        dispatch(DeletereviewSuccess(res?.data?.success));
        productReviewSubmitHandler();
      }
    } catch (err) {
      console.log(err);
      dispatch(DeletereviewFail(err?.response?.data?.message));
    }
  };

  const columns = [
    { field: "id", headerName: "Review Id", minWidth: 200, flex: 0.5 },
    {
      field: "user",
      headerName: "User",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 50,
      flex: 0.5,
      cellClassName: (params) => {
        return params.value >= 3 ? "greenColor" : "redColor";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "number",
      minWidth: 50,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
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
                onClick={() => deleteReviewHandler(params.row.id)}
              />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  reviews?.forEach((item) => {
    rows.push({
      id: item._id,
      user: item.name,
      rating: item.rating,
      comment: item.comment,
    });
  });

  const productReviewSubmitHandler = async (e) => {
    e?.preventDefault();
    try {
      dispatch(AllreviewsRequest());
      const res = await axios.get(
        `${BASE_URL}/api/v1/reviews?id=${productId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res);
      if (res.data.success) {
        dispatch(AllreviewsSuccess(res.data.data));
      }
    } catch (error) {
      console.log(error?.message);
      dispatch(AllreviewsFail(error?.message));
    }
  };

  useEffect(() => {
    if (productId?.length === 24) {
      productReviewSubmitHandler();
    }
    if (success) {
      toast.success("Review Deleted Successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      dispatch(resetSuccess());
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
      dispatch(productReset());
    }
  }, [error, dispatch, productId, success]);

  return (
    <>
      <MetaData title={`All reviews (Admin)`} />
      {loading ? <Loader /> : ""}
      <div className="dashboard productReviews">
        <div className="container">
          <Sidebar />
          <div className="adminProductContainer">
            <form
              className="createProductForm"
              onSubmit={productReviewSubmitHandler}
            >
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                All Reviews
              </Typography>
              <div className="productName">
                <StarIcon />
                <input
                  type="text"
                  placeholder="Product Id"
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="addProductButton"
                variant="contained"
                disabled={
                  loading ? true : false || productId === "" ? true : false
                }
              >
                Search
              </Button>
            </form>
            <div className="reviewsSection">
              {reviews?.length > 0 ? (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSizeOptions={[10]}
                  disableRowSelectionOnClick
                  className="productListTable"
                  autoHeight
                />
              ) : (
                <Typography variant="h4">No Review Found</Typography>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductReviews;
