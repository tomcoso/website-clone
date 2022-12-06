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

export { checkValidity };
