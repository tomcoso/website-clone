import styled from "styled-components";

const Circle = styled.div`
  border-radius: 100%;
  width: ${(p) => p.size};
  height: ${(p) => p.size};
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
  }
`;

const CommLogo = ({ url, size = "20px" }) => {
  return (
    <Circle size={size}>
      <img src={url} alt={"community profile"} />
    </Circle>
  );
};

export default CommLogo;
