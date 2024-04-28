import * as React from "react";
import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

const Product = ({ product }) => {
  const options = {
    readonly: true,
    emptyColor: "rgba(20,20,20,.1)",
    fillColor: "#d4d453",
    initialValue: product?.rating,
    allowFraction: true,
    size: 30,
  };

  return (
    <>
      <Link className="product-card" to={`/product/${product?._id}`}>
        <Card sx={{ maxWidth: 300,minWidth:300 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={
                product?.images[0]
                  ? product?.images[0]?.url
                  : "https://picsum.photos/200/300"
              }
              alt="green iguana"
              sx={{ display: "block", objectFit: "contain", margin: "0 auto" }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {product?.name}
              </Typography>
              <Rating {...options} />
              <Typography
                variant="h6"
                sx={{ fontSize: "20px" }}
              >{`₹ ${product?.price}`}</Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", color: "", padding: "8px 0" }}
                color="text.secondary"
              >
                {`${product?.numOfReviews} Reviews`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product?.description}{" "}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </>
  );
};

export default Product;
