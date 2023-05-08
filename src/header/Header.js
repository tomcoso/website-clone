import { useSelector, useDispatch } from "react-redux";
import { change } from "../redux/themeSlice";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router";
import logo from "../assets/media/coralit-logo.png";
import { useEffect, useState } from "react";
import {
  getAllCommunities,
  getCommunity,
} from "../firebase/firebase.communities";
import DropDownNav from "./DropDownNav";
import "./header.scss";
import { getUserDoc } from "../firebase/firebase.app";
import UserDropDown from "./UserDropDown";

const HeaderElem = styled.header`
  width: 100svw;
  height: max(6svh, 3rem);
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-start;
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
      if (!user) return;
      const userDoc = await getUserDoc(user.uid);
      const userData = userDoc.data();
      if (userData && theme === userData.settings.theme) return;
      dispatch(change());
    })();
  }, [user, dispatch, theme]);

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

      <UserDropDown />
    </HeaderElem>
  );
};

export default Header;
