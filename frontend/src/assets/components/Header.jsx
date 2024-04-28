import * as React from "react";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import profileImg from "../images/Profile.png";
import { useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { logoutFail, logoutStart, logoutSuccess } from "../../redux/userSlice";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS
import { useRef } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

function Header() {
  const [keyword, setKeyword] = React.useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { userData, error, loading, auth } = useSelector(
    (state) => state.userSlice
  );
  const { cartItems } = useSelector((state) => state.cartSlice);
  const btnRef = useRef(null);
  const navRef = useRef(null);

  const pages = [
    { name: "Home", link: "/" },
    { name: "Products", link: "/products" },
    { name: `Cart (${cartItems.length})`, link: "/cart" },
  ];
  const settings = [];

  const logOut = async () => {
    try {
      dispatch(logoutStart());
      const res = await axios.get(`${BASE_URL}/api/v1/logout`, {
        withCredentials: true,
      });
      console.log(res);

      if (res?.data?.success) {
        dispatch(logoutSuccess());
        navigate("/");
        toast.success("Logged Out successfully", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // console.log("Logout Successfuly");
      }
    } catch (err) {
      console.log(err);
      dispatch(logoutFail(err?.response?.data?.message));
    }
  };

  if (auth) {
    settings.unshift(
      { name: "Profile", link: "/profile", icon: <PersonIcon /> },
      {
        name: `Cart (${cartItems.length})`,
        link: "/cart",
        icon: <ShoppingCartIcon />,
      },
      { name: "Orders", link: "/orders", icon: <ContentPasteIcon /> },
      { name: "Logout", link: "/logout", func: logOut, icon: <LogoutIcon /> }
    );
  } else {
    settings.push({ name: "Login", link: "/login", icon: <LoginIcon /> });
  }
  if (userData?.role === "admin") {
    settings.unshift({
      name: "Dashboard",
      link: "/admin/dashboard",
      icon: <DashboardIcon />,
    });
  }

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(keyword);
    if (keyword.trim()) {
      navigate(`products/${keyword}`);
    } else {
      navigate(`products`);
    }
  };

  React.useEffect(() => {
    btnRef.current.classList.remove("collapsed");
    navRef.current.classList.remove("show");
  }, [location.pathname]);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "rgba(25, 118, 210, 01)!important" }}
      >
        <div className="container-fluid">
          <Link to={"/"} className="logo">
            ECOMMERCE
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            ref={btnRef}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
            ref={navRef}
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {pages.map((page) => (
                <li className="nav-item pageLink" key={page.name}>
                  <Link to={page.link}>{page.name}</Link>
                </li>
              ))}
            </ul>
            <form className="d-flex" role="search" onSubmit={submitHandler}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Button type="submit" variant="text" sx={{ minWidth: "auto" }}>
                <SearchIcon />
              </Button>
            </form>
            <li className="nav-item" style={{ listStyle: "none" }}>
              <Avatar
                className="nav-link avatarImg"
                aria-expanded="false"
                data-bs-toggle="dropdown"
                alt="Profile Image"
                src={auth ? userData?.avatar?.url : profileImg}
              />
              <ul
                className="dropdown-menu profile"
                style={{
                  width: window.innerWidth > 768 ? "fit-content" : "auto",
                  right: window.innerWidth > 768 ? "0" : "auto",
                  left: window.innerWidth > 768 ? "auto" : "0",
                }}
              >
                {settings.map((setting) => (
                  <li key={setting.name}>
                    {setting.func ? (
                      <Link className="dropdown-item">
                        <Stack flexDirection={"row"} gap={"3px"}>
                          {setting?.icon}
                          <Typography onClick={setting.func}>
                            {setting.name}
                          </Typography>
                        </Stack>
                      </Link>
                    ) : (
                      <Link to={setting.link}>
                        <Stack flexDirection={"row"} gap={"3px"}>
                          {setting?.icon}
                          <Typography>{setting.name}</Typography>
                        </Stack>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Header;
