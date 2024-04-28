import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Typography from "@mui/material/Typography";
import { Button, Stack } from "@mui/material";
import { lazy } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../../config";
import axios from "axios";
// import Pagination from "@mui/material/Pagination";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import {
  productError,
  productFetched,
  productFetching,
} from "../../redux/productsSlice";

const Product = lazy(() => import("../components/Product.jsx"));
const MetaData = lazy(() => import("../components/MetaData.jsx"));

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "Smartphones",
];

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();
  const { keyword } = useParams();
  const {
    product,
    error,
    productsCount,
    loading,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.productsSlice);

  const chanegRating = (event, newRating) => {
    setRating(newRating);
  };

  function valuetext(value) {
    return `${value}`;
  }

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const handleChange = (event, newPrice) => {
    setPrice(newPrice);
  };
  // catrgory=${category}
  const getProducts = async () => {
    try {
      dispatch(productFetching());
      let link;
      if (keyword === undefined) {
        link = `${BASE_URL}/api/v1/products?keyword=&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&rating[gte]=${rating}`;
      } else if (category !== "") {
        link = `${BASE_URL}/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&rating[gte]=${rating}`;
        console.log(link);
      } else {
        link = `${BASE_URL}/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&rating[gte]=${rating}`;
      }

      const res = await axios.get(link);
      console.log(res);

      if (res.data.success) {
        dispatch(productFetched(res.data.data));
      }
    } catch (error) {
      console.log(error?.message);
      dispatch(productError(error?.message));
    }
  };

  useEffect(() => {
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
      });
      console.log(error?.message);
    }
    getProducts();
  }, [dispatch, keyword, currentPage, price, category, rating]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, price, category, rating]);

  return (
    <>
      {loading ? <Loader /> : ""}
      <MetaData title="Ecommerce-Product" />
      <div className="container" style={{ paddingBlock: "60px" }}>
        <Stack
          gap={"30px"}
          justifyContent={"space-evenly"}
          alignItems={"center"}
        >
          <div>
            {
              <Box>
                <Typography
                  variant="h5"
                  sx={{ paddingBottom: "10px", textAlign: "center" }}
                >
                  Filter
                </Typography>
                <Stack
                  gap={"10px"}
                  className="priceFilter"
                  flexDirection={"row"}
                  alignItems={"flex-start"}
                >
                  <div>
                    <Typography>Price</Typography>
                    <Slider
                      getAriaLabel={() => "Temperature range"}
                      value={price}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      getAriaValueText={valuetext}
                      min={0}
                      max={25000}
                    />
                  </div>
                  <div className="categoryFilter">
                    <Typography>Categories</Typography>
                    <ul className="categoryBox">
                      {categories?.map((category) => (
                        <li
                          key={category}
                          className="categorLink"
                          onClick={() => setCategory(category)}
                        >
                          {category}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="ratingFIlter">
                    <fieldset
                      style={{
                        border: "1px solid rgba(0,0,0,.3)",
                        padding: " 0 15px",
                      }}
                    >
                      <Typography component={"legend"}>
                        Ratings Above
                      </Typography>
                      <Slider
                        aria-label="Volume"
                        value={rating}
                        onChange={chanegRating}
                        min={0}
                        max={5}
                        aria-labelledby="continous-slider"
                        valueLabelDisplay="auto"
                      />
                    </fieldset>
                  </div>
                </Stack>
              </Box>
            }
            <Typography
              variant="h3"
              textAlign={"center"}
              paddingBottom={"20px"}
            >
              Products
            </Typography>
            <Stack
              flexDirection={"row"}
              flexWrap={"wrap"}
              gap={"30px"}
              justifyContent={"space-evenly"}
              alignItems={"center"}
              textAlign={"center"}
              margin={"0 auto"}
            >
              {product ? (
                product?.map((product) => (
                  <Product
                    key={product?._id}
                    product={product}
                    productsCount={productsCount}
                  />
                ))
              ) : (
                <Typography variant="h5" sx={{ color: "grey", margin: "auto" }}>
                  Products not found
                </Typography>
              )}
            </Stack>
            <Stack spacing={2} alignItems={"center"} margin={"20px auto"}>
              {/* <Pagination count={10} shape="rounded" /> */}
              {resultPerPage < filteredProductsCount && (
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={product?.resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  nextPageText={"Next"}
                  prevPageText={"Prev"}
                  firstPageText={"First"}
                  lastPageText={"Last"}
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              )}
            </Stack>
          </div>
        </Stack>
      </div>
    </>
  );
};

export default Products;
