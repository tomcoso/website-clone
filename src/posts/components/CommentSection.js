import styled from "styled-components";
import "../styling/commentSection.scss";
import uniqid from "uniqid";
import Panel from "../../communities/components/Panel";
import CreateComment from "./CreateComment";
import Comment from "./Comment";
import {
  deleteComment,
  fetchPostComments,
} from "../../firebase/firebase.comments";
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

const CommentSection = ({ commData, postID }) => {
  const [comments, setComments] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await fetchPostComments(postID);
      setComments(data);
    })();
  }, [postID]);

  const handleNewCommentInsertion = (parentID, commentID) => {
    const parentIndex =
      parentID === postID ? -1 : comments.findIndex((x) => x.id === parentID);
    const parentIndent =
      parentID === postID ? -1 : comments[parentIndex].indent;
    const list = comments.slice();
    list.splice(parentIndex + 1, 0, {
      id: commentID,
      indent: parentIndent + 1,
    });
    setComments(list);
  };

  const handleCommentDeletion = async (commentID) => {
    await deleteComment(commentID, postID);
    const commentIndex = comments.findIndex((x) => x.id === commentID);
    const list = comments.slice();
    list.splice(commentIndex, 1);
    setComments(list);
  };

  return (
    <SectionWrap>
      <Panel>
        <div>
          <CreateComment
            parent={postID}
            commentType={"comment"}
            onSubmit={handleNewCommentInsertion}
          />
          <div className="separator"></div>
        </div>
        <div className="comments-wrap">
          {comments !== null &&
            comments.map((each) => (
              <Comment
                commentID={each.id}
                indentation={each.indent}
                key={uniqid()}
                onReply={handleNewCommentInsertion}
                mods={commData.moderators}
                onDelete={handleCommentDeletion}
              />
            ))}
        </div>
      </Panel>
    </SectionWrap>
  );
};

export default CommentSection;
