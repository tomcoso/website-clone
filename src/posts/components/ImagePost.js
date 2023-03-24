import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { addImg, removeImg } from "../../redux/draftSlice";
import uniqid from "uniqid";
import styled from "styled-components";
import { IoIosAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useEffect } from "react";

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
  position: relative;

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

  > div.remove-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    border-radius: 100%;
    height: 1.7rem;
    aspect-ratio: 1/1;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover,
    &:focus {
      background-color: #fff8;
    }

    &:active {
      transform: translateY(1px);
    }
  }
`;

const ImageDrop = styled.div`
  border: ${(props) =>
    props.fileHover ? "2px dashed var(--action)" : "1px solid var(--border)"};
`;

const ImagePost = ({ user }) => {
  const [fileHover, setFileHover] = useState(false);
  const [loading, setLoading] = useState(false);

  const draft = useSelector((state) => state.draft);
  const theme = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(false);
  }, [draft]);

  const handleFileDrop = async (e) => {
    e.preventDefault();
    if (
      draft.content !== null &&
      draft.content.length + e.dataTransfer.items.length > 5
    )
      return;
    setLoading(true);
    [...e.dataTransfer.items].forEach((item) => {
      if (item.kind !== "file") return;
      dispatch(addImg({ uid: user.uid, image: item.getAsFile() }));
    });
  };

  const handleFileInput = (e) => {
    if (
      draft.content !== null &&
      draft.content.length + e.target.files.length > 5
    )
      return;
    setLoading(true);
    [...e.target.files].forEach((file) => {
      dispatch(addImg({ uid: user.uid, image: file }));
    });
  };

  const handleRemove = async (url) => {
    dispatch(removeImg({ url, uid: user.uid }));
  };

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
      {draft.content !== null && draft.content.length > 0 ? (
        <div>
          {draft.content.map((x) => {
            return (
              <DisplayImage key={uniqid()}>
                <img src={x} alt="display selected" />
                <div className="remove-icon" onClick={() => handleRemove(x)}>
                  <RxCross2 size={"1.5rem"} />
                </div>
              </DisplayImage>
            );
          })}

          <label htmlFor="image-drop">
            <DisplayImage last>
              <IoIosAdd
                size={"2.5rem"}
                color={theme === "dark" ? "#272729" : "#f6f7f8"}
              />
            </DisplayImage>
          </label>
        </div>
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
      <div className={`loading-bar${loading ? " active" : ""}`}>
        <div />
      </div>
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
