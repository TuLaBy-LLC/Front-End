import React from "react";
import { Navigate } from "react-router-dom";

export default function PageGuard({ children }) {
  return !(JSON.parse(sessionStorage.getItem("user")) ?? {}).token ? (
    <Navigate to="/" />
  ) : (
    children
  );
}
