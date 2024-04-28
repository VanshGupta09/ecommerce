import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  productDetailsError,
  productDetailsFetched,
  productDetailsFetching,
} from "../../redux/productDetailsSlice";
import { BASE_URL } from "../../../config";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { Rating as RatingNpm } from "react-simple-star-rating";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { lazy } from "react";
import Loader from "./Loader.jsx";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/cartSlice.js";
import Rating from "@mui/material/Rating";
import {
  newReviewClrErr,
  newReviewFail,
  newReviewReq,
  newReviewReset,
  newReviewSuccess,
  productReset,
} from "../../redux/productsSlice.js";

const Reviews = lazy(() => import("./Reviews.jsx"));
const MetaData = lazy(() => import("./MetaData.jsx"));

const ProductDetails = () => {
  const [productCount, setProductCount] = useState(1);
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const { id } = useParams();
  const { productDetails, loading, error } = useSelector(
    (state) => state.productDetailsSlice
  );
  const {
    loading: pageLoading,
    error: reviewError,
    success,
  } = useSelector((state) => state.productsSlice);

  const options = {
    readonly: true,
    emptyColor: "rgba(20,20,20,.1)",
    fillColor: "#d4d453",
    initialValue: productDetails?.rating,
    allowFraction: true,
    size: 30,
  };

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const responsiveReview = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const fetchProductDetails = async () => {
    try {
      dispatch(productDetailsFetching());
      const res = await axios.get(`${BASE_URL}/api/v1/product/${id}`, {
        withCredentials: true,
      });
      console.log(res);

      if (res.data.success) {
        dispatch(productDetailsFetched(res.data.data));
      }
    } catch (error) {
      console.log(error.response.data.message);
      dispatch(productDetailsError(error.response.data.message));
    }
  };

  const addToCartHandler = async () => {
    const { data } = await axios.get(`${BASE_URL}/api/v1/product/${id}`, {
      withCredentials: true,
    });
    console.log(data?.data?.product);
    dispatch(
      addToCart({
        product: data?.data?.product?._id,
        name: data?.data?.product?.name,
        price: data?.data?.product?.price,
        image: data?.data?.product?.images[0]?.url,
        stock: data?.data?.product?.stock,
        quantity: productCount,
      })
    );
    toast.success("Item Added To Cart", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const reviewSubmitHandler = async (e) => {
    e.preventDefault();
    setOpen(false);
    const myForm = new FormData();
    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    try {
      dispatch(newReviewReq());
      const res = await axios.patch(`${BASE_URL}/api/v1/review`, myForm, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);

      if (res.data.success) {
        console.log("Success");
        dispatch(newReviewSuccess(res.data.success));
      }
    } catch (error) {
      console.log(error);
      dispatch(newReviewFail(error));
    }
  };

  useEffect(() => {
    fetchProductDetails();
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

    if (reviewError) {
      toast.error(reviewError, {
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

    if (success) {
      toast.success("Review Submitted Succcessfully", {
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
  }, [dispatch, error, reviewError, success]);

  return (
    <>
      {loading || pageLoading ? <Loader /> : ""}
      <div className="productDetailsSection">
        <MetaData title={`Product ${productDetails?.name}`} />
        <div className="container">
          <Stack flexDirection={"row"} gap={"20px"}>
            {productDetails?.images ? (
              <div className="carousel" style={{ width: "50%"}}>
                <Carousel
                  swipeable={true}
                  draggable={true}
                  showDots={true}
                  responsive={responsive}
                  infinite={true}
                  autoPlay={true}
                  autoPlaySpeed={1000}
                  keyBoardControl={true}
                  customTransition="all 1s"
                  transitionDuration={5000}
                  dotListClass="custom-dot-list-style"
                  itemClass="carousel-item-padding-40-px"
                  containerClass="carousel-container"
                  arrows={true}
                >
                  {productDetails?.images?.map((elm, ind) => (
                    <div key={ind}>
                      <img src={elm.url} alt="Slider img"/>
                    </div>
                  ))}
                </Carousel>
              </div>
            ) : (
              ""
            )}
            <div
              className="productDetails"
              style={{ width: productDetails?.images ? "50%" : "100%" }}
            >
              <Typography variant="h3" sx={{ paddingBottom: "10px" }}>
                {productDetails?.name}
              </Typography>
              <span className="productId" sx={{ paddingBottom: "10px" }}>
                {productDetails?._id}
              </span>
              <div
                style={{
                  paddingBlock: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RatingNpm {...options} sx={{ paddingBottom: "10px" }} />
                {/* <Rating
                  defaultValue={productDetails.rating}
                  size="large"
                  readOnly
                  precision={0.5}
                /> */}
                <span>{`(${productDetails?.reviews?.length} Reviews)`}</span>
              </div>
              <Typography
                variant="h5"
                sx={{ paddingBottom: "10px" }}
              >{`₹ ${productDetails?.price}`}</Typography>
              <Stack
                flexDirection={"row"}
                alignItems={"center"}
                gap={"10px"}
                sx={{ paddingBottom: "10px" }}
              >
                <Stack
                  flexDirection={"row"}
                  alignItems={"center"}
                  // gap={"10px"}
                  border={"3px solid  rgb(25, 118, 210)"}
                  borderRadius={"8px"}
                >
                  <Button
                    variant="text"
                    sx={{ fontSize: "1.5rem", paddingBlock: "0rem" }}
                    disabled={productDetails?.stock <= 0}
                    onClick={() => {
                      if (productCount != 1)
                        setProductCount((prev) => prev - 1);
                    }}
                  >
                    -
                  </Button>
                  <p className="cartCount">{productCount}</p>
                  <Button
                    sx={{ fontSize: "1.5rem", paddingBlock: "0rem" }}
                    variant="text"
                    disabled={productDetails?.stock <= 0}
                    onClick={() => {
                      if (productDetails?.stock > productCount)
                        setProductCount((prev) => prev + 1);
                    }}
                  >
                    +
                  </Button>
                </Stack>
                <Button
                  variant="contained"
                  sx={{ display: "block" }}
                  onClick={addToCartHandler}
                  disabled={productDetails?.stock < 1 ? true : false}
                >
                  Add to Cart
                </Button>
              </Stack>
              <Typography sx={{ paddingBottom: "5px" }}>
                {`Status: `}
                {productDetails?.stock <= 0 ? (
                  <span style={{ color: "red" }}>{` Out of stock`}</span>
                ) : (
                  <span style={{ color: "green" }}>{`In stock`}</span>
                )}
              </Typography>
              <Typography
                sx={{ paddingBottom: "10px" }}
              >{`Description: ${productDetails?.description}`}</Typography>
              <Button
                variant="contained"
                onClick={() => setOpen((prev) => !prev)}
              >
                Submit Review
              </Button>
              <Dialog
                aria-labelledby="simple-dialog-title"
                open={open}
                onClose={() => setOpen((prev) => !prev)}
              >
                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent className="submitDialog">
                  <Rating
                    onChange={(e) => setRating(Number(e.target.value))}
                    value={rating}
                    size={"large"}
                  />
                  <textarea
                    className="submitDialogTextarea"
                    cols={30}
                    rows={5}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={reviewSubmitHandler}>
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Stack>
          <div style={{ marginBlock: "20px" }}>
            {productDetails?.reviews && productDetails?.reviews[0] ? (
              <Carousel
                swipeable={true}
                draggable={true}
                showDots={false}
                responsive={responsiveReview}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="all 1s"
                transitionDuration={5000}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
                containerClass="carousel-container"
                arrows={false}
              >
                {productDetails?.reviews?.map((review) => (
                  <Reviews review={review} key={review?._id} />
                ))}
              </Carousel>
            ) : (
              <Typography color={"grey"}>No Reviews Yet</Typography>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
