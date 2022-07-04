import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { getTv_on_the_air, iGetTvResult } from "../api";
import { makeImagePath } from "../utils";

// ================================================
//                Const
// ================================================
const OFFSET = 6;

// ================================================
//                Component
// ================================================

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  background-image: linear-gradient(
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Title = styled.div`
  font-size: 58px;
  margin-bottom: 20px;
`;
const Overview = styled.div`
  font-size: 28px;
  width: 50%;
`;

const Slider = styled.div`
  width: 95%;
  margin:auto;
  position: relative;
`;

const Row = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
`;
const Box = styled.div`
  height: 200px;
  background-color: white;
`;
// ================================================
//                TV
// ================================================

const Tv = () => {
  const { data, isLoading } = useQuery<iGetTvResult>(
    ["tv", "on_the_air"],
    getTv_on_the_air
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>

          <Slider>
            <Row>
              {data?.results.slice(1).map(() => (
                <Box></Box>
              ))}
            </Row>
          </Slider>
        </>
      )}
    </Wrapper>
  );
};

export default Tv;
