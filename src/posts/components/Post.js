import PostPanel from "./PostPanel";
import { getPost } from "../../firebase/firebase.posts";
import { getCommunity } from "../../firebase/firebase.communities";
import { useEffect, useState } from "react";

const Post = ({ postID, commName }) => {
  const [postData, setPostData] = useState();
  const [commData, setCommData] = useState();

  useEffect(() => {
    (async () => {
      const data = await getPost(postID);
      setPostData(data);
      const comm = await getCommunity(data.community);
      setCommData(comm);
    })();
  }, [postID, commName]);

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
