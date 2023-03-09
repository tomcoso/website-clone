import { useSelector, useDispatch } from "react-redux";
import { change } from "../redux/themeSlice";
import { logout } from "../firebase/firebase.app";
import styled from "styled-components";
import Button from "./Button";
import { useLocation, useNavigate } from "react-router";
import { setPath } from "../redux/redirectSlice";

const HeaderElem = styled.header`
  width: 100svw;
  height: 8svh;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: spaced-evenly;
  background-color: var(--panel);
`;

const Header = () => {
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const location = useLocation();

  const navigate = useNavigate();

  return (
    <HeaderElem>
      {user.isLoggedIn ? (
        <Button action={logout}>Log out</Button>
      ) : (
        <Button
          action={() => {
            dispatch(setPath({ path: location.pathname }));
            navigate("/login");
          }}
        >
          Log In
        </Button>
      )}
      <p>{user.username}</p>
      <Button action={() => dispatch(change())}>Theme ({theme})</Button>
    </HeaderElem>
  );
};

export default Header;
