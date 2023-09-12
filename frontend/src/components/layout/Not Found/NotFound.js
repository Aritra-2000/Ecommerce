import React from "react";
import "./NotFound.css";
import { Link } from "react-router-dom";
import { MdError } from "react-icons/md";
import { Typography } from "@mui/material";

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