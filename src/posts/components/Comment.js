import styled from "styled-components";
import uniqid from "uniqid";
import { useEffect, useState } from "react";
import {
  downvoteComment,
  getComment,
  upvoteComment,
} from "../../firebase/firebase.comments";
import { formatDistanceToNowStrict } from "date-fns";
import { useNavigate } from "react-router";

import CreateComment from "./CreateComment";
import { BiDownvote, BiUpvote } from "react-icons/bi";
import { useSelector } from "react-redux";
import { GoComment } from "react-icons/go";
import { RxDotsHorizontal } from "react-icons/rx";

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const Pfp = styled.div`
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 100%;
  background-color: var(--field);
  cursor: pointer;

  > img {
    transform: translate(-10%, -15%);
    width: 1.6rem;
    object-fit: contain;
    object-position: center;
  }
`;

const CommentLine = styled.div`
  height: 100%;
  width: 2px;
  background-color: var(${(p) => (p.theme === "light" ? "--bg" : "--field")});
`;

const truncateDate = (date) => {
  const index = date.search(/\s/);
  const newDate = date.slice(0, index) + date.slice(index + 1, index + 2);
  return newDate;
};

const Comment = ({ commentID, indentation, onReply }) => {
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme);

  const [commentData, setCommentData] = useState(null);
  const [replySection, setReplySection] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [lastVote, setLastVote] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await getComment(commentID);
      setCommentData(data);
      setUpvotes(data.upvotes.length - data.downvotes.length);
      setLastVote(
        data.upvotes.includes(user.uid)
          ? "up"
          : data.downvotes.includes(user.uid)
          ? "down"
          : "none"
      );
    })();
  }, [commentID, user]);

  const handleUpvote = () => {
    if (lastVote === "up") {
      setLastVote("none");
      setUpvotes((x) => x - 1);
      return;
    }
    upvoteComment(commentID, user.uid);
    lastVote === "down" ? setUpvotes((x) => x + 2) : setUpvotes((x) => x + 1);
    setLastVote("up");
  };

  const handleDownvote = () => {
    if (lastVote === "down") {
      setLastVote("none");
      setUpvotes((x) => x + 1);
      return;
    }
    downvoteComment(commentID, user.uid);
    lastVote === "up" ? setUpvotes((x) => x - 2) : setUpvotes((x) => x - 1);
    setLastVote("down");
  };

  return (
    <Wrap>
      {commentData && (
        <>
          {indentation > 0 && (
            <div
              className="indent-parent-line"
              style={{
                width: `calc(${(1.4 * indentation).toFixed(1)}rem - ${
                  2 * indentation
                }px)`,
              }}
            >
              {Array(indentation)
                .fill("")
                .map((x) => (
                  <CommentLine
                    theme={theme}
                    className="comment-line"
                    key={uniqid()}
                  >
                    {x}
                  </CommentLine>
                ))}
            </div>
          )}

          <div className="comment-parent-line">
            <Pfp onClick={() => navigate(`/u/${commentData.user}`)}>
              <img
                src={
                  "https://firebasestorage.googleapis.com/v0/b/coralit-media.appspot.com/o/avatar-final.png?alt=media&token=c69f65a1-722f-4696-8826-ad25d8e1f604"
                }
                alt={"user " + commentData.user + " profile"}
              />
            </Pfp>
            <CommentLine theme={theme} className="comment-line" />
          </div>

          <div className="comment-main-content">
            <div className="comment-info">
              <span onClick={() => navigate(`/u/${commentData.user}`)}>
                u/{commentData.username}
              </span>
              <span>
                {truncateDate(
                  formatDistanceToNowStrict(commentData.timestamp.toDate())
                )}
              </span>
            </div>
            <div className="comment-content">
              {commentData.type === "text" ? (
                <div>{commentData.content}</div>
              ) : (
                <>
                  <img
                    src={commentData.content.url}
                    alt={commentData.content.description}
                  />
                  <div>
                    {commentData.content.description} by{" "}
                    <a
                      href={commentData.content.tenorUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Tenor
                    </a>
                  </div>
                </>
              )}
            </div>
            <div className="comment-menu">
              <div className="upvotes">
                <span className={lastVote === "up" ? "selected" : ""}>
                  <BiUpvote size={"1.2rem"} onClick={handleUpvote} />
                </span>
                <p>{upvotes}</p>
                <span className={lastVote === "down" ? "selected" : ""}>
                  <BiDownvote size={"1.2rem"} onClick={handleDownvote} />
                </span>
              </div>

              <div
                className="reply-button"
                onClick={() => setReplySection((x) => !x)}
              >
                <GoComment size={"1.2rem"} />
                <span>Reply</span>
              </div>

              <div className="menu-button">
                <RxDotsHorizontal size={"1.2rem"} />
              </div>
            </div>

            {replySection && (
              <div className="comment-reply">
                {replySection && (
                  <div className="create-reply">
                    <div className="comment-parent-line">
                      <CommentLine theme={theme} className="comment-line" />
                    </div>
                    <CreateComment
                      parent={commentID}
                      commentType={"reply"}
                      cancel={() => setReplySection(false)}
                      onSubmit={onReply}
                    />
                  </div>
                )}

                {commentData.replies.map((commentID) => (
                  <Comment key={uniqid()} commentID={commentID} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Wrap>
  );
};

export default Comment;
