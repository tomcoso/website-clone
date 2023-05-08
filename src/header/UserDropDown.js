import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import { logout, updateUserSettings } from "../firebase/firebase.users";

import { setPath } from "../redux/redirectSlice";
import { change } from "../redux/themeSlice";

import { RiArrowDownSLine } from "react-icons/ri";
import { HiSun, HiOutlineSun, HiOutlineCog6Tooth } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { IoExitOutline } from "react-icons/io5";

import styled from "styled-components";

const Pfp = styled.div`
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 100%;
  background-color: var(--field);
  cursor: pointer;

  > img {
    transform: translate(-10%, -15%);
    width: 1.6rem;
    object-fit: contain;
    object-position: center;
  }
`;

const UserDropDown = () => {
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLoginClick = () => {
    dispatch(setPath(location.pathname));
    navigate("/login");
  };

  const handleThemeChange = async () => {
    if (user) {
      await updateUserSettings(user.uid, {
        theme: theme === "light" ? "dark" : "light",
      });
    }
    dispatch(change());
  };

  const handleLogOutClick = () => {
    logout();
  };

  return (
    <div className="user-drop-down">
      <div
        className="user-current"
        onClick={user.isLoggedIn ? () => setOpen((x) => !x) : handleLoginClick}
      >
        <Pfp>
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/coralit-media.appspot.com/o/avatar-final.png?alt=media&token=c69f65a1-722f-4696-8826-ad25d8e1f604"
            }
            alt={"user " + user.username + " profile"}
          />
        </Pfp>
        <p>{user.isLoggedIn ? `u/${user.username}` : "Log In"}</p>
        {user.isLoggedIn && <RiArrowDownSLine size={"1.2rem"} />}
      </div>
      {open && (
        <div className="user-menu">
          <div>
            <CgProfile size={"1.3rem"} /> <p>Profile</p>
          </div>
          <div>
            <HiOutlineCog6Tooth size={"1.4rem"} />
            <p>Settings</p>
          </div>
          <div onClick={handleThemeChange}>
            {theme === "light" ? (
              <HiOutlineSun size={"1.4rem"} />
            ) : (
              <HiSun size={"1.4rem"} />
            )}
            <p>{theme[0].toUpperCase() + theme.slice(1)} theme</p>
          </div>
          <span className="separator" />
          <div onClick={handleLogOutClick}>
            <IoExitOutline size={"1.4rem"} />
            <p>Log Out</p>
          </div>
          <p>2023 Tomas Dessy © All rights reserved.</p>
        </div>
      )}
    </div>
  );
};

export default UserDropDown;
