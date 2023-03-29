import { useNavigate } from "react-router";
import PostPanel from "./PostPanel";

const Post = ({ postID }) => {
  const navigate = useNavigate();
  return (
    // <PostPanel>
    <p onClick={() => navigate(`post/${postID}`)}>POST {postID}</p>
    // </PostPanel>
  );
};

export default Post;
export { PostPanel };
