import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reduxStore from "./redux/reduxStore";
import { Provider } from "react-redux";
import { Route, createRoutesFromElements, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import CommunityMain from "./communities/CommunityMain";
import Home from "./home/Home";
import SubmitPost from "./posts/SubmitPost";
import CommunityAdmin from "./communities/CommunityAdmin";
import PostMain from "./posts/PostMain";

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="submit" element={<SubmitPost />} />
      <Route path="c">
        <Route path=":community">
          <Route index element={<CommunityMain />} />
          <Route path="submit" element={<SubmitPost />} />
          <Route path="admin" element={<CommunityAdmin />} />
          <Route path="post">
            <Route path=":postid" element={<PostMain />} />
          </Route>
        </Route>
      </Route>
      <Route path="u">
        <Route path=":userid" />
      </Route>
    </Route>
  )
);

root.render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
