import { useDispatch, useSelector } from "react-redux";
import { updateContent } from "../../redux/draftSlice";

const TextPost = () => {
  const draft = useSelector((state) => state.draft);
  const dispatch = useDispatch();

  return (
    <>
      <textarea
        id="post-content"
        value={draft.content || ""}
        onChange={(e) => dispatch(updateContent(e.target.value))}
        placeholder="Text (optional)"
        aria-label="Content (text)"
      ></textarea>
    </>
  );
};

export default TextPost;
