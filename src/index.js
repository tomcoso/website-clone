import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reduxStore from "./redux/reduxStore";
import { Provider } from "react-redux";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import CommunityMain from "./communities/CommunityMain";
import Home from "./home/Home";
import SubmitPost from "./communities/SubmitPost";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="c">
              <Route path=":community">
                <Route index element={<CommunityMain />} />
                <Route path="submit" element={<SubmitPost />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
