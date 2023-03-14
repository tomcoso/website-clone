import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { addImg } from "../../redux/draftSlice";
import uniqid from "uniqid";
import styled from "styled-components";
import { IoIosAdd } from "react-icons/io";

const DisplayImage = styled.div`
  width: 5.5rem;
  height: 5.5rem;
  aspect-ratio: 1/1;
  padding: 0.3rem;
  border: ${(props) =>
    props.last ? "1px dashed var(--field)" : "2px solid var(--border)"};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover,
  &:focus {
    border: ${(props) =>
      props.last ? "1px dashed var(--action)" : "2px solid var(--border)"};
  }
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageDrop = styled.div`
  border: ${(props) =>
    props.fileHover ? "2px dashed var(--action)" : "1px solid var(--border)"};
`;

const ImagePost = ({ user }) => {
  const [content, setContent] = useState([]);
  const [fileHover, setFileHover] = useState(false);
  const draft = useSelector((state) => state.draft);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const handleFileDrop = (e) => {
    e.preventDefault();
    [...e.dataTransfer.items].forEach((item) => {
      if (item.kind !== "file") return;
      dispatch(addImg({ uid: user.uid, image: item.getAsFile() }));
    });
  };

  const handleFileInput = (e) => {
    console.log(e);
    [...e.target.files].forEach((file) => {
      dispatch(addImg({ uid: user.uid, image: file }));
    });
  };

  useEffect(() => {
    if (draft && !draft.content) return;
    setContent(draft.content);
  }, [draft]);

  return (
    <ImageDrop
      className="image-drop-wrap"
      onDrop={(e) => {
        handleFileDrop(e);
        setFileHover(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setFileHover(true)}
      onDragLeave={() => setFileHover(false)}
      fileHover={fileHover}
    >
      {content.length > 0 ? (
        content.map((x, i) => {
          return (
            <>
              <DisplayImage key={uniqid()}>
                <img src={x} alt="display selected" />
              </DisplayImage>
              {i === content.length - 1 && (
                <label htmlFor="image-drop">
                  <DisplayImage last>
                    <IoIosAdd
                      size={"2.5rem"}
                      color={theme === "dark" ? "#272729" : "#f6f7f8"}
                    />
                  </DisplayImage>
                </label>
              )}
            </>
          );
        })
      ) : (
        <>
          <p>
            Drag and drop images or{" "}
            <Button>
              <label htmlFor="image-drop">Upload</label>
            </Button>
          </p>
        </>
      )}
      <input
        id="image-drop"
        type={"file"}
        multiple
        accept={"image/*, video/*"}
        onChange={handleFileInput}
      />
    </ImageDrop>
  );
};

export default ImagePost;
