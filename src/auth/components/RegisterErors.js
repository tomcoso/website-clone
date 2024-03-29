import { ErrorMsg } from "../authUtility";

const RegisterErrors = ({ errorCode }) => {
  const displayMessage = (error) => {
    switch (error) {
      case "auth/email-already-in-use":
        return "Email is already in use";
      case "auth/username-already-in-use":
        return "Username is already in use";

      case "username/mismatch":
        return "Username can't contain spaces or special characters";
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
