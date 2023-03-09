import { Link } from "react-router-dom";
import styled from "styled-components";
import Panel from "../communities/components/Panel";

const Wrap = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 2rem;
`;

const InnerDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const NoCommunity = () => {
  return (
    <Wrap>
      <Panel>
        <InnerDiv>
          <h4>Oops! Seems like this community does not exist ... yet</h4>
          <p>X_X</p>
          <p>
            You should head <Link to={"/"}>back</Link>{" "}
          </p>
        </InnerDiv>
      </Panel>
    </Wrap>
  );
};

export default NoCommunity;
