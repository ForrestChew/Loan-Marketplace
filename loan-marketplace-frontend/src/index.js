import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MetaMaskProvider } from "metamask-react";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <MetaMaskProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MetaMaskProvider>
  // </React.StrictMode>
);
