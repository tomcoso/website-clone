import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { getCommunity, makeUserMod } from "../firebase.app";
import { useEffect, useState } from "react";
import Panel from "./components/Panel";
import Button from "../components/Button";
import MemberList from "./components/MemberList";
import uniqid from "uniqid";

const CommunityAdmin = () => {
  const user = useSelector((state) => state.user);
  const commName = useParams().community;
  const [commData, setCommData] = useState(null);
  const [update, forceUpdate] = useState();

  useEffect(() => {
    (async () => {
      try {
        const data = await getCommunity(commName);
        setCommData(data);
      } catch (error) {
        console.log("404", error);
        setCommData(404);
      }
    })();
  }, [commName, setCommData, update]);

  return (
    <main>
      {commData ? (
        <div>
          {commData.moderators.includes(user.uid) ? (
            <>
              <Panel>Moderators Control Panel</Panel>
              <Panel>
                <h4>Members</h4>
                <ul>
                  {commData.members.map((x) => (
                    <MemberList
                      uid={x}
                      key={uniqid()}
                      status={
                        commData.moderators.includes(x) ? "Moderator" : "Member"
                      }
                      community={commName}
                      update={() => forceUpdate(Math.random())}
                    />
                  ))}
                </ul>
              </Panel>
              <Panel>
                <h4>Blacklisted Users</h4>
                <ul>
                  {commData.blacklist.map((x) => (
                    <MemberList
                      uid={x}
                      key={uniqid()}
                      status={"Blacklisted"}
                      community={commName}
                      update={() => forceUpdate(Math.random())}
                    />
                  ))}
                </ul>
              </Panel>
            </>
          ) : (
            <Panel>
              Oops! Seems like you do not have access to this community's
              moderation panel.
              <Button action={() => makeUserMod(commName, user.uid)}>
                Mod
              </Button>
            </Panel>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
};

export default CommunityAdmin;
