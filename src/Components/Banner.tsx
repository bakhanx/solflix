import styled from "styled-components";
import { makeImagePath_backdrop } from "../utils";
import { iGetMovieResult } from "../api";
import { CATEGORY } from "../Routes/Home";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Detail from "./Detail";

export const Container = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;
export const Title = styled.h2`
  font-size: 60px;
  @media screen and (max-width: 768px) {
    font-size: 48px;
  }
  @media screen and (max-width: 480px) {
    font-size: 36px;
  }

  margin-bottom: 20px;
  &:hover {
    cursor: pointer;
    color: red;
    transition: 0.2s ease;
  }
`;
export const Overview = styled.p`
  font-size: 28px;
  width: 50%;
  @media screen and (max-width: 768px) {
    font-size: 24px;
    width: 80%;
  }
  @media screen and (max-width: 480px) {
    font-size: 20px;
    width: 80%;
  }

`;
interface iBanner {
  data: iGetMovieResult;
  urlType: "movies" | "tvs";
}

const Banner = ({ data, urlType }: iBanner) => {
  const navigate = useNavigate();
  const [clickedData, setClickedData] = useState<iGetMovieResult>();

  const onBoxClicked = (movieId: number | string, cate: CATEGORY) => {
    setClickedData(data);
    navigate(`/${urlType}/${movieId}`);
  };

  return (
    <>
      <Container
        bgphoto={makeImagePath_backdrop(data?.results[0].backdrop_path || "")}
      >
        <Title
          onClick={() =>
            onBoxClicked(data?.results[0].id as number, CATEGORY.NOW_PLAYING)
          }
        >
          🔥 {data?.results[0].title || data?.results[0].name}
        </Title>
        <div></div>
        <Overview>{data?.results[0].overview}</Overview>
      </Container>

      <Detail
        data={clickedData as iGetMovieResult}
        urlType={urlType}
        cate={"banner"}
      />
    </>
  );
};

export default Banner;
