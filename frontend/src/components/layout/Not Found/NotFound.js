import React from "react";
import "./NotFound.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { MdError } from "react-icons/md";

const NotFound = () => {
  return (
    <div className="PageNotFound">
      <MdError />

      <Typography>Page Not Found </Typography>
      <Link to="/">Home</Link>
    </div>
  );
};

export default NotFound;