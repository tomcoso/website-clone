import styled from "styled-components";

const Circle = styled.div`
  border-radius: 100%;
  width: 20px;
  height: 20px;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
  }
`;

const CommLogo = ({ url }) => {
  return (
    <Circle>
      <img src={url} alt={"community profile"} />
    </Circle>
  );
};

export default CommLogo;
