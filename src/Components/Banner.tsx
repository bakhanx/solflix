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
  padding: 60px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 1),
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;
export const Title = styled.h2`
  font-size: 58px;
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
`;
interface iBanner {
  data: iGetMovieResult;
}

const Banner = ({ data }: iBanner) => {
  const navigate = useNavigate();
  const [clickedData, setClickedData] = useState<iGetMovieResult>();

  const onBoxClicked = (movieId: number | string, cate: CATEGORY) => {
    setClickedData(data);
    navigate(`/movies/${movieId}`);
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
          🔥 {data?.results[0].title}
        </Title>
        <div></div>
        <Overview>{data?.results[0].overview}</Overview>
      </Container>

      <Detail data={clickedData as iGetMovieResult} />
    </>
  );
};

export default Banner;
