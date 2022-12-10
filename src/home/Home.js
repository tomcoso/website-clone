import { useState } from "react";
import CommunityNew from "../communities/CommunityNew";
import Button from "../components/Button";

const Home = () => {
  const [displayCommCreation, setDisplayCommCreation] = useState(false);

  return (
    <main>
      {displayCommCreation && (
        <CommunityNew close={() => setDisplayCommCreation(false)} />
      )}
      <h1>Home page</h1>
      <Button action={() => setDisplayCommCreation(true)}>
        Create Community
      </Button>
    </main>
  );
};

export default Home;
