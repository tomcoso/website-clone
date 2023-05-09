import Panel from "../../communities/components/Panel";
import CommLogo from "./CommLogo";
import styled from "styled-components";
import uniqid from "uniqid";
import { GoComment } from "react-icons/go";
import { HiOutlineArrowUturnRight, HiOutlineBookmark } from "react-icons/hi2";
import { RxDotsHorizontal } from "react-icons/rx";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

import { redirect, useLocation, useNavigate, useParams } from "react-router";
import {
  deletePost,
  downvote,
  removeVote,
  upvote,
} from "../../firebase/firebase.posts";
import { useDispatch, useSelector } from "react-redux";
import { setPath } from "../../redux/redirectSlice";
import { useEffect, useState } from "react";
import OptionsMenu from "./OptionsMenu";
import { deleteFileFromURL } from "../../firebase/firebase.storage";
import {
  deleteAllComments,
  getCommentCount,
} from "../../firebase/firebase.comments";

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
  cursor: pointer;
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
        props.vote === "up" ? "var(--accent)" : "currentColor"};
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
  border-radius: 5px;
  max-width: 94dvw;

  > div {
    background-color: var(--panel);
    padding-top: 0.5rem;
    border-radius: 5px;
  }

  > div:last-child {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-left: 0.5rem;
  }
`;

const Content = styled.div`
  font-size: 0.8rem;
  margin-right: 0.5rem;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  max-width: 550px;

  > span {
    position: absolute;
    top: 50%;
    transform: translateY(-100%);
    z-index: 1;

    padding: 0.4rem;
    aspect-ratio: 1/1;
    border-radius: 100%;
    background-color: white;
    cursor: pointer;
    box-shadow: black 1px 1px 10px -5px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  > span:first-child {
    left: 0.5rem;
    display: ${(p) => (p.slide === 0 ? "none" : "flex")};
  }

  > span:nth-child(2) {
    right: 0.5rem;
    display: ${(p) => (p.slide === p.length - 1 ? "none" : "flex")};
  }
`;

const ImageContainer = styled.div`
  display: grid;
  grid: 1fr / repeat(auto-fit, 550px);
  width: ${(p) => 550 * p.length + "px"};
  transform: translateX(${(p) => p.slide * -550 + "px"});
  transition: transform 300ms;
  user-select: none;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bg);
    max-width: 80dvw;

    > img {
      object-fit: contain;
      width: 100%;
    }
  }
`;

const PostPanel = ({ postData, commData }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [slide, setSlide] = useState(0);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

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

  const handlePostDeletion = async () => {
    try {
      await deleteAllComments(postData.id);
      await deletePost(postData.id, commData);
      if (postData.type === "image")
        await deleteFileFromURL(
          postData.content,
          postData.user.id,
          commData.name
        );
      setIsDeleted(true);
      if (params.postid) {
        redirect(`/c/${params.community}`);
      }
    } catch (err) {
      console.error("Unexpected error while attempting to delete post", err);
    }
  };

  useEffect(() => {
    (async () => {
      if (!postData) return;
      const count = await getCommentCount(postData.comments);
      setCommentCount(count);
    })();
  }, [postData]);

  return (
    <>
      {!isDeleted && (
        <MainPanel>
          <PanelWrap>
            <Upvotes vote={userVote}>
              <div onClick={handleUpvote}>
                <BiUpvote size={"1.4rem"} />
              </div>
              <span>
                {voteCount < 1000
                  ? voteCount
                  : (voteCount / 100).toFixed(1) + "k"}
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
              <Title
                onClick={() =>
                  !params.postid &&
                  navigate(`/c/${commData.name}/post/${postData.id}`)
                }
              >
                {postData.title}
              </Title>
              <Content slide={slide} length={postData.content.length}>
                {typeof postData.content === "string" ? (
                  <p>{postData.content}</p>
                ) : (
                  <>
                    <span onClick={() => setSlide((x) => (x > 0 ? x - 1 : x))}>
                      <AiOutlineLeft size={"1.5rem"} />
                    </span>
                    <span
                      onClick={() =>
                        setSlide((x) =>
                          x < postData.content.length - 1 ? x + 1 : x
                        )
                      }
                    >
                      <AiOutlineRight size={"1.5rem"} />
                    </span>
                    <ImageContainer
                      length={postData.content.length}
                      slide={slide}
                      onClick={() =>
                        !params.postid &&
                        navigate(`/c/${commData.name}/post/${postData.id}`)
                      }
                    >
                      {postData.content.map((x) => (
                        <div key={uniqid()}>
                          <img src={x} alt="post content" />
                        </div>
                      ))}
                    </ImageContainer>
                  </>
                )}
              </Content>
              <MenuBar onpost={!!params.postid}>
                <li
                  onClick={() =>
                    !params.postid &&
                    navigate(`/c/${commData.name}/post/${postData.id}`)
                  }
                >
                  <GoComment size={"1.2rem"} />
                  <span>{commentCount} Comments</span>
                </li>
                <li>
                  <HiOutlineArrowUturnRight size={"1.2rem"} />
                  <span>Share</span>
                </li>
                <li>
                  <HiOutlineBookmark size={"1.2rem"} />
                  <span>Save</span>
                </li>
                <li
                  onClick={() => setMenuDisplay((x) => !x)}
                  style={{ position: "relative" }}
                >
                  <RxDotsHorizontal size={"1.2rem"} />
                  {menuDisplay && (
                    <OptionsMenu
                      editAction={() => {}}
                      deleteAction={handlePostDeletion}
                      author={postData.user.id}
                      mods={commData.moderators}
                    />
                  )}
                </li>
              </MenuBar>
            </div>
          </PanelWrap>
        </MainPanel>
      )}
    </>
  );
};

export default PostPanel;
