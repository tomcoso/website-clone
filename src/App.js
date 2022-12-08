import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Outlet } from "react-router";
import { login, logout } from "./auth/userSlice";
import Header from "./components/Header";
import "./style.scss";
import { auth } from "./firebase.app";

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        login({
          username: user.displayName,
          email: user.email,
          uid: user.uid,
        })
      );
    } else {
      dispatch(logout());
    }
  });

  useEffect(() => {
    if (pathname === "/" && !user.isLoggedIn) {
      navigate("/login");
    }
    if (pathname === "/login" && !!user.isLoggedIn) {
      navigate("/");
    }
    if (
      pathname === "/register" &&
      auth.currentUser &&
      !!auth.currentUser.emailVerified
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
