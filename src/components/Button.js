const Button = ({ type = "button", action = undefined, children }) => {
  return (
    <button type={type} onClick={action}>
      {children}
    </button>
  );
};

export default Button;
