import { Button, Stack } from "@mui/material";
import React, { useEffect } from "react";
import { MdMouse } from "react-icons/md";
import { lazy } from "react";
import { useSelector } from "react-redux";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../../config.js";
import {
  productFetched,
  productFetching,
  productError,
} from "../../redux/productsSlice.js";

const Product = lazy(() => import("../components/Product.jsx"));
const MetaData = lazy(() => import("../components/MetaData.jsx"));
const Loader = lazy(() => import("../components/Loader.jsx"));

const product = {
  name: "Shirt",
  images:
    "https://imgs.search.brave.com/Msx3Vhg3Wmyc3UlefCWwkWDkTA2cF9HdrZah4QwVkxU/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDg4/MTYwMDQxL3Bob3Rv/L21lbnMtc2hpcnQu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PXhWWmpLQVVKZWNJ/cFljX2ZLUnpfRUI4/SHVSbVhDT09QT3Ra/LVNUNmVGdlE9",
  price: "3000",
  _id: "sdcfgvhbnjm",
};

const Home = () => {
  const dispatch = useDispatch();

  const { product, error, productsCount, loading } = useSelector(
    (state) => state.productsSlice
  );

  const fetchProduct = async () => {
    try {
      dispatch(productFetching());

      const res = await axios.get(`${BASE_URL}/api/v1/products`, {
        withCredentials: true,
      });
      console.log(res);

      if (res.data.success) {
        dispatch(productFetched(res.data.data));
      }
    } catch (error) {
      console.log(error.response.data.message);
      dispatch(productError(error.response.data.message));
    }
  };

  // console.log(product, error, productsCount, loading);
  useEffect(() => {
    fetchProduct();
    if (error) {
      toast(error?.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        // transition: Bounce,
      });
      console.log(error?.message);
    }
  }, [error, dispatch]);

  return (
    <>
      {loading ? <Loader /> : ""}
      <MetaData title="Ecommerce" />
      <div className="banner">
        <div className="container">
          <p>Welcome to Ecommerce</p>
          <h1>Find products below</h1>
          <Button variant="contained" href="#products" className="scrollBtn">
            Scroll <MdMouse />{" "}
          </Button>
        </div>
      </div>
      <div className="products" id="products">
        <div className="container">
          <h3>Featured Products</h3>
          <Stack
            flexDirection={"row"}
            flexWrap={"wrap"}
            gap={"30px"}
            justifyContent={"center"}
            alignItems={"stretch"}
          >
            {product &&
              product?.map((product) => {
                return (
                  <Product
                    key={product?._id}
                    product={product}
                    productsCount={productsCount}
                  />
                );
              })}
          </Stack>
        </div>
      </div>
    </>
  );
};

export default Home;
