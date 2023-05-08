import { useEffect, useState } from "react";
import uniqid from "uniqid";
import { RiArrowDownSLine } from "react-icons/ri";
import { AiFillHome } from "react-icons/ai";
import DropDownItem from "./DropDownItem";
import CommLogo from "../posts/components/CommLogo";
import { useParams } from "react-router";

const DropDownNav = ({ communities, current }) => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  useEffect(() => {
    setOpen(false);
  }, [params]);

  return (
    <div className="drop-down-nav">
      <div className="current-position" onClick={() => setOpen((x) => !x)}>
        <div>
          {current ? (
            <CommLogo url={current.settings.profile} size={"1.8rem"} />
          ) : (
            <AiFillHome size={"1.8rem"} />
          )}
          <span>{current ? current.name : "Home"}</span>
        </div>
        <RiArrowDownSLine size={"1.2rem"} />
      </div>
      {open && (
        <div className="comms-list">
          {communities &&
            communities.map(
              (x) =>
                (!current || x !== current.name) && (
                  <DropDownItem commName={x} key={uniqid()} />
                )
            )}
        </div>
      )}
    </div>
  );
};

export default DropDownNav;
