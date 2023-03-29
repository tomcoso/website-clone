import Panel from "../../communities/components/Panel";
import CommLogo from "./CommLogo";
import styled from "styled-components";
import { GoComment } from "react-icons/go";
import { HiOutlineArrowUturnRight, HiOutlineBookmark } from "react-icons/hi2";
import { RxDotsHorizontal } from "react-icons/rx";
import { BiUpvote, BiDownvote } from "react-icons/bi";

import { useLocation, useNavigate, useParams } from "react-router";
import { downvote, removeVote, upvote } from "../../firebase/firebase.posts";
import { useDispatch, useSelector } from "react-redux";
import { setPath } from "../../redux/redirectSlice";
import { useState } from "react";

const MainPanel = styled(Panel)`
  padding: 0;
`;

const Comm = styled.div`
  font-size: 0.8rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;

  > p {
    font-weight: bold;
    cursor: pointer;
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }

  > span {
    opacity: 30%;
    cursor: pointer;
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
`;

const Title = styled.h1`
  font-size: 1.2rem;
`;

const Content = styled.div`
  font-size: 0.8rem;
`;

const MenuBar = styled.ul`
  padding-right: 0.5rem 0.5rem 0 0;
  display: flex;
  gap: 1rem;

  > li {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;

    font-size: 0.7rem;
    font-weight: bold;
    opacity: 50%;
    cursor: pointer;

    &:hover,
    &:focus {
      background-color: var(--bg);
    }

    &:first-child {
      padding: 0.25rem 0;
      cursor: ${(props) => (props.onpost ? "auto" : "pointer")};
      &:hover,
      &:focus {
        background-color: ${(props) =>
          props.onpost ? "var(--panel)" : "var(--bg)"};
      }
    }
  }
`;

const Upvotes = styled.li`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;

  > span {
    font-weight: bold;
    font-size: 0.8rem;
  }

  > div {
    aspect-ratio: 1/1;
    height: 1.5rem;
    cursor: pointer;
    border-radius: 2px;
    text-align: center;

    &:is(:hover, :focus) {
      background-color: var(--bg);
    }

    &:first-child svg {
      fill: ${(props) =>
        props.vote === "up" ? "var(--action)" : "currenColor"};
    }
    &:last-child svg {
      fill: ${(props) =>
        props.vote === "down" ? "var(--action)" : "currentColor"};
    }
  }
`;

const PanelWrap = styled.div`
  padding-left: 2.5rem;
  position: relative;
  background-color: var(--field);

  > div {
    background-color: var(--panel);
    padding-top: 0.5rem;
  }

  > div:last-child {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-left: 0.5rem;
  }
`;

const PostPanel = ({ postData, commData }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [voteCount, setVoteCount] = useState(
    postData.upvotes.length - postData.downvotes.length
  );
  const [userVote, setUserVote] = useState(
    postData.upvotes.includes(user.uid)
      ? "up"
      : postData.downvotes.includes(user.uid)
      ? "down"
      : "novote"
  );

  const checkLogin = () => {
    if (!user.isLoggedIn) {
      dispatch(setPath({ path: location.pathname }));
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleUpvote = () => {
    if (!checkLogin()) return;
    if (userVote === "up") {
      setUserVote("novote");
      removeVote(postData.id, user.uid);
      setVoteCount((x) => x - 1);
      return;
    }
    setVoteCount((x) => (userVote === "down" ? x + 2 : x + 1));
    setUserVote("up");
    upvote(postData.id, user.uid);
  };

  const handleDownvote = () => {
    if (!checkLogin()) return;
    if (userVote === "down") {
      setUserVote("novote");
      setVoteCount((x) => x + 1);
      removeVote(postData.id, user.uid);
      return;
    }
    setVoteCount((x) => (userVote === "up" ? x - 2 : x - 1));
    setUserVote("down");
    downvote(postData.id, user.uid);
  };

  return (
    <MainPanel>
      <PanelWrap>
        <Upvotes vote={userVote}>
          <div onClick={handleUpvote}>
            <BiUpvote size={"1.4rem"} />
          </div>
          <span>
            {voteCount < 1000 ? voteCount : (voteCount / 100).toFixed(1) + "k"}
          </span>
          <div onClick={handleDownvote}>
            <BiDownvote size={"1.4rem"} />
          </div>
        </Upvotes>
        <div>
          <Comm>
            <CommLogo url={commData.settings.profile} />
            <p onClick={() => navigate(`/c/${commData.name}`)}>
              c/{commData.name}
            </p>
            <span onClick={() => console.log("TODO refer to post profile")}>
              Posted by u/{postData.user.username}
            </span>
          </Comm>
          <Title>{postData.title}</Title>
          <Content>
            {typeof postData.content === "string" ? (
              <p>{postData.content}</p>
            ) : (
              <div>
                {postData.content.map((x) => (
                  <div>
                    <img src={x} alt="post content" />
                  </div>
                ))}
              </div>
            )}
          </Content>
          <MenuBar onpost={!!params.postid}>
            <li onClick={() => console.log(!!params.postid)}>
              <GoComment size={"1.2rem"} />
              <span>{postData.comments.length} Comments</span>
            </li>
            <li>
              <HiOutlineArrowUturnRight size={"1.2rem"} />
              <span>Share</span>
            </li>
            <li>
              <HiOutlineBookmark size={"1.2rem"} />
              <span>Save</span>
            </li>
            <li>
              <RxDotsHorizontal size={"1.2rem"} />
            </li>
          </MenuBar>
        </div>
      </PanelWrap>
    </MainPanel>
  );
};

export default PostPanel;
