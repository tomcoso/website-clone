import React from "react";
import ReactDOM from "react-dom/client";
import reduxStore from "./redux/reduxStore";
import { Provider } from "react-redux";
import Router from "./Router";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <Router />
    </Provider>
  </React.StrictMode>
);
