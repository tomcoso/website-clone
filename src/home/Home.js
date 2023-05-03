import { useNavigate } from "react-router";
import uniqid from "uniqid";
import Button from "../components/Button";
import CreatePost from "../communities/components/CreatePost";
import Post from "../posts/components/Post";
import Panel from "../communities/components/Panel";
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
      <h1>Home page</h1>
      <Button action={() => navigate("new-community")}>Create Community</Button>
      <section className="body-section">
        <div className="post-column">
          <Panel>
            <ul>
              <li onClick={() => setSort("hot")}>Hot</li>
              <li onClick={() => setSort("top")}>Top</li>
              <li onClick={() => setSort("new")}>New</li>
            </ul>
          </Panel>
          <CreatePost />
          {feed && feed.map((x) => <Post postID={x.id} key={uniqid()} />)}
        </div>
        <div className="side-column">
          <Panel>Description</Panel>
        </div>
      </section>
    </main>
  );
};

export default Home;
