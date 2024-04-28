import React from "react";
import { Rating } from "react-simple-star-rating";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import profilePng from "../images/Profile.png";

const Reviews = ({ review }) => {

  const options = {
    readonly: true,
    emptyColor: "rgba(20,20,20,.1)",
    fillColor: "#d4d453",
    initialValue: review?.rating,
    allowFraction: true,
    size: 30,
  };

  console.log(review);
  return (
    <>
      <div className="reviewCard" style={{display:"flex",overflow:"auto"}}>
        <Card sx={{ maxWidth: 345 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "grey" }} aria-label="recipe">
                <CardMedia
                  component="img"
                  image={profilePng}
                  alt="Paella dish"
                />
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                {/* <MoreVertIcon /> */}
              </IconButton>
            }
            title={
              <>
                <Typography>{review?.name}</Typography>
                <Rating {...options} />
              </>
            }
            subheader={review?.comment}
          />
        </Card>
      </div>
    </>
  );
};

export default Reviews;
