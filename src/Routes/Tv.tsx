import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
  getTv_on_the_air,
  getTv_popular,
  getTv_top_rate,
  iGetTvResult,
} from "../api";
import { makeImagePath_backdrop, makeImagePath_poster } from "../utils";

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
  margin: auto;
  position: relative;
  top: -150px;
  margin-bottom: 220px;
`;

const Row = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  height: 200px;
  background-color: white;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  font-size: 20px;
  &:hover {
    background-image: url(${(props) => props.bgPhoto});
    scale: 1.3;
    top: 45px;
    color: red;
  }
`;

const BtnWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 200px;
  width: 100%;
`;
const SlideBtn = styled.button`
  font-size: 30px;
  height: 80%;
  z-index: 1000;
  color: #dfdfdfdc;
  background-color: rgba(0, 0, 0, 0.1);
  border-style: none;
  cursor: pointer;
  &:hover {
    color: white;
    scale: 1.5;
  }
`;
const Filter = styled.div`
  font-size: 36px;
  padding-bottom: 15px;
`;


// ================================================
//                TV
// ================================================

const Tv = () => {
  const { data: data_on_the_air, isLoading: isLoading_on_the_air } =
    useQuery<iGetTvResult>(["tv", "on_the_air"], getTv_on_the_air);
  const { data: data_popular, isLoading: isLoading_popular } =
    useQuery<iGetTvResult>(["tv", "popular"], getTv_popular);
  const { data: data_top_rate, isLoading: isLoading_top_rate } =
    useQuery<iGetTvResult>(["tv", "top_rate"], getTv_top_rate);

  const [index, setIndex] = useState([0, 0, 0]);

  const bigTvMatch = useMatch("/tv/:tvId");

  const IncreaseIndex = (num: number) => {
    let temp = [...index];
    temp[num] === 2 ? (temp[num] = 0) : (temp[num] += 1);
    setIndex(temp);
  };
  const DecreaseIndex = (num: number) => {
    let temp = [...index];
    temp[num] === 0 ? (temp[num] = 2) : (temp[num] -= 1);
    setIndex(temp);
  };

  const navigate = useNavigate();

  const onBoxedClicked = (movieId: number) => {
    navigate(`/videos/${movieId}`);
  };

  return (
    <Wrapper>
      {isLoading_on_the_air ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath_backdrop(
              data_on_the_air?.results[0].backdrop_path || ""
            )}
          >
            <Title>{data_on_the_air?.results[0].name}</Title>
            <Overview>{data_on_the_air?.results[0].overview}</Overview>
          </Banner>

          {/* On The Air */}
          <Slider>
            <AnimatePresence>
              <Filter key="key_on_the_air">On The Air</Filter>
              <BtnWrapper>
                <SlideBtn onClick={() => DecreaseIndex(0)}>{`<`}</SlideBtn>
                <SlideBtn onClick={() => IncreaseIndex(0)}>{`>`}</SlideBtn>
              </BtnWrapper>
              <Row>
                {data_on_the_air?.results
                  .slice(1)
                  .slice(index[0] * OFFSET, index[0] * OFFSET + OFFSET)
                  .map((data) => (
                    <Box
                      layoutId={`ontheair-${data.id}`}
                      onClick={() => onBoxedClicked(data.id)}
                      key={data.id}
                      bgPhoto={
                        data.backdrop_path
                          ? makeImagePath_backdrop(data.backdrop_path, "w500")
                          : makeImagePath_poster(data.poster_path)
                      }
                    >
                      {data.name}
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* Popular */}
          <Slider>
            <Filter key="key_popular">Popular</Filter>
            <BtnWrapper>
              <SlideBtn onClick={() => DecreaseIndex(1)}>{`<`}</SlideBtn>
              <SlideBtn onClick={() => IncreaseIndex(1)}>{`>`}</SlideBtn>
            </BtnWrapper>
            <Row>
              {data_popular?.results
                .slice(1)
                .slice(index[1] * OFFSET, index[1] * OFFSET + OFFSET)
                .map((data) => (
                  <Box
                    key={data.id}
                    bgPhoto={
                      data.backdrop_path
                        ? makeImagePath_backdrop(data.backdrop_path, "w500")
                        : makeImagePath_poster(data.poster_path, "w500")
                    }
                  >
                    {data.name}
                  </Box>
                ))}
            </Row>
          </Slider>
          {/* Top Rate */}
          <Slider>
            <Filter key="key_top_rate">Top Rate</Filter>
            <BtnWrapper>
              <SlideBtn onClick={() => DecreaseIndex(2)}>{`<`}</SlideBtn>
              <SlideBtn onClick={() => IncreaseIndex(2)}>{`>`}</SlideBtn>
            </BtnWrapper>
            <Row>
              {data_top_rate?.results
                .slice(1)
                .slice(index[2] * OFFSET, index[2] * OFFSET + OFFSET)
                .map((data) => (
                  <Box
                    key={data.id}
                    bgPhoto={
                      data.backdrop_path
                        ? makeImagePath_backdrop(data.backdrop_path, "w500")
                        : makeImagePath_poster(data.poster_path, "w500")
                    }
                  >
                    {data.name}
                  </Box>
                ))}
            </Row>
          </Slider>

          {/* Detail Pop up */}
          <AnimatePresence>
            {bigTvMatch ? " " : ""}


          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Tv;
