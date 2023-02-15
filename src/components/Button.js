import styled from "styled-components";

const StyledButton = styled.button`
  background-color: var(--panel);
  border: var(--action) solid 1px;
  border-radius: 50px;
  padding: 5px 10px;
  font-size: 1rem;
  color: var(--action);
  height: min-content;
`;

const Button = ({ type = "button", action = undefined, children }) => {
  return (
    <StyledButton type={type} onClick={action}>
      {children}
    </StyledButton>
  );
};

export default Button;
