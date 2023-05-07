import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { getCommunity } from "../firebase/firebase.communities";
import { getPost } from "../firebase/firebase.posts";
import Panel from "../communities/components/Panel";
import "./styling/postMain.scss";
import { PostPanel } from "./components/Post";
import CommentSection from "./components/CommentSection";
import CommLogo from "./components/CommLogo";
import { format } from "date-fns";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { setPath } from "../redux/redirectSlice";
import { updateMemberOfCommunity } from "../firebase/firebase.communities";

const PostMain = () => {
  const [postData, setPostData] = useState();
  const [commData, setCommData] = useState();

  const user = useSelector((state) => state.user);
  const { postid, community } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const data = await getPost(postid, community);
      setPostData(data);
      const comm = await getCommunity(community);
      setCommData(comm);
      document.title = data.title;
    })();
  }, [postid, community]);

  const handleJoinButton = () => {
    if (!user.isLoggedIn) {
      dispatch(setPath(location.pathname));
      navigate(`/login`);
      return;
    }
    if (commData.members.includes(user.uid)) return;
    updateMemberOfCommunity(user.uid, "join");
  };

  return (
    <main id="post-main">
      {postData && commData ? (
        <>
          <div id="post-main-grid">
            <div>
              <PostPanel postData={postData} commData={commData} />
              <CommentSection commData={commData} postID={postid} />
            </div>
            <div className="side-panel">
              <Panel className="description">
                <span
                  className="logo"
                  onClick={() => navigate(`/c/${commData.name}`)}
                >
                  <CommLogo url={commData.settings.profile} size="3rem" />
                  <p>c/{commData.name}</p>
                </span>
                <span className="desc">
                  <p>
                    Created {format(commData.timestamp.toDate(), "MMM d, y")}
                  </p>
                  <p>{commData.settings.desc || "No community description"}</p>
                </span>
                <span className="join">
                  <span>
                    <p>{commData.members.length}</p>
                    <p>Members</p>
                  </span>
                  <Button action={handleJoinButton}>
                    {commData.members.includes(user.uid) ? "Joined" : "Join"}
                  </Button>
                </span>
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
