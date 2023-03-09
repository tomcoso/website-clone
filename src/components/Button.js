import { useState } from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${(props) =>
    props.toggle ? "var(--action)" : "var(--panel)"};
  border: var(--action) solid 1px;
  border-radius: 50px;
  padding: 5px 10px;
  font-size: 0.8rem;
  font-weight: bold;
  color: ${(props) => (props.toggle ? "var(--panel)" : "var(--action)")};
  height: min-content;

  &:hover,
  &:focus {
    background-color: ${(props) =>
      props.disabled
        ? "var(--panel)"
        : props.toggle
        ? "var(--action)"
        : "var(--field)"};
  }

  &:active {
    transform: ${(props) =>
      props.disabled ? "translateY(0)" : "translateY(1px)"};
  }

  &:disabled {
    border: 1px solid var(--bg);
    color: var(--bg);
  }
`;

const Loading = styled.div`
  border-radius: 1rem;
  border: 2px dashed var(--action);
  border-left: none;
  padding: 0.5rem;

  @keyframes load {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  animation: 2s linear load infinite;
`;

const Button = ({
  type = "button",
  action = undefined,
  children,
  disabled,
  toggle = false,
}) => {
  const [loader, setLoader] = useState(false);

  return disabled ? (
    <StyledButton disabled>{children}</StyledButton>
  ) : (
    <StyledButton
      type={type}
      onClick={async () => {
        setLoader(true);
        action && (await action());
        setLoader(false);
      }}
      toggle={toggle}
    >
      {loader ? <Loading /> : children}
    </StyledButton>
  );
};

export default Button;
