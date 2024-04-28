import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import MetaData from "./MetaData.jsx"

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cartSlice);
  const { auth } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      // backgroundColor: theme.palette.common.black,
      backgroundColor: "#3498db",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  function createData(product, image, name, price, stock, quantity) {
    return { product, image, name, price, stock, quantity };
  }

  // const rows = [createData("https://picsum.photos/200/300", "apple", 200, 10, 5)];
  const rows = cartItems?.map((item) =>
    createData(
      item?.product,
      item?.image,
      item?.name,
      item?.price,
      item?.stock,
      item?.quantity
    )
  );

  const checkOutHandler = () => {
    auth ? navigate("/shipping") : navigate("/profile");
  };

  return (
    <>
      <MetaData title="Cart" />
      {!cartItems.length ? (
        <div className="noItemsInCart">
          <RemoveShoppingCartIcon />
          <Typography variant="h2" sx={{ textAlign: "center" }}>
            No Items in Cart
          </Typography>
          <Link to={"/products"}>
            <Button variant="text">View Products</Button>
          </Link>
        </div>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ paddingBlock: "60px" }}
          className="cart"
        >
          <Table
            sx={{
              minWidth: 700,
              border: "2px solid rgba(52, 152, 219,.5)",
            }}
            aria-label="customized table"
            className="container"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>Product</StyledTableCell>
                <StyledTableCell align="right">Quantity</StyledTableCell>
                <StyledTableCell align="right">Sub-Total</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.product}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    className="productRow"
                  >
                    {
                      <div className="rowImg">
                        <img src={row.image} alt={row.name} />
                        <div className="productData">
                          <p>{row.name}</p>
                          <p>{`₹ ${row.price}`}</p>
                          <Button
                            variant="text"
                            onClick={() =>
                              dispatch(removeFromCart(row.product))
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    }
                  </StyledTableCell>
                  <StyledTableCell align="right" className="stockRow">
                    {
                      <Stack
                        flexDirection={"row"}
                        alignItems={"center"}
                        justifyContent={"flex-start"}
                        // gap={"10px"}
                        border={"3px solid  rgb(25, 118, 210)"}
                        borderRadius={"8px"}
                      >
                        <Button
                          variant="text"
                          sx={{ fontSize: "1.5rem", paddingBlock: "0rem" }}
                          disabled={row?.stock <= 0}
                          onClick={() => {
                            if (row.quantity != 1)
                              dispatch(
                                addToCart({
                                  ...row,
                                  quantity: row.quantity - 1,
                                })
                              );
                          }}
                        >
                          -
                        </Button>
                        <p className="cartCount">{row.quantity}</p>
                        <Button
                          sx={{ fontSize: "1.5rem", paddingBlock: "0rem" }}
                          variant="text"
                          disabled={row?.stock <= 0}
                          onClick={() => {
                            if (row?.stock > row.quantity)
                              dispatch(
                                addToCart({
                                  ...row,
                                  quantity: row.quantity + 1,
                                })
                              );
                          }}
                        >
                          +
                        </Button>
                      </Stack>
                    }
                  </StyledTableCell>
                  <StyledTableCell align="right" className="priceRow">
                    <p>{`₹ ${row.quantity * row.price}`}</p>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              {
                <StyledTableRow>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    //   className="productRow"
                  ></StyledTableCell>
                  <StyledTableCell
                    align="right"
                    //   className="stockRow"
                  ></StyledTableCell>
                  <StyledTableCell align="right" className="grossRow">
                    <Stack>
                      <div className="grossDiv">
                        <p className="grossTotal">Gross Total</p>
                        <p className="grossPrice">{`₹${cartItems.reduce(
                          (acc, item) => acc + item.quantity * item.price,
                          0
                        )}`}</p>
                      </div>
                      <Button variant="contained" onClick={checkOutHandler}>
                        Check Out
                      </Button>
                    </Stack>
                  </StyledTableCell>
                </StyledTableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default Cart;
