import { useState } from "react";
// import { useSelector } from "react-redux";

const TextPost = ({ user }) => {
  const [content, setContent] = useState("");
  //   const draft = useSelector((state) => state.draft);

  return (
    <textarea
      id="post-content"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Text (optional)"
      aria-label="Content (text)"
    ></textarea>
  );
};

export default TextPost;
