import { useSelector, useDispatch } from "react-redux";
import { change } from "../redux/themeSlice";
import { logout } from "../firebase.app";
import styled from "styled-components";
import Button from "./Button";
import { useNavigate } from "react-router";

const HeaderElem = styled.header`
  width: 100vw;
  height: 8vh;
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

  const navigate = useNavigate();

  return (
    <HeaderElem>
      {user.isLoggedIn ? (
        <Button action={logout}>Log out</Button>
      ) : (
        <Button action={() => navigate("/")}>Log In</Button>
      )}
      <p>{user.username}</p>
      <Button action={() => dispatch(change())}>Theme ({theme})</Button>
    </HeaderElem>
  );
};

export default Header;
