import Panel from "./Panel";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { HiOutlineLink } from "react-icons/hi";
import { CiImageOn } from "react-icons/ci";

const FakeInput = styled.div`
  width: 100%;
  background-color: var(--field);
  color: var(--contrast-trans50);
  border: var(--border) solid 1px;
  padding: 8px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  &:hover,
  &:focus {
    background-color: var(--panel);
    border: var(--action) solid 1px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

const Pfp = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  background-color: var(--field);

  > img {
    transform: translate(-10%, -15%);
    width: 2.6rem;
    object-fit: contain;
    object-position: center;
  }
`;

const CreatePost = () => {
  const navigate = useNavigate();
  return (
    <Panel>
      <Wrapper>
        <Pfp>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/coralit-media.appspot.com/o/avatar-final.png?alt=media&token=c69f65a1-722f-4696-8826-ad25d8e1f604"
            alt="user profile"
          />
        </Pfp>
        <FakeInput onClick={() => navigate("submit")}>Create Post</FakeInput>
        <CiImageOn size={"1.8rem"} />
        <HiOutlineLink size={"1.7rem"} />
      </Wrapper>
    </Panel>
  );
};

export default CreatePost;
