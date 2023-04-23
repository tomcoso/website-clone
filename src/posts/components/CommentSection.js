import styled from "styled-components";
import "../styling/commentSection.scss";
import uniqid from "uniqid";
import Panel from "../../communities/components/Panel";
import CreateComment from "./CreateComment";
import Comment from "./Comment";

const SectionWrap = styled.div`
  padding-top: 0.5rem;
  background-color: var(--bg);

  > div {
    > div {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
`;

const CommentSection = ({ postData, postID }) => {
  return (
    <SectionWrap>
      <Panel>
        <div>
          <CreateComment parent={postID} commentType={"comment"} />
          <div className="separator"></div>
        </div>
        <div className="comments-wrap">
          {postData.comments &&
            postData.comments.map((commentID) => (
              <Comment commentID={commentID} key={uniqid()} />
            ))}
        </div>
      </Panel>
    </SectionWrap>
  );
};

export default CommentSection;
