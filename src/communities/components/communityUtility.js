import styled from "styled-components";

const ErrorMsg = styled.p`
  font-size: 0.8rem;
  font-family: monospace;
  color: red;
  padding: 0.5rem;
  background-color: rgba(255, 0, 0, 0.1);
  width: 40ch;
`;

const handleCreationErrors = (error) => {
  switch (error) {
    case "community-already-exists":
      return "Community already exists. Please choose another name.";
    case "Missing or insufficient permissions.":
      return "You have to verify your email address before you can create a community.";
    default:
      return "Unexpected problem. Please try again.";
  }
};

export { ErrorMsg, handleCreationErrors };
