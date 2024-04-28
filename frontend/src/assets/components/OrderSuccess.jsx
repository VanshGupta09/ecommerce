import React from 'react'
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Typography,Button } from '@mui/material';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <>
    <div className="orderSuccess">
      <CheckCircleIcon/>
      <Typography>Your Order has been placed Successfully</Typography>
      <Button variant='text'>
      <Link to={"/orders"}>View Orders</Link>
      </Button>
    </div>
    </>
  )
}

export default OrderSuccess