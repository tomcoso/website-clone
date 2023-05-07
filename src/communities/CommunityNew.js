import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import Button from "../components/Button";
import ControlledInput from "../components/ControlledInput";
import { createCommunity } from "../firebase/firebase.communities";
import { ErrorMsg, handleCreationErrors } from "./components/communityUtility";
import Panel from "./components/Panel";

const Section = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const CommunityNew = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [nsfwToggle, setNsfwToggle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Create new community";
  }, []);

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
    <Section>
      <Panel>
        <h2>Create a community</h2>
        <form onSubmit={handleSubmit}>
          <ControlledInput
            type="text"
            id="new-community-name"
            state={name}
            control={setName}
            required={true}
          >
            Community Name
          </ControlledInput>
          <Button action={() => setNsfwToggle(!nsfwToggle)} toggle={nsfwToggle}>
            NFSW
          </Button>
          {error !== "" && <ErrorMsg>{handleCreationErrors(error)}</ErrorMsg>}
          <Button type="submit" action={() => {}}>
            Create
          </Button>
        </form>
        <Button action={() => navigate("/")}>Cancel</Button>
      </Panel>
    </Section>
  );
};

export default CommunityNew;
