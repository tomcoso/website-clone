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
  width: max(50%, 450px);
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
  flex-direction: column;
  padding: 0.5rem;
  gap: 0.5rem;
`;

const MenuItem = styled.li`
  list-style-type: none;
  font-weight: bold;
  border-bottom: ${(props) =>
      props.selected ? "var(--action)" : "var(--field)"}
    2px solid;
  padding: 0.25rem;
  cursor: pointer;
`;

const ViewWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const CommunityAdmin = () => {
  const user = useSelector((state) => state.user);
  const commName = useParams().community;
  const [commData, setCommData] = useState(null);
  const [update, forceUpdate] = useState();

  const [changes, setChanges] = useState(false);
  const [settings, setSettings] = useState({
    title: "",
    desc: "",
    banner: "",
    profile: "",
    nsfw: "",
  });

  const [view, setView] = useState("settings");

  useEffect(() => {
    (async () => {
      try {
        const data = await getCommunity(commName);
        setCommData(data);
        setSettings(data.settings);
      } catch (error) {
        console.log("404", error);
        setCommData(404);
      }
    })();
  }, [commName, update]);

  const handleSettingsUpdate = async () => {
    await updateSettings(commData.name, settings);
    forceUpdate(Math.random());
    setChanges(false);
  };

  const deepEqual = (first, second) => {
    for (const key of Object.keys(first)) {
      if (first[key] !== second[key]) {
        return false;
      }
      continue;
    }
    return true;
  };

  useEffect(() => {
    if (
      commData === null ||
      (commData && deepEqual(commData.settings, settings))
    ) {
      setChanges(false);
      return;
    }
    setChanges(true);
  }, [settings, commData]);

  return (
    <main id="community-admin">
      {commData ? (
        <div>
          {commData.moderators.includes(user.uid) ? (
            <>
              <Panel>
                <Link to={`/c/${commName}`} className={"to-menu"}>
                  <h3>{commData.settings.title}</h3>
                  <p>c/{commData.name}</p>
                </Link>
                <p>Moderators Control Panel</p>
                <ul id="admin-views">
                  <MenuItem
                    selected={view === "settings"}
                    onClick={() => setView("settings")}
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    selected={view === "members"}
                    onClick={() => setView("members")}
                  >
                    Members
                  </MenuItem>
                </ul>
              </Panel>
              <ViewWrap>
                {view === "settings" ? (
                  <Column>
                    <Panel>
                      <h4>Community Settings</h4>
                      <SettingsWrap>
                        <SettingItem>
                          <label htmlFor="change-comm-title">
                            Change Community Title
                          </label>
                          <input
                            type={"text"}
                            id="change-comm-title"
                            value={settings.title}
                            onChange={(e) =>
                              setSettings((x) =>
                                Object.assign({}, x, {
                                  title: e.target.value,
                                })
                              )
                            }
                          />
                        </SettingItem>
                        <SettingItem>
                          <label htmlFor="change-comm-desc">
                            Change Community Description
                          </label>
                          <textarea
                            id="change-comm-desc"
                            value={settings.desc}
                            onChange={(e) =>
                              setSettings((x) =>
                                Object.assign({}, x, {
                                  desc: e.target.value,
                                })
                              )
                            }
                          />
                        </SettingItem>
                        <SettingItem>
                          <label htmlFor="change-comm-banner">
                            Change Banner Image
                          </label>
                          <input
                            id="change-comm-banner"
                            type={"file"}
                            accept={".jpg,.jpeg,.png"}
                            onChange={(e) => {
                              setSettings((x) =>
                                Object.assign({}, x, {
                                  banner:
                                    e.target.files.length === 0
                                      ? commData.settings.banner
                                      : e.target.files[0],
                                })
                              );
                            }}
                          />
                        </SettingItem>
                        <SettingItem>
                          <label htmlFor="change-comm-profile">
                            Change Community Profile Picture
                          </label>
                          <input
                            id="change-comm-profile"
                            type={"file"}
                            accept={".jpg,.jpeg,.png"}
                            onChange={(e) =>
                              setSettings((x) =>
                                Object.assign({}, x, {
                                  profile:
                                    e.target.files.length === 0
                                      ? commData.settings.profile
                                      : e.target.files[0],
                                })
                              )
                            }
                          />
                        </SettingItem>
                        <SettingItem>
                          <label htmlFor="change-comm-nsfw">
                            Adult Content
                          </label>
                          <input
                            id="change-comm-nsfw"
                            type="checkbox"
                            checked={!!settings.nsfw}
                            onChange={() =>
                              setSettings((x) =>
                                Object.assign({}, x, {
                                  nsfw: !settings.nsfw,
                                })
                              )
                            }
                          />
                        </SettingItem>
                      </SettingsWrap>
                      <Button action={handleSettingsUpdate} disabled={!changes}>
                        Submit Changes
                      </Button>
                    </Panel>
                  </Column>
                ) : (
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
                )}
              </ViewWrap>
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
