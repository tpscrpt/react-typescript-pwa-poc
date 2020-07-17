import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}

const wrapper = document.getElementById("app");
ReactDOM.render(<App />, wrapper);
