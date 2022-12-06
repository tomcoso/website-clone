import React from "react";
import styled from "styled-components";

const Unit = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 40ch;
`;

const Input = styled.input`
  font-size: 1rem;
  border-radius: 2px;
  border: 1px solid ${(props) => (props.invalid ? "red" : "black")};
  padding: 0.25rem 0.5rem;
`;

const ControlledInput = React.forwardRef(
  (
    {
      children,
      type,
      id,
      state,
      control,
      required = false,
      pattern = false,
      invalid,
    },
    ref = false
  ) => {
    return (
      <Unit>
        <label htmlFor={id}>{children}</label>
        {required ? (
          <Input
            id={id}
            type={type}
            value={state}
            onChange={(e) => control(e.target.value)}
            required
            {...(pattern ? (pattern = { pattern }) : undefined)}
            {...(ref ? (ref = { ref }) : undefined)}
            invalid={invalid}
          />
        ) : (
          <Input
            id={id}
            type={type}
            value={state}
            onChange={(e) => control(e.target.value)}
            {...(pattern ? (pattern = { pattern }) : undefined)}
            {...(ref ? (ref = { ref }) : undefined)}
            invalid={invalid}
          />
        )}
      </Unit>
    );
  }
);

export default ControlledInput;
