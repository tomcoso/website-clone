import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createUser } from "../firebase/firebase.users";
import ControlledInput from "../components/ControlledInput";
import Button from "../components/Button";
import RegisterErrors from "./components/RegisterErors";
import AuthForm from "./components/AuthForm";

import { checkValidity } from "./authUtility";
import VerifyEmail from "./components/VerifyEmail";

import "./styling/register.scss";
import Panel from "../communities/components/Panel";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) return;
    createUser(email, password, username)
      .then(() => {
        setVerification(true);
      })
      .catch((error) => {
        setError(error);
      });
  };
  useEffect(() => {
    document.title = "Coralit - Register";
  }, []);

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
    <main id="register-page">
      <Panel>
        <span>Welcome !!</span>
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
              invalid={error !== "" && error.match(/username/) ? true : false}
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
              invalid={error !== "" && error.match(/email/) ? true : false}
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
              invalid={error !== "" && error.match(/pass\//) ? true : false}
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
              invalid={
                error !== "" && error.match(/pass-repeat/) ? true : false
              }
            >
              Repeat password
            </ControlledInput>
            <RegisterErrors errorCode={error} />
            <Button type="submit" action={handleClientValidity}>
              Create account
            </Button>
          </AuthForm>
        ) : (
          <VerifyEmail address={email} />
        )}
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        <p>2023 Tomas Dessy © All rights reserved.</p>
      </Panel>
    </main>
  );
};

export default Register;
