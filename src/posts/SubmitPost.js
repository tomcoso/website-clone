// COMPONENTS
import Panel from "../communities/components/Panel";
import ImagePost from "./components/ImagePost";
import TextPost from "./components/TextPost";
import Button from "../components/Button";

// CSS
import "./styling/submitPost.scss";
import styled from "styled-components";

// REACT
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import uniqid from "uniqid";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  clear,
  updateTitle,
  updateNSFW,
  updateContent,
  updateType,
} from "../redux/draftSlice";

// FIREBASE
import {
  addPostToCommunity,
  getAllCommunities,
  getCommunity,
} from "../firebase/firebase.communities";
import { createPost } from "../firebase/firebase.posts";
import { getDraft, updateDraft } from "../firebase/firebase.app";
import { deleteDraftFiles } from "../firebase/firebase.storage";

const Nav = styled.nav`
  display: flex;
  align-items: center;
  padding: 0.5rem;

  > select {
    height: 2rem;
    padding: 0.25rem;
    margin-left: auto;
    border-radius: 4px;
    width: 50%;
    font-size: 0.9rem;
    font-weight: bold;
    &:hover,
    &:focus {
      outline: none;
    }

    > option {
      font-size: 0.9rem;
      padding: 0.25rem;
    }
  }
`;

const NavItem = styled.div`
  border-bottom: 2px solid
    ${(props) => (props.selected ? "var(--accent)" : "var(--border)")};
  padding: 1rem;
  justify-self: flex-start;
`;

const SubmitPost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const commName = useParams().community || "No Community";

  const [commData, setCommData] = useState();

  const user = useSelector((state) => state.user);
  const draft = useSelector((state) => state.draft);

  const [commsList, setCommsList] = useState([]);

  // fetch community data
  useEffect(() => {
    (async () => {
      if (commName === "No Community") return;
      try {
        const data = await getCommunity(commName);
        setCommData(data);
      } catch (error) {
        console.log("404", error);
        setCommData(404);
      }
    })();
  }, [commName]);

  // gets draft from firebase and sets it on redux state
  useEffect(() => {
    const applyState = (data) => {
      dispatch(updateTitle(data.title || ""));
      dispatch(updateNSFW(data.nsfw));
      dispatch(updateType(data.type || "post"));
      dispatch(updateContent(data.content));
    };

    (async () => {
      if (!user.uid) return;
      const draft = await getDraft(user.uid);
      applyState(draft);
    })();
  }, [user, dispatch]);

  useEffect(() => {
    (async () => {
      const data = await getAllCommunities();
      setCommsList(data);
      document.title = "Submit post";
    })();
  }, []);

  const isValid = () =>
    typeof draft.title === "string" &&
    draft.title.match(/(.+\s){2,}.+[\W\s]*/g);

  const handleSubmit = async () => {
    if (!isValid()) return;
    let postID;
    try {
      await createPost(
        draft.title,
        draft.content,
        commName,
        draft.nsfw,
        draft.type
      ).then((res) => (postID = res));
      await addPostToCommunity(commName, postID);
      navigate(`/c/${commName}/post/${postID}`);
      updateDraft(
        { type: "post", content: "", title: "", nsfw: false },
        user.uid
      );
      dispatch(clear());
    } catch (error) {
      console.error("Error while trying to create post", error);
    }
  };

  // on cancel it saves the draft on firestore and clears state
  const handleCancel = () => {
    updateDraft(draft, user.uid);
    dispatch(clear());
    commName === "No Community" ? navigate(`/`) : navigate(`/c/${commName}`);
  };

  const handleTitleChange = (e) => {
    dispatch(updateTitle(e.target.value));
  };

  const handleNsfwChange = () => {
    dispatch(updateNSFW(!draft.nsfw));
  };

  const handleTypeChange = (newval) => {
    if (draft.type === newval) return;
    if (draft.type === "image")
      deleteDraftFiles(draft.content, user.uid, commName);
    dispatch(updateType(newval));
    const newDraft = {
      ...draft,
      content: newval === "post" ? "" : [],
      type: newval,
    };
    updateDraft(newDraft, user.uid);
  };

  const handleCommSelection = (e) => {
    if (e.target.value === "Select Community") {
      navigate("/submit");
      return;
    }
    navigate(`/c/${e.target.value}/submit`);
  };

  return (
    <main id="community-submit">
      <div className="panel-wrap">
        <Panel>
          <Nav>
            <NavItem
              selected={draft.type === "post"}
              onClick={() => handleTypeChange("post")}
            >
              Post
            </NavItem>
            <NavItem
              selected={draft.type === "image"}
              onClick={() => handleTypeChange("image")}
            >
              Image
            </NavItem>
            <select defaultValue={commName} onChange={handleCommSelection}>
              {commName === "No Community" ? (
                <option>Select Community</option>
              ) : (
                <>
                  <option>{commName}</option>
                  <option>Select Community</option>
                </>
              )}
              {commsList.map((x) =>
                commName === x ? "" : <option key={uniqid()}>{x}</option>
              )}
            </select>
          </Nav>
          <ul className="submit-form">
            <li>
              <input
                id="post-title"
                type={"text"}
                onChange={handleTitleChange}
                value={draft.title}
                placeholder="Title"
                aria-label="Title"
              ></input>
            </li>
            <li>
              {draft.type === "post" ? (
                <TextPost />
              ) : (
                <ImagePost user={user} commName={commName} />
              )}
            </li>
            <li>
              <Button toggle={!!draft.nsfw} action={handleNsfwChange}>
                + NSFW
              </Button>
            </li>
            <li>
              <Button action={handleCancel}>Cancel</Button>
              <Button disabled={!isValid()} action={handleSubmit}>
                Submit
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
    </main>
  );
};

export default SubmitPost;
