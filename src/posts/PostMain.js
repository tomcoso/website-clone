import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getCommunity } from "../firebase/firebase.communities";
import { getPost } from "../firebase/firebase.posts";
import Panel from "../communities/components/Panel";
import "./styling/postMain.scss";
import { PostPanel } from "./components/Post";
import CommentSection from "./components/CommentSection";

const PostMain = () => {
  const [postData, setPostData] = useState();
  const [commData, setCommData] = useState();

  const { postid, community } = useParams();

  useEffect(() => {
    (async () => {
      const data = await getPost(postid, community);
      setPostData(data);
      const comm = await getCommunity(community);
      setCommData(comm);
    })();
  }, [postid, community]);

  return (
    <main id="post-main">
      {postData && commData ? (
        <>
          <div id="post-main-grid">
            <div>
              <PostPanel postData={postData} commData={commData} />
              <CommentSection postData={postData} />
            </div>
            <div>
              <Panel>
                <p>c/{commData.name}</p>
                <p>{commData.description || "No community description"}</p>
              </Panel>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>Loading...</p>
        </>
      )}
    </main>
  );
};

export default PostMain;
