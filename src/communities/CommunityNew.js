import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import styled from "styled-components";
import Button from "../components/Button";
import ControlledInput from "../components/ControlledInput";
import { createCommunity } from "../firebase.app";
import { ErrorMsg, handleCreationErrors } from "./components/communityUtility";

const Section = styled.section`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
`;

const CommunityNew = ({ close }) => {
  const sectionRef = useRef();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCommunity(name)
      .then((res) => {
        console.log("community created succesfully");
        navigate(`/c/${name}`);
      })
      .catch((error) => setError(error.message));
  };

  return createPortal(
    <Section
      ref={sectionRef}
      onClick={(e) => {
        if (e.target === sectionRef.current) close();
      }}
    >
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
        {error !== "" && <ErrorMsg>{handleCreationErrors(error)}</ErrorMsg>}
        <Button type="submit">Create</Button>
      </form>
      <Button action={close}>Cancel</Button>
    </Section>,
    document.getElementById("root")
  );
};

export default CommunityNew;
