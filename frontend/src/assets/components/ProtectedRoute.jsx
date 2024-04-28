import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, component: Element, ...rest }) => {
  const { loading, auth, userData } = useSelector((state) => state.userSlice);

  return (
    <>
      {loading === false && (
        <Route
          {...rest}
          render={(props) => {
            if (auth === false) {
              return <Redirect to="/login" />;
            }

            if (auth === true && userData.role !== "admin") {
              return <Redirect to="/login" />;
            }

            return <Element {...props} />;
          }}
        />
      )}
    </>
  );
};

export default ProtectedRoute;
