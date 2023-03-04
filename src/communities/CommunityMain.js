import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  getCommunity,
  updateMemberOfCommunity,
} from "../firebase/firebase.communities";
import Button from "../components/Button";
import "./styling/communityMain.scss";
import Panel from "./components/Panel";
import CreatePost from "./components/CreatePost";

const HeroSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Banner = styled.img`
  width: 100%;
  height: 20vh;
  object-fit: cover;
`;

const Profile = styled.div`
  max-height: 6rem;
  aspect-ratio: 1/1;
  transform: translateY(-25%);
  border-radius: 100%;
  overflow: hidden;

  img {
    height: 100%;
  }
`;

const CommunityMain = () => {
  const commName = useParams().community;
  const user = useSelector((state) => state.user);

  const [commData, setCommData] = useState();
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
  }, [commName, user, update]);

  // community hero panel (picture, name, r/name, join button)
  // post creation interface/ log in cta
  // sort posts panel
  // list of posts
  // right sidepanel with community description, creation date, and members info
  // back to top button on right side
  // left side panel with 'popular feeds' or communities user is subscribed to

  return (
    <main id="community-main">
      {typeof commData === "object" ? (
        <>
          <HeroSection>
            <Banner src={commData.settings.banner} alt="placeholder" />
            <div className="lower-hero">
              <div>
                <Profile>
                  <img src={commData.settings.profile} alt="logo" />
                </Profile>
                <div className="hero-titles">
                  <h2>{commData.name}</h2>
                  <p>c/{commData.name}</p>
                </div>
                <div className="hero-join">
                  <Button
                    action={async () => {
                      console.log(commData.members.includes(user.uid));
                      await updateMemberOfCommunity(
                        commData.name,
                        commData.members.includes(user.uid) ? "leave" : "join"
                      );
                      forceUpdate(Math.random());
                    }}
                  >
                    {commData.members.includes(user.uid) ? "Joined" : "Join"}
                  </Button>
                </div>
              </div>
            </div>
          </HeroSection>
          <section className="body-section">
            <div className="post-column">
              <CreatePost />
            </div>
            <div className="side-column">
              <Panel>Description</Panel>
            </div>
          </section>

          <p>
            You are {commData.moderators.includes(user.uid) ? "a" : "not a"}{" "}
            moderator
            {/* {commData.moderators.includes(user.uid) ? (
              <Button action={() => unmakeUserMod(commData.name, user.uid)}>
                Unmod
              </Button>
            ) : (
              <Button action={() => makeUserMod(commData.name, user.uid)}>
                Mod
              </Button>
            )} */}
          </p>
        </>
      ) : commData === 404 ? (
        <p>
          This community does not exist! You should head{" "}
          <Link to="/">back</Link> now.
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
};

export default CommunityMain;
