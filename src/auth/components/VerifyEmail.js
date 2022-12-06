import { Link } from "react-router-dom";
import styled from "styled-components";

const Section = styled.section`
  width: 100vw;
  height: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const VerifyEmail = ({ address }) => {
  return (
    <Section>
      <h3>Please verify your email address to activate your account</h3>
      <p>
        We sent a verification email to {address}. Click on the link we sent you
        to activate your account. It may take a few minutes to arrive, remember
        to check the spam folder.
      </p>
      <p>
        Click <Link to="/">here</Link> to continue.
      </p>
    </Section>
  );
};

export default VerifyEmail;
