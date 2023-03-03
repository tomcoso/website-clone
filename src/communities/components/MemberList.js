import { useEffect, useState } from "react";
import {
  banUser,
  makeUserMod,
  unbanUser,
} from "../../firebase/firebase.communities";
import { getUserDoc } from "../../firebase/firebase.app";
import styled from "styled-components";
import Button from "../../components/Button";

const Item = styled.li`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--field);
  border-bottom: 1px solid var(--accent);

  > p:first-child {
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

const MemberList = ({ uid, status, community, update }) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await getUserDoc(uid);
        setUserData(data.data());
      } catch (error) {
        console.log("404", error);
        setUserData(404);
      }
    })();
  }, [uid, setUserData]);

  return (
    <Item>
      <p>{userData ? userData.username : "..."}</p>
      <p>{status}</p>
      <Button action={() => console.log("TODO")}>Posts</Button>
      <Button action={() => console.log("TODO")}>Comments</Button>
      {status !== "Blacklisted" ? (
        <>
          <Button
            action={async () => {
              await banUser(community, uid);
              update();
            }}
            disabled={status === "Moderator"}
          >
            Ban
          </Button>
          <Button
            action={async () => {
              await makeUserMod(community, uid);
              update();
            }}
            disabled={status === "Moderator"}
          >
            Make Moderator
          </Button>
        </>
      ) : (
        <Button
          action={async () => {
            await unbanUser(community, uid);
            update();
          }}
        >
          Unban
        </Button>
      )}
    </Item>
  );
};

export default MemberList;
