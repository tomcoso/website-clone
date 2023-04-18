import styled from "styled-components";
import Panel from "../../communities/components/Panel";
import CreateComment from "./CreateComment";

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

const CommentSection = (postData) => {
  return (
    <SectionWrap>
      <Panel>
        <div>
          <CreateComment />
        </div>
      </Panel>
    </SectionWrap>
  );
};

export default CommentSection;
