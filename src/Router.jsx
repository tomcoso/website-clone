import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import App from "./App";

import Login from "./auth/Login";
import Register from "./auth/Register";

import CommunityMain from "./communities/CommunityMain";
import CommunityAdmin from "./communities/CommunityAdmin";

import Home from "./home/Home";

import SubmitPost from "./posts/SubmitPost";
import PostMain from "./posts/PostMain";

const Router = () => {
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

  return <RouterProvider router={router} />;
};

export default Router;
