import Panel from "./Panel";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import { HiOutlineLink } from "react-icons/hi";
import { MdOutlineImage } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { setPath } from "../../redux/redirectSlice.js";

const FakeInput = styled.div`
  width: 100%;
  background-color: var(--field);
  color: var(--contrast-trans50);
  border: var(--border) solid 1px;
  padding: 8px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover,
  &:focus {
    background-color: var(--panel);
    border: var(--accent) solid 1px;
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

const IconWrap = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 7px;
  &:hover,
  &:focus {
    background-color: var(--field);
  }
`;

const CreatePost = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleClick = () => {
    if (user.isLoggedIn) {
      navigate("submit");
    } else {
      dispatch(setPath({ path: location.pathname }));
      navigate("/login");
    }
  };
  return (
    <Panel>
      <Wrapper>
        <Pfp>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/coralit-media.appspot.com/o/avatar-final.png?alt=media&token=c69f65a1-722f-4696-8826-ad25d8e1f604"
            alt="user profile"
          />
        </Pfp>
        <FakeInput onClick={handleClick}>Create Post</FakeInput>
        <IconWrap onClick={handleClick}>
          <MdOutlineImage size={"1.5rem"} />
        </IconWrap>
        <IconWrap onClick={handleClick}>
          <HiOutlineLink size={"1.5rem"} />
        </IconWrap>
      </Wrapper>
    </Panel>
  );
};

export default CreatePost;
