import React, { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import profleImg from "../images/Profile.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";
import Loader from "./Loader";
import MetaData from "./MetaData";
import Sidebar from "./Sidebar";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import StorageIcon from "@mui/icons-material/Storage";
import {
  newProductFail,
  newProductReq,
  newProductSuccess,
  newReviewClrErr,
  productReset,
} from "../../redux/productsSlice";

const NewProduct = () => {
  const { error, product, success, loading } = useSelector(
    (state) => state.productsSlice
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "dfgh",
    "shirt",
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "Smartphones",
  ];

  const createProdutImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((oldImg) => [...oldImg, reader.result]);
          setImagesPreview((oldImg) => [...oldImg, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const createAdminProduct = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("stock", stock);
    myForm.set("category", category);

    images.forEach((image) => {
      myForm.append("images", image);
    });

    try {
      dispatch(newProductReq());
      const res = await axios.post(`${BASE_URL}/api/v1/product/new`, myForm, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);

      if (res.data.success) {
        console.log("success");
        dispatch(newProductSuccess(res.data));
      }
    } catch (error) {
      console.log(error);
      dispatch(newProductFail(error));
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
      dispatch(newReviewClrErr());
    }

    if (success) {
      navigate("/admin/dashboard");
      toast.success("Product Created Successfully", {
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
  }, [dispatch, error, success]);

  return (
    <>
      <MetaData title={`Create Product`} />
      {loading ? <Loader /> : ""}
      <div className="dashboard">
        <div className="container">
          <Sidebar />
          <div className="newProductContainer">
            <form
              className="createProductForm"
              encType="multipart/form-data"
              onSubmit={createAdminProduct}
            >
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                Create Product
              </Typography>
              <div className="productName">
                <SpellcheckIcon />
                <input
                  type="text"
                  placeholder="Product Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="productPrice">
                <AttachMoneyIcon />
                <input
                  type="number"
                  placeholder="Price"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="productDescription">
                <DescriptionIcon />
                <textarea
                  placeholder="Product Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  cols={"30"}
                  rows={"3"}
                />
              </div>
              <div className="productCategory">
                <AccountTreeIcon />
                <select onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Choose Category</option>
                  {categories?.map((cate) => (
                    <option value={cate} key={cate}>
                      {cate}
                    </option>
                  ))}
                </select>
              </div>
              <div className="productStock">
                <StorageIcon />
                <input
                  type="number"
                  placeholder="Stock"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div className="productImage">
                <input
                  placeholder="Product Image"
                  type="file"
                  name="avatar"
                  accept="image/*"
                  multiple
                  onChange={createProdutImageChange}
                />
              </div>
              <div className="productImagePreview">
                {imagesPreview.map((img, ind) => (
                  <img src={img} alt="Product Preview" key={ind} />
                ))}
              </div>
              <Button
                type="submit"
                className="addProductButton"
                variant="contained"
                disabled={loading ? true : false}
              >
                Create
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewProduct;
