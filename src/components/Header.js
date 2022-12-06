import { useSelector } from "react-redux";
import { logout } from "../firebase.app";
const Header = () => {
  const user = useSelector((state) => state.user);

  return (
    <header>
      <button onClick={logout}>Log out</button>
      <p>{user.username}</p>
    </header>
  );
};

export default Header;
