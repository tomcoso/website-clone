import { useSelector, useDispatch } from "react-redux";
import { change } from "../redux/themeSlice";
import { logout } from "../firebase/firebase.users";
import styled from "styled-components";
import Button from "./Button";
import { useLocation, useNavigate } from "react-router";
import { setPath } from "../redux/redirectSlice";
import logo from "../assets/media/coralit-logo.png";

const HeaderElem = styled.header`
  width: 100svw;
  height: 8svh;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: spaced-evenly;
  background-color: var(--panel);
`;

const HeaderLogo = styled.span`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0 1.5rem;
  cursor: pointer;

  > div {
    height: 3.5dvh;

    > img {
      object-fit: contain;
      height: 100%;
    }
  }

  > h1 {
    font-size: 1.8rem;
    font-family: "Fredoka", sans-serif;
    font-weight: 400;
    line-height: 100%;
    transform: translateY(-1px);
  }
`;

const Header = () => {
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const location = useLocation();

  const navigate = useNavigate();

  return (
    <HeaderElem>
      <HeaderLogo onClick={() => navigate("/")}>
        <div>
          <img src={logo} alt="coralit logo" />
        </div>
        <h1>coralit</h1>
      </HeaderLogo>
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
