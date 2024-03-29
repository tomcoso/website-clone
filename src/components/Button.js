import { useState } from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${(props) =>
    props.toggle ? "var(--accent)" : "var(--panel)"};
  border: var(--accent) solid 1px;
  border-radius: 50px;
  padding: ${(props) => props.padding};
  font-size: 0.8rem;
  font-weight: bold;
  color: ${(props) => (props.toggle ? "var(--panel)" : "var(--accent)")};
  height: min-content;
  cursor: pointer;
  display: grid;
  place-content: center;

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
    cursor: default;
  }
`;

const Loading = styled.div`
  border-radius: 100%;
  border: 2px dashed var(--accent);
  border-left: none;
  padding: 0.5rem;
  aspect-ratio: 1/1;
  max-width: 1rem;

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
  padding = "5px 10px",
}) => {
  const [loader, setLoader] = useState(false);

  return disabled ? (
    <StyledButton padding={padding} disabled>
      {children}
    </StyledButton>
  ) : (
    <StyledButton
      type={type}
      onClick={async () => {
        setLoader(true);
        action && (await action());
        setLoader(false);
      }}
      toggle={toggle}
      padding={padding}
    >
      {loader ? <Loading /> : children}
    </StyledButton>
  );
};

export default Button;
