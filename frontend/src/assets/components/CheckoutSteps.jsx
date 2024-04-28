import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import React from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const CheckoutSteps = ({ activeSteps }) => {
  const steps = [
    {
      label: <Typography>Shipping Details</Typography>,
      icon: <LocalShippingIcon />,
    },
    {
      label: <Typography>Confirm Order</Typography>,
      icon: <LibraryAddCheckIcon />,
    },
    {
      label: <Typography>Payment</Typography>,
      icon: <AccountBalanceIcon />,
    },
  ];

  const style = { boxSizing: "border-box",backgroundColor:"rgba(231,231,231)",paddingBlock:"10px" };

  return (
    <>
      <Stepper alternativeLabel activeStep={activeSteps} style={style}>
        {steps.map((item, ind) => (
          <Step
            key={ind}
            active={activeSteps === ind ? true : false}
            completed={activeSteps >= ind ? true : false}
          >
            <StepLabel
              icon={item.icon}
              sx={{ color: activeSteps >= ind ? "rgb(25, 118, 210)" : "rgba(0, 0, 0,.5)" }}
            >
              {item.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
};

export default CheckoutSteps;
