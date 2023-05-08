import styled from "styled-components";

const checkValidity = (elem) => {
  const val = elem.validity;
  if (val.valueMissing) {
    return "novalue";
  } else if (val.typeMismatch || val.patternMismatch) {
    return "mismatch";
  } else if (val.tooLong) {
    return "long";
  } else if (val.tooShort) {
    return "short";
  }
};

const ErrorMsg = styled.p`
  font-size: 0.8rem;
  font-family: monospace;
  color: red;
  padding: 0.5rem;
  background-color: rgba(255, 0, 0, 0.1);
  width: 100%;
`;

export { checkValidity, ErrorMsg };
