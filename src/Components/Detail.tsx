import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import styled from "styled-components";
import { iGetMovieResult, iMovie } from "../api";
import { makeImagePath } from "../utils";

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
  overflow: hidden;
  z-index: 50;
`;
export const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center;
  height: 400px;
`;
export const BigContent = styled.div`
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -80px;
`;
export const BigTitle = styled.h3`
  font-size: 36px;
  padding: 20px;
`;
export const BigRelease = styled.p`
  font-size: 20px;
  padding: 20px;
`;
export const BigDetail = styled.p`
  font-size: 20px;
  padding-left: 20px;
`;
export const BigOverview = styled.p`
  font-size: 18px;
  margin-top: 20px;
  padding: 20px;
  border-top: 1px solid gray;
`;
export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

interface iDetail {
  data: iGetMovieResult;
  urlType: "movies" | "tvs";
}
const Detail = ({ data, urlType }: iDetail) => {
  const bigMovieMatch = useMatch(`/${urlType}/:movieId`);
  const navigate = useNavigate();
  const { scrollY } = useViewportScroll();

  const onOverlayClick = () => {
    if(urlType==="movies"){
      navigate("/");
    } else if(urlType==="tvs"){
      navigate("/tvs")
    }
     
  }
  const [clickedMovie, setClickedMovie] = useState<iGetMovieResult>(data);
  //   const [clickedData, setClickedData] = useState<iGetMovieResult | iMovie>();

  useEffect(() => {
    const findMovie =
      bigMovieMatch?.params.movieId &&
      (data?.results
        ? data.results.find(
            (movie) => String(movie.id) === bigMovieMatch.params.movieId
          )
        : data);
    setClickedMovie(findMovie as any);
  }, [bigMovieMatch, clickedMovie, data]);

  return (
    <AnimatePresence>
      {bigMovieMatch && clickedMovie ? (
        <>
          <Overlay
            onClick={onOverlayClick}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <BigMovie
            layoutId={bigMovieMatch.params.movieId}
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
                />
                <BigContent>
                  <BigTitle>{clickedMovie.title || clickedMovie.name}</BigTitle>
                  <BigRelease>{`🎬 Release Date : ${clickedMovie.release_date}`}</BigRelease>
                  <BigDetail>{`💕 popularity : ${clickedMovie.popularity}`}</BigDetail>
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
