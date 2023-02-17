import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getCommunity } from "../firebase.app";
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

const CommunityMain = (props) => {
  const commName = useParams().community;
  const user = useSelector((state) => state.user);

  const [commData, setCommData] = useState();

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
  }, [commName]);

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
            <Banner
              src="https://firebasestorage.googleapis.com/v0/b/coralit-media.appspot.com/o/elementor-placeholder-image.png?alt=media&token=0747eb9b-2505-4bd5-868a-482b0b2576ae"
              alt="placeholder"
            />
            <div className="lower-hero">
              <div>
                <div className="logo-container">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/coralit-media.appspot.com/o/Cnobg.png?alt=media&token=9b94b7e9-47bc-42a8-ba0f-0c8e6bd304bd"
                    alt="logo"
                  />
                </div>
                <div className="hero-titles">
                  <h2>{commData.name}</h2>
                  <p>c/{commData.name}</p>
                </div>
                <div className="hero-join">
                  <Button>JOIN</Button>
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
            You are{" "}
            {commData.moderators.find((x) => x === user.uid) ? "a" : "not a"}{" "}
            moderator
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
