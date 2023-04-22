import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setPath } from "../../redux/redirectSlice";
import styled from "styled-components";

import EmojiPicker from "emoji-picker-react";
import GifPicker from "gif-picker-react";
import Button from "../../components/Button";
import { CiFaceSmile } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";
import { AiOutlineGif } from "react-icons/ai";

import { getTenorAPIKey } from "../../firebase/firebase.app";
import { createComment } from "../../firebase/firebase.comments";

const MainWrapper = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  > p {
    font-size: 0.75rem;
  }
`;

const ContentBox = styled.div`
  border: 1px solid var(--border);
  border-radius: 3px;
  position: relative;

  > textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    resize: vertical;
    border: none;
    height: 15ch;
    background-color: var(--panel);
    &:focus {
      border: none;
      outline: none;
    }
  }
`;

const CommentsBar = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
  background-color: var(--field);
  padding: 4px 8px;

  > .emoji-picker {
    position: absolute !important;
    bottom: 2rem;
    width: min-content;
  }

  > .gif-picker {
    position: absolute !important;
    bottom: 2rem;
    width: min-content;
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.5rem;
    border-radius: 100%;
    aspect-ratio: 1/1;
    cursor: pointer;
  }

  > div:first-child:is(:hover, :focus) {
    background-color: var(--bg);
  }
`;

const ImgContent = styled.div`
  padding: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    position: relative;
  }

  .cancel-gif-btn {
    border-radius: 100%;
    background-color: var(--panel);
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    aspect-ratio: 1/1;
    width: 1.5rem;
    height: 1.5rem;

    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover,
    &:focus {
      filter: brightness(120%);
    }
  }
`;

const CreateComment = ({ parent, commentType }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme);

  const [content, setContent] = useState("");
  const [type, setType] = useState("text");
  const [display, setDisplay] = useState(false);
  const [tenorKey, setTenorKey] = useState("");

  const handleSubmit = async () => {
    const commentRef = await createComment(
      user.uid,
      parent,
      content,
      type,
      commentType
    );
    return commentRef;
  };

  const handleEmojiSelection = (e) => {
    setDisplay(false);
    type !== "text" && setType("text");
    setContent((x) => x + e.emoji);
  };

  const handleGifSelection = (gif) => {
    setDisplay(false);
    type !== "img" && setType("img");
    setContent(gif);
  };

  useEffect(() => {
    (async () => {
      const key = await getTenorAPIKey();
      setTenorKey(key);
    })();
  }, []);

  return (
    <MainWrapper>
      <p>
        {user.isLoggedIn ? (
          <>
            {"Comment as "}
            <Link>{user.username}</Link>
          </>
        ) : (
          <>
            <Link
              to={"/login"}
              onClick={() => dispatch(setPath({ path: location.pathname }))}
            >
              Log in
            </Link>
            to comment
          </>
        )}
      </p>
      <ContentBox>
        {type === "text" ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onClick={() => setDisplay(false)}
            placeholder={"What are your thoughts?"}
          ></textarea>
        ) : (
          <ImgContent>
            <div>
              <div
                className="cancel-gif-btn"
                onClick={() => {
                  setContent("");
                  setType("text");
                }}
              >
                <RxCrossCircled size={"1.5rem"} />
              </div>
              <img src={content.url} alt={content.description} />
            </div>
          </ImgContent>
        )}

        <CommentsBar>
          {display === "emoji" && (
            <div className="emoji-picker">
              <EmojiPicker
                theme={theme}
                lazyLoadEmojis={true}
                onEmojiClick={handleEmojiSelection}
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
          {display === "gif" && (
            <div className="gif-picker">
              <GifPicker
                tenorApiKey={tenorKey}
                onGifClick={handleGifSelection}
              />
            </div>
          )}
          <div
            onClick={() => setDisplay((x) => (x === "emoji" ? false : "emoji"))}
          >
            <CiFaceSmile size={"1.5rem"} />
          </div>
          <div
            onClick={() => {
              tenorKey && setDisplay((x) => (x === "gif" ? false : "gif"));
            }}
          >
            <AiOutlineGif size={"1.5rem"} />
          </div>
          {commentType === "reply" && (
            <Button padding="3px 10px">Cancel</Button>
          )}
          <Button
            padding={"3px 10px"}
            disabled={!content}
            action={handleSubmit}
          >
            Comment
          </Button>
        </CommentsBar>
      </ContentBox>
    </MainWrapper>
  );
};

export default CreateComment;
