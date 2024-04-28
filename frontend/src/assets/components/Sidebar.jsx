import { List, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";

const Sidebar = () => {
  return (
    <>
      <div className="sideBar">
        <Link to={"/"}>
          <Typography
            variant="h5"
            sx={{ letterSpacing: "2px", fontWeight: "700" }}
          >
            ECOMMERCE
          </Typography>
        </Link>
        <Link to={"/admin/dashboard"}>
          <p>
            <DashboardIcon /> Dashboard
          </p>
        </Link>
        <SimpleTreeView>
          <TreeItem itemId="1" label="Dashboard">
            <Link to={"/admin/products"}>
              <TreeItem
                itemId="2"
                label={
                  <>
                    <PostAddIcon />
                    <span>All</span>
                  </>
                }
              />
            </Link>
            <Link to={"/admin/product"}>
              <TreeItem
                itemId="3"
                label={
                  <>
                    <AddIcon />
                    <span>Create</span>
                  </>
                }
              />
            </Link>
          </TreeItem>
        </SimpleTreeView>
        <Link to={"/admin/orders"}>
          <p>
            <ListIcon /> Orders
          </p>
        </Link>
        <Link to={"/admin/users"}>
          <p>
            <PeopleIcon /> Users
          </p>
        </Link>
        <Link to={"/admin/reviews"}>
          <p>
            <RateReviewIcon /> Reviews
          </p>
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
