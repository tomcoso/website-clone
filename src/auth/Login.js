import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../firebase.app";
import ControlledInput from "../components/ControlledInput";
import Button from "../components/Button";

const Login = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main>
      <h1>Login</h1>
      <form>
        <ControlledInput
          type={"email"}
          id="login-email"
          state={email}
          control={setEmail}
          required={true}
        >
          Email
        </ControlledInput>
        <ControlledInput
          type="password"
          id="login-password"
          state={password}
          control={setPassword}
          required={true}
        >
          Password
        </ControlledInput>
        <Button action={() => login({ email, password })}>Log in</Button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
};

export default Login;
