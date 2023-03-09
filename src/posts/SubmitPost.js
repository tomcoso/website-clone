import Panel from "../communities/components/Panel";
import { useState, useEffect } from "react";
import "./SubmitPost.scss";
import { useNavigate, useParams } from "react-router";
import {
  addPostToCommunity,
  getCommunity,
} from "../firebase/firebase.communities";
import Button from "../components/Button";
import NoCommunity from "../components/NoCommunity";
import { createPost } from "../firebase/firebase.posts";

const SubmitPost = () => {
  const commName = useParams().community;
  const [commData, setCommData] = useState();
  const navigate = useNavigate();

  // const [type, setType] = useState("post");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nsfw, setNsfw] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCommunity(commName);
        setCommData(data);
      } catch (error) {
        console.log("404", error);
        setCommData(404);
      }
    })();
  }, [commName]);

  const isValid = () => {
    return title.match(/(.+\s){2,}.+[\W\s]*/g);
  };

  const handleSubmit = async () => {
    if (!isValid()) return;
    let postID;
    let error;
    await createPost(title, content, commName, nsfw)
      .then((res) => (postID = res))
      .catch((err) => (error = err));
    if (error) return;
    await addPostToCommunity(commName, postID);
    navigate(`/c/${commName}/post/${postID}`);
  };

  return (
    <main id="community-submit">
      {typeof commData === "object" ? (
        <div className="panel-wrap">
          <Panel>
            <ul className="submit-form">
              <li>
                <input
                  id="post-title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  placeholder="Title"
                  aria-label="Title"
                ></input>
              </li>
              <li>
                <textarea
                  id="post-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Text (optional)"
                  aria-label="Content (text)"
                ></textarea>
              </li>
              <li>
                <Button toggle={!!nsfw} action={() => setNsfw((x) => !x)}>
                  + NSFW
                </Button>
              </li>
              <li>
                <Button action={() => navigate(`/c/${commName}`)}>
                  Cancel
                </Button>
                <Button disabled={!isValid()} action={handleSubmit}>
                  Post
                </Button>
              </li>
            </ul>
          </Panel>
          <div className="side-panel-wrap">
            <Panel>
              <h3>{commName}</h3>
              <p>{commData && commData.settings.desc}</p>
            </Panel>
            <Panel>
              <div className="rules-header">
                <h3>Posting to Coralit</h3>
              </div>
              <ul className="coralit-rules">
                <li>1. Remember the human</li>
                <li>2. Behave like you would in real life</li>
                <li>3. Look for the original source of content</li>
                <li>4. Search for duplicates before posting</li>
                <li>5. Read the community's rules</li>
              </ul>
            </Panel>
          </div>
        </div>
      ) : commData === 404 ? (
        <NoCommunity />
      ) : (
        <p>Loading ...</p>
      )}
    </main>
  );
};

export default SubmitPost;
