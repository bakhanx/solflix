import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import styled from "styled-components";
import { iGetMovieResult } from "../api";
import { makeImagePath } from "../utils";
import { CATEGORY } from "../Routes/Home";
import { useRecoilState } from "recoil";
import { onOffOverlay } from "../atom";

export const BigMovie = styled(motion.div)<{ scrolly: number }>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: ${(props) => props.scrolly + 100}px;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;

  z-index: 50;
  @media screen and (max-width: 1024px) {
    width: 60vw;
  }
  @media screen and (max-width: 480px) {
    height: 70vh;
  }
`;
export const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center;
  height: 400px;
  display: flex;
  align-items: end;
  @media screen and (max-width: 1024px) {
    height: 300px;
  }
  border-radius: 15px 15px 0px 0px;
`;
export const BigTitle = styled.h3`
  font-size: 36px;
  padding: 20px;
  @media screen and (max-width: 1024px) {
    font-size: 24px;
  }
`;
export const BigContent = styled.div`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
`;
export const BigDetail = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;
export const BigRelease = styled.p`
  font-size: 16px;
  @media screen and (max-width: 1024px) {
    font-size: 12px;
  }
`;
export const BigPopular = styled.p`
  font-size: 16px;
  @media screen and (max-width: 1024px) {
    font-size: 12px;
  }
`;
export const BigOverview = styled.p`
  font-size: 18px;
  padding: 20px;
  border-top: 1px solid gray;
  height: 100px;
  overflow: scroll;
  scrollbar-width: none; //FireFox
  -ms-overflow-style: none; // IE, Edge
  ::-webkit-scrollbar {
    // Chrome, Safari, Opera
    display: none;
    width: 0px;
  }

  @media screen and (max-width: 1024px) {
    font-size: 16px;
    height: 300px;
  }
  @media screen and (max-width: 480px) {
    font-size: 12px;
    height: 100px;
    padding: 10px;
  }
`;
export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index:15;
`;

interface iDetail {
  data: iGetMovieResult;
  urlType: "movies" | "tvs";
  cate: CATEGORY | "BANNER";
}
const Detail = ({ data, urlType, cate }: iDetail) => {
  const bigMovieMatch = useMatch(`/${urlType}/:movieId`);
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();
  const isOnOverlay = useRecoilState(onOffOverlay);

  const onOverlayClick = () => {
    if (urlType === "movies") {
      navigate("/");
    } else if (urlType === "tvs") {
      navigate("/tvs");
    }
  };
  const [clickedMovie, setClickedMovie] = useState<iGetMovieResult | null>(
    data
  );
  useEffect(() => {
    const findMovie =
      bigMovieMatch?.params.movieId &&
      (data?.results
        ? data.results.find(
            (movie) => String(movie.id) === bigMovieMatch.params.movieId
          )
        : data);
    setClickedMovie(findMovie as any);
  }, [bigMovieMatch, clickedMovie, data, cate]);

  return (
    <AnimatePresence>
      {bigMovieMatch?.params.movieId && clickedMovie && isOnOverlay ? (
        <>
          <Overlay
            onClick={onOverlayClick}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <BigMovie
            layoutId={isOnOverlay + bigMovieMatch.params.movieId}
            scrolly={scrollY.get()}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.5 } }}
          >
            {clickedMovie && (
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                      clickedMovie.backdrop_path,
                      clickedMovie.poster_path,
                      "w500"
                    )})`,
                  }}
                >
                  <BigTitle>{clickedMovie.title || clickedMovie.name}</BigTitle>
                </BigCover>
                <BigContent>
                  <BigDetail>
                    <BigRelease>{`🎬 Release Date : ${
                      clickedMovie.release_date || clickedMovie.first_air_date
                    }`}</BigRelease>
                    <BigPopular>{`💕 popularity : ${clickedMovie.popularity}`}</BigPopular>
                  </BigDetail>
                  <BigOverview>
                    {clickedMovie.overview !== ""
                      ? clickedMovie.overview
                      : "coming soon..."}
                  </BigOverview>
                </BigContent>
              </>
            )}
          </BigMovie>
        </>
      ) : (
        "Coming soon"
      )}
    </AnimatePresence>
  );
};

export default Detail;
