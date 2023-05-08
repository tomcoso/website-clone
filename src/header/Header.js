import { useSelector, useDispatch } from "react-redux";
import { change } from "../redux/themeSlice";
import { logout } from "../firebase/firebase.users";
import styled from "styled-components";
import Button from "../components/Button";
import { useLocation, useNavigate, useParams } from "react-router";
import { setPath } from "../redux/redirectSlice";
import logo from "../assets/media/coralit-logo.png";
import { useEffect, useState } from "react";
import {
  getAllCommunities,
  getCommunity,
} from "../firebase/firebase.communities";
import DropDownNav from "./DropDownNav";
import "./header.scss";

const HeaderElem = styled.header`
  width: 100svw;
  height: max(6svh, 3rem);
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
  padding: 0 1.5vw;
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

  const [allComms, setAllComms] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const params = useParams();

  useEffect(() => {
    (async () => {
      const data = await getAllCommunities();
      setAllComms(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (params.community) {
        const data = await getCommunity(params.community);
        setCurrentPage(data);
        return;
      }
      setCurrentPage(null);
    })();
  }, [params]);

  return (
    <HeaderElem id="header">
      <HeaderLogo onClick={() => navigate("/")}>
        <div>
          <img src={logo} alt="coralit logo" />
        </div>
        <h1>coralit</h1>
      </HeaderLogo>

      <DropDownNav communities={allComms} current={currentPage} />

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
