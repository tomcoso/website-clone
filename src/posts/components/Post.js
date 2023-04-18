import { useParams } from "react-router";
import PostPanel from "./PostPanel";
import { getPost } from "../../firebase/firebase.posts";
import { getCommunity } from "../../firebase/firebase.communities";
import { useEffect, useState } from "react";

const Post = ({ postID }) => {
  const { community } = useParams();

  const [postData, setPostData] = useState();
  const [commData, setCommData] = useState();

  useEffect(() => {
    (async () => {
      const data = await getPost(postID, community);
      setPostData(data);
      const comm = await getCommunity(community);
      setCommData(comm);
    })();
  }, [postID, community]);

  return (
    <>
      {postData && commData && (
        <PostPanel postData={postData} commData={commData}></PostPanel>
      )}
    </>
  );
};

export default Post;
export { PostPanel };
