import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import ControlledInput from "../components/ControlledInput";
import { createCommunity } from "../firebase.app";

const CommunityNew = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCommunity(name);
    navigate(`/c/${name}`);
  };

  return (
    <main>
      <h2>NEW COMMUNITY</h2>
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
        <Button type="submit">Create</Button>
      </form>
    </main>
  );
};

export default CommunityNew;
