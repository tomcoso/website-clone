import Panel from "../../communities/components/Panel";
import CommLogo from "./CommLogo";
import styled from "styled-components";
import { GoComment } from "react-icons/go";
import { HiOutlineArrowUturnRight, HiOutlineBookmark } from "react-icons/hi2";
import { RxDotsHorizontal } from "react-icons/rx";

import { useNavigate, useParams } from "react-router";

const MainPanel = styled(Panel)`
  padding: 0.5rem 0 0 2.5rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
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
  padding: 0.5rem 0.5rem 0 0;
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

const PostPanel = ({ postData, commData }) => {
  const navigate = useNavigate();
  const params = useParams();

  return (
    <MainPanel>
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
            <span>
              {postData.upvotes.length} Comment
              {postData.upvotes.length > 1 ? "s" : ""}
            </span>
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
    </MainPanel>
  );
};

export default PostPanel;
