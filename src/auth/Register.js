import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createUser } from "../firebase.app";
import ControlledInput from "../components/ControlledInput";
import Button from "../components/Button";
import RegisterErrors from "./RegisterErors";
import AuthForm from "../components/AuthForm";

import { checkValidity } from "./authUtility";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [verification, setVerification] = useState(false);

  const [error, setError] = useState("");

  const usernameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const passRepeatRef = useRef();

  const clearInputs = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setRepeatPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) return;
    createUser(email, password, username)
      .then(() => {
        clearInputs();
        setVerification(true);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleClientValidity = () => {
    const usernameVal = checkValidity(usernameRef.current);
    const emailVal = checkValidity(emailRef.current);
    const passVal = checkValidity(passRef.current);
    const passRepeatVal = checkValidity(passRepeatRef.current);

    if (usernameVal) {
      setError("username/" + usernameVal);
    } else if (emailVal) {
      setError("email/" + emailVal);
    } else if (passVal) {
      setError("pass/" + passVal);
    } else if (passRepeatVal) {
      setError("pass-repeat/" + passRepeatVal);
    } else setError("");
  };

  return (
    <main>
      <h1>Register</h1>
      {!verification ? (
        <AuthForm noValidate onSubmit={handleSubmit}>
          <ControlledInput
            type="text"
            id="register-name"
            value={username}
            control={setUsername}
            required={true}
            ref={usernameRef}
            invalid={error && error.match(/username/) ? true : false}
          >
            Username
          </ControlledInput>
          <ControlledInput
            type="email"
            id="register-email"
            value={email}
            control={setEmail}
            required={true}
            ref={emailRef}
            invalid={error && error.match(/email/) ? true : false}
          >
            E-mail address
          </ControlledInput>
          <ControlledInput
            type="password"
            id="register-password"
            value={password}
            control={setPassword}
            required={true}
            ref={passRef}
            pattern={
              "^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,16}$"
            }
            invalid={error && error.match(/pass\//) ? true : false}
          >
            Password
          </ControlledInput>
          <ControlledInput
            type="password"
            id="register-repeat-password"
            value={repeatPassword}
            control={setRepeatPassword}
            required={true}
            pattern={password}
            ref={passRepeatRef}
            invalid={error && error.match(/pass-repeat/) ? true : false}
          >
            Repeat password
          </ControlledInput>
          <RegisterErrors errorCode={error} />
          <Button type="submit" action={handleClientValidity}>
            Create account
          </Button>
        </AuthForm>
      ) : (
        <section>
          <h2>Verify email to activate your account.</h2>
        </section>
      )}
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
};

export default Register;
