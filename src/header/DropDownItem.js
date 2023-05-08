import { useEffect, useState } from "react";
import CommLogo from "../posts/components/CommLogo";
import { getCommunity } from "../firebase/firebase.communities";
import { useNavigate } from "react-router";

const Item = ({ commName }) => {
  const [commData, setCommData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await getCommunity(commName);
      setCommData(data);
    })();
  }, [commName]);

  return (
    <div className="drop-down-item" onClick={() => navigate(`/c/${commName}`)}>
      {commData && <CommLogo url={commData.settings.profile} size="1rem" />}
      <p>c/{commName}</p>
    </div>
  );
};

export default Item;
