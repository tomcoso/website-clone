import styled from "styled-components";
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
        </div>
        <div>
          {postData.comments &&
            postData.comments.map((commentID) => (
              <Comment commentID={commentID} />
            ))}
        </div>
      </Panel>
    </SectionWrap>
  );
};

export default CommentSection;
