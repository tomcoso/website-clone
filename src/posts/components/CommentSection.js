import styled from "styled-components";
import "../styling/commentSection.scss";
import uniqid from "uniqid";
import Panel from "../../communities/components/Panel";
import CreateComment from "./CreateComment";
import Comment from "./Comment";
import { fetchPostComments } from "../../firebase/firebase.comments";
import { useEffect, useState } from "react";

const SectionWrap = styled.div`
  padding-top: 0.5rem;
  background-color: var(--bg);

  > div {
    > div {
      display: flex;
      flex-direction: column;
      gap: 0rem;
    }
  }
`;

const CommentSection = ({ postData, postID }) => {
  const [comments, setComments] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await fetchPostComments(postID);
      console.log(data);
      setComments(data);
    })();
  }, [postID]);

  return (
    <SectionWrap>
      <Panel>
        <div>
          <CreateComment parent={postID} commentType={"comment"} />
          <div className="separator"></div>
        </div>
        <div className="comments-wrap">
          {comments !== null &&
            comments.map((each) => (
              <Comment
                commentID={each.id}
                indentation={each.indent}
                key={uniqid()}
              />
            ))}
        </div>
      </Panel>
    </SectionWrap>
  );
};

export default CommentSection;
