import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/css/styles.min.css";
import "jquery/dist/jquery.slim.js";
import "bootstrap/dist/js/bootstrap.bundle.js";

// import i18n (needs to be bundled ;))
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
