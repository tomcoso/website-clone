import Button from "../components/Button";
import CreatePost from "../communities/components/CreatePost";
import Post from "../posts/components/Post";
import Panel from "../communities/components/Panel";
import { HiOutlineFire } from "react-icons/hi";
import { IoIosPodium } from "react-icons/io";
import { TiStarburstOutline } from "react-icons/ti";

import uniqid from "uniqid";
import "./styling/home.scss";

import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { feedPosts } from "../firebase/firebase.posts";

const Home = () => {
  const navigate = useNavigate();
  const [feed, setFeed] = useState();
  const [sort, setSort] = useState("hot");

  useEffect(() => {
    (async () => {
      try {
        const data = await feedPosts(sort);
        setFeed(data);
      } catch (err) {
        console.error("Unexpected error fetching feed: ", err);
      }
    })();
  }, [sort]);

  return (
    <main id="home-main">
      <section className="body-section">
        <div className="post-column">
          <CreatePost />
          <Panel>
            <ul className="sort-selector">
              <li
                onClick={() => setSort("hot")}
                className={sort === "hot" ? "selected" : ""}
              >
                <HiOutlineFire size={"1.5rem"} />
                Hot
              </li>
              <li
                onClick={() => setSort("top")}
                className={sort === "top" ? "selected" : ""}
              >
                <IoIosPodium size={"1.5rem"} />
                Top
              </li>
              <li
                onClick={() => setSort("new")}
                className={sort === "new" ? "selected" : ""}
              >
                <TiStarburstOutline size={"1.5rem"} />
                New
              </li>
            </ul>
          </Panel>
          {feed && feed.map((x) => <Post postID={x.id} key={uniqid()} />)}
        </div>
        <div className="side-column">
          <Panel className="side-info">
            <h2>Home</h2>
            <p>
              Your personal Coralit frontpage. Come here to check in with your
              favourite communities
            </p>
            <Button action={() => navigate("new-community")}>
              Create Community
            </Button>
            <Button action={() => navigate("submit")}>Create Post</Button>
          </Panel>
        </div>
      </section>
    </main>
  );
};

export default Home;
