import React from "react";

export default function LoadingComponent({ active = true }) {
  return (
    <div className={`loading-parent ${active || "clear-loader"}`} style={{zIndex:"5"}}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export const LoadingSpinner = ({ active, visible, color = "#000" }) => {
  return (
    <div
      style={{ borderColor: `${color} #0000` }}
      className={`loader ${!visible && "d-none"} ${active || "clear-loader"}`}
    ></div>
  );
};
