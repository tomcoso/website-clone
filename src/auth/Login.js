import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../firebase.app";
import ControlledInput from "../components/ControlledInput";
import Button from "../components/Button";
import AuthForm from "./components/AuthForm";
import ErrorMsg from "./components/ErrorMsg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const emailRef = useRef();
  const passRef = useRef();

  const handleSubmit = () => {
    login({ email, password })
      .then(() => {
        console.log("login successful");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  };

  return (
    <main>
      <h1>Login</h1>
      <AuthForm onKeyDown={(e) => e.key === "Enter" && handleSubmit()}>
        <ControlledInput
          type={"email"}
          id="login-email"
          state={email}
          control={setEmail}
          required={true}
          ref={emailRef}
        >
          Email
        </ControlledInput>
        <ControlledInput
          type="password"
          id="login-password"
          state={password}
          control={setPassword}
          required={true}
          ref={passRef}
        >
          Password
        </ControlledInput>
        {error && (
          <ErrorMsg>
            Email or password are incorrect, please correct them and try again.
          </ErrorMsg>
        )}
        <Button action={handleSubmit}>Log in</Button>
      </AuthForm>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
};

export default Login;
