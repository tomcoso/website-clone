import { useEffect, useState } from "react";
import styled from "styled-components";
import { getComment } from "../../firebase/firebase.comments";
import CreateComment from "./CreateComment";

const VerticalWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const Pfp = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  background-color: var(--field);

  > img {
    transform: translate(-10%, -15%);
    width: 2.6rem;
    object-fit: contain;
    object-position: center;
  }
`;

const Comment = ({ commentID }) => {
  const [commentData, setCommentData] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getComment(commentID);
      setCommentData(data);
    })();
  }, [commentID]);

  return (
    <VerticalWrap>
      {commentData && (
        <>
          <div>
            <Pfp>
              <img
                src={
                  "https://firebasestorage.googleapis.com/v0/b/coralit-media.appspot.com/o/avatar-final.png?alt=media&token=c69f65a1-722f-4696-8826-ad25d8e1f604"
                }
                alt={"user " + commentData.user + " profile"}
              />
            </Pfp>
          </div>
          <div>
            <div>{commentData.content}</div>
          </div>
          <CreateComment parent={commentID} commentType={"reply"} />
        </>
      )}
    </VerticalWrap>
  );
};

export default Comment;
