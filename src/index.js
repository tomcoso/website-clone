import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reduxStore from "./reduxStore";
import { Provider } from "react-redux";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import CommunityMain from "./communities/CommunityMain";
import CommunityNew from "./communities/CommunityNew";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<p>INDEX</p>} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="c">
              <Route path=":community" element={<CommunityMain />} />
              <Route path="new" element={<CommunityNew />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
