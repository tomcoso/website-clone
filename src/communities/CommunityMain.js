import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { getCommunity } from "../firebase.app";

const CommunityMain = () => {
  const commName = useParams().community;
  const user = useSelector((state) => state.user);

  const [commData, setCommData] = useState();

  useEffect(() => {
    (async () => {
      try {
        const data = await getCommunity(commName);
        console.log(data);
        setCommData(data);
      } catch (error) {
        console.log("404", error);
        setCommData(404);
      }
    })();
  }, [commName]);

  return (
    <main>
      {typeof commData === "object" ? (
        <>
          <h2>c/{commData.name}</h2>
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
