import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Outlet } from "react-router";
import { login, logout } from "./auth/userSlice";
import Header from "./components/Header";
import { auth } from "./firebase.app";

function App() {
  // const update = useState(0)[1];
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
      dispatch(login({ username: user.displayName }));
    } else {
      dispatch(logout());
    }
  });

  useEffect(() => {
    if (pathname === "/" && !user.isLoggedIn) {
      navigate("/login");
    }
    if (
      (pathname === "/login" || pathname === "/register") &&
      !!user.isLoggedIn
    ) {
      navigate("/");
    }
  }, [pathname, navigate, user]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
