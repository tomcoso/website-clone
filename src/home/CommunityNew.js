import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import Button from "../components/Button";
import ControlledInput from "../components/ControlledInput";
import { RxCross2 } from "react-icons/rx";
import { createCommunity } from "../firebase/firebase.communities";
import {
  ErrorMsg,
  handleCreationErrors,
} from "../communities/components/communityUtility";
import Panel from "../communities/components/Panel";

const Overlay = styled.section`
  display: ${(p) => p.display};
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 2;
  left: 0;
  right: 0;
  background-color: #00000088;
  place-content: center;
  padding: 1rem;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
`;

const CommunityNew = ({ display, hideAction }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [nsfwToggle, setNsfwToggle] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCommunity(name, nsfwToggle)
      .then((res) => {
        console.log("community created succesfully");
        navigate(`/c/${name}`);
      })
      .catch((error) => setError(error.message));
  };

  return (
    <Overlay display={display ? "grid" : "none"} onClick={hideAction}>
      <div>
        <Panel
          onClick={(e) => e.stopPropagation()}
          className="community-new-panel"
        >
          <div>
            <h2>Create a community</h2>
            <RxCross2 size={"1.8rem"} onClick={hideAction} />
          </div>
          <form onSubmit={handleSubmit}>
            <ControlledInput
              type="text"
              id="new-community-name"
              state={name}
              control={setName}
              required={true}
            >
              Name
              <span>
                Community names including capitalization cannot be changed.
              </span>
            </ControlledInput>
            <div>
              <Button
                action={() => setNsfwToggle(!nsfwToggle)}
                toggle={nsfwToggle}
              >
                NFSW
              </Button>
              {error !== "" && (
                <ErrorMsg>{handleCreationErrors(error)}</ErrorMsg>
              )}
              <Button type="submit" action={() => {}}>
                Create
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </Overlay>
  );
};

export default CommunityNew;
