import { useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  getCommunity,
  makeUserMod,
  updateSettings,
} from "../firebase/firebase.communities";
import { useEffect, useState } from "react";
import Panel from "./components/Panel";
import Button from "../components/Button";
import MemberList from "./components/MemberList";
import uniqid from "uniqid";
import styled from "styled-components";
import "./styling/communityAdmin.scss";
import { Link } from "react-router-dom";

const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
`;

const ColumnWrap = styled.div`
  display: grid;
  grid: var(--column-grid);
  gap: 1rem;
`;

const SettingsWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  gap: 0.5rem;
`;

const SettingItem = styled.div`
  display: flex;
  background-color: var(--field);
  flex-direction: row;
  padding: 0.5rem;
  gap: 1rem;
`;

const CommunityAdmin = () => {
  const user = useSelector((state) => state.user);
  const commName = useParams().community;
  const [commData, setCommData] = useState(null);
  const [update, forceUpdate] = useState();

  const [nsfw, setNsfw] = useState();
  const [banner, setBanner] = useState();
  const [profile, setProfile] = useState();
  const [changes, setChanges] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCommunity(commName);
        setCommData(data);
        setNsfw(data.settings.nsfw);
        setBanner(data.settings.banner);
        setProfile(data.settings.profile);
      } catch (error) {
        console.log("404", error);
        setCommData(404);
      }
    })();
  }, [commName, setCommData, update]);

  const handleSettingsUpdate = async () => {
    const settings = { banner, nsfw, profile };
    await updateSettings(commData.name, settings);
    forceUpdate(Math.random());
    setChanges(false);
  };

  useEffect(() => {
    if (
      commData === null ||
      (commData &&
        commData.settings.nsfw === nsfw &&
        commData.settings.banner === banner &&
        commData.settings.profile === profile)
    ) {
      setChanges((x) => (x ? false : x));
      return;
    }
    setChanges((x) => (x ? x : true));
  }, [nsfw, banner, profile, commData]);

  return (
    <main id="community-admin">
      {commData ? (
        <div>
          {commData.moderators.includes(user.uid) ? (
            <>
              <Panel>
                <Link to={`/c/${commName}`}>
                  <h3>c/{commName}</h3>
                </Link>
                <p>Moderators Control Panel</p>
              </Panel>
              <ColumnWrap>
                <Column>
                  <Panel>
                    <h4>Members</h4>
                    <ul>
                      {commData.members.map((x) => (
                        <MemberList
                          uid={x}
                          key={uniqid()}
                          status={
                            commData.moderators.includes(x)
                              ? "Moderator"
                              : "Member"
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
                      {commData.blacklist.length > 0 ? (
                        commData.blacklist.map((x) => (
                          <MemberList
                            uid={x}
                            key={uniqid()}
                            status={"Blacklisted"}
                            community={commName}
                            update={() => forceUpdate(Math.random())}
                          />
                        ))
                      ) : (
                        <p>Great! No banned users ...</p>
                      )}
                    </ul>
                  </Panel>
                </Column>
                <Column>
                  <Panel>
                    <h4>Community Settings</h4>
                    <SettingsWrap>
                      <SettingItem>
                        <p>Change Banner Image</p>
                        <input
                          type={"file"}
                          accept={".jpg,.jpeg,.png"}
                          onChange={(e) => setBanner(e.target.files[0])}
                        />
                      </SettingItem>
                      <SettingItem>
                        <p>Change Community Profile Picture</p>
                        <input
                          type={"file"}
                          accept={".jpg,.jpeg,.png"}
                          onChange={(e) => setProfile(e.target.files[0])}
                        />
                      </SettingItem>
                      <SettingItem>
                        <p>Adult Content</p>
                        <input
                          type="checkbox"
                          checked={!!nsfw}
                          onChange={() => setNsfw(!nsfw)}
                        />
                      </SettingItem>
                    </SettingsWrap>
                    <Button action={handleSettingsUpdate} disabled={!changes}>
                      Submit Changes
                    </Button>
                  </Panel>
                </Column>
              </ColumnWrap>
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
