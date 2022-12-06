import styled from "styled-components";

const ErrorMsg = styled.p`
  font-size: 0.8rem;
  font-family: monospace;
  color: red;
  padding: 0.5rem;
  background-color: rgba(255, 0, 0, 0.1);
  width: 40ch;
`;

const RegisterErrors = ({ errorCode }) => {
  const displayMessage = (error) => {
    switch (error) {
      case "auth/email-already-in-use":
        return "Email is already in use";
      case "auth/username-already-in-use":
        return "Username is already in use";

      case "username/novalue":
        return "Please choose a username";

      case "email/mismatch":
        return "Email address is incorrect";
      case "email/novalue":
        return "Please fill in your email address";

      case "pass/mismatch":
        return "Password must contain at least one upper case letter, one lower case letter, one numerical character, and be between 8 - 16 characters long";
      case "pass/novalue":
        return "Please write a password";

      case "pass-repeat/mismatch":
        return "Both passwords must match";
      case "pass-repeat/novalue":
        return "Please repeat your password";

      default:
        return "There has been an error with your submition. Please try again";
    }
  };

  return <>{errorCode && <ErrorMsg>{displayMessage(errorCode)}</ErrorMsg>}</>;
};

export default RegisterErrors;
