import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Outlet } from "react-router";
import { login, logout } from "./redux/userSlice";
import Header from "./components/Header";
import "./style.scss";
import { auth } from "./firebase.app";
import styled from "styled-components";

const Container = styled.div`
  --contrast: ${(props) => (props.theme === "dark" ? "#edeff1" : "#030303")};
  --contrast-trans50: ${(props) =>
    props.theme === "dark" ? "#edeff180" : "#03030380"};
  --bg: ${(props) => (props.theme === "dark" ? "#030303" : "#dae0e6")};
  --accent: coral;
  --border: #343536;
  --action: ${(props) => (props.theme === "dark" ? "#d7dadc" : "#009ad5")};
  --field: ${(props) => (props.theme === "dark" ? "#272729" : "#f6f7f8")};
  --panel: ${(props) => (props.theme === "dark" ? "#1a1a1b" : "#ffffff")};
  height: 100vh;
`;

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme);
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
    // if (pathname === "/" && !user.isLoggedIn) {
    //   navigate("/login");
    // }
    if (
      pathname === "/register" &&
      auth.currentUser &&
      !!auth.currentUser.emailVerified
    ) {
      navigate("/");
    }
  }, [pathname, navigate, user]);

  return (
    <Container theme={theme}>
      <Header />
      <Outlet />
    </Container>
  );
}

export default App;
