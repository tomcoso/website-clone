import { useSelector } from "react-redux";
import { logout } from "../firebase.app";
import styled from "styled-components";

const HeaderElem = styled.header`
  width: 100vw;
  height: 8vh;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: spaced-evenly;
  background-color: grey;
`;

const Header = () => {
  const user = useSelector((state) => state.user);

  return (
    <HeaderElem>
      {user.isLoggedIn && <button onClick={logout}>Log out</button>}
      <p>{user.username}</p>
    </HeaderElem>
  );
};

export default Header;
